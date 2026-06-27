type RequestOptions = {
  method?: string;
  body?: unknown;
  accessToken?: string | null;
};

const DEFAULT_BACKEND_URL = 'http://localhost:4000';

export const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
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

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function normalizeApiBaseUrl(rawUrl: string | undefined) {
  const trimmed = (rawUrl || DEFAULT_BACKEND_URL).replace(/\/+$/, '');

  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}
