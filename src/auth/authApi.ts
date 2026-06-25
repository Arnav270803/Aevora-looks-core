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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api';

class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    accessToken?: string;
  } = {},
): Promise<T> {
  const headers = new Headers();

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    const payload = await response.json().catch(() => null);
    const message = payload?.error?.message ?? fallback;
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function signInWithGoogle(credential: string) {
  return request<AuthSession>('/auth/google', {
    method: 'POST',
    body: { credential },
  });
}

export function refreshSession(refreshToken: string) {
  return request<AuthSession>('/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}

export function logoutSession(refreshToken: string) {
  return request<void>('/auth/logout', {
    method: 'POST',
    body: { refreshToken },
  });
}

export async function getCurrentUser(accessToken: string) {
  const response = await request<{ user: AuthUser }>('/auth/me', {
    accessToken,
  });

  return response.user;
}
