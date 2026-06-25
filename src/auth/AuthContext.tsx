import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser, logoutSession, refreshSession, signInWithGoogle, type AuthUser } from './authApi';
import { tokenStorage } from './tokenStorage';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  signInWithGoogleCredential: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const bootstrapped = useRef(false);

  const setUnauthenticated = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const saveSession = useCallback((session: { user: AuthUser; accessToken: string; refreshToken: string }) => {
    tokenStorage.setTokens({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    });
    setUser(session.user);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    if (bootstrapped.current) {
      return;
    }

    bootstrapped.current = true;

    const bootstrap = async () => {
      const accessToken = tokenStorage.getAccessToken();
      const refreshToken = tokenStorage.getRefreshToken();

      if (!accessToken && !refreshToken) {
        setUnauthenticated();
        return;
      }

      if (accessToken) {
        try {
          const currentUser = await getCurrentUser(accessToken);
          setUser(currentUser);
          setStatus('authenticated');
          return;
        } catch {
          // Fall through and try the refresh token.
        }
      }

      if (!refreshToken) {
        setUnauthenticated();
        return;
      }

      try {
        const session = await refreshSession(refreshToken);
        saveSession(session);
      } catch {
        setUnauthenticated();
      }
    };

    void bootstrap();
  }, [saveSession, setUnauthenticated]);

  const signInWithGoogleCredential = useCallback(async (credential: string) => {
    const session = await signInWithGoogle(credential);
    saveSession(session);
  }, [saveSession]);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();

    tokenStorage.clear();
    setUser(null);
    setStatus('unauthenticated');

    if (refreshToken) {
      await logoutSession(refreshToken).catch(() => undefined);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    status,
    user,
    isAuthenticated: status === 'authenticated',
    signInWithGoogleCredential,
    logout,
  }), [logout, signInWithGoogleCredential, status, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return value;
}
