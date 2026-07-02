import { apiRequest } from '../api/client';

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export function signInWithGoogle(credential: string) {
  return apiRequest<AuthSession>('/auth/google', {
    method: 'POST',
    body: { credential },
  });
}

export function signInForDevelopment() {
  return apiRequest<AuthSession>('/auth/dev', {
    method: 'POST',
    body: {
      email: 'dev@aevora.local',
      name: 'Aevora Dev User',
    },
  });
}

export function refreshSession(refreshToken: string) {
  return apiRequest<AuthSession>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}

export function logoutSession(refreshToken: string) {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
    body: { refreshToken },
  });
}

export async function getCurrentUser(accessToken: string) {
  const response = await apiRequest<{ user: AuthUser }>('/auth/me', {
    accessToken,
  });

  return response.user;
}
