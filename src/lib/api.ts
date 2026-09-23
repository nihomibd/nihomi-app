const TOKEN_KEY = 'nihomi_auth_token';

export function getApiBaseUrl(): string {
  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv && typeof metaEnv.VITE_API_URL === 'string') {
      return metaEnv.VITE_API_URL.replace(/\/$/, '');
    }
  } catch {
    // Ignore in non-vite environments
  }
  return '';
}

export function formatApiUrl(endpoint: string): string {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const base = getApiBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return base ? `${base}${normalizedEndpoint}` : normalizedEndpoint;
}

const memoryStorage = new Map<string, string>();

export function getStoredToken(): string | null {
  try {
    if (typeof window !== 'undefined') {
      if (window.localStorage) {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) return token;

        // Fallback: check Supabase auth token stored by supabase-js
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            const item = localStorage.getItem(key);
            if (item) {
              try {
                const parsed = JSON.parse(item);
                const supabaseToken = parsed.access_token || parsed.currentSession?.access_token;
                if (supabaseToken) {
                  setStoredToken(supabaseToken);
                  return supabaseToken;
                }
              } catch {}
            }
          }
        }
      }

      if (window.sessionStorage) {
        const sessionToken = sessionStorage.getItem(TOKEN_KEY);
        if (sessionToken) return sessionToken;
      }

      // Cookie fallback
      if (typeof document !== 'undefined' && document.cookie) {
        const match = document.cookie.match(/(?:^|;\s*)nihomi_auth_token=([^;]+)/);
        if (match && match[1]) {
          return decodeURIComponent(match[1]);
        }
      }
    }
  } catch {
    // Storage access blocked or restricted (e.g. cross-origin iframe)
  }
  return memoryStorage.get(TOKEN_KEY) || null;
}

export function setStoredToken(token: string | null): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  } catch {
    // Storage access blocked or restricted
  }
  if (token) {
    memoryStorage.set(TOKEN_KEY, token);
  } else {
    memoryStorage.delete(TOKEN_KEY);
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = formatApiUrl(endpoint);

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}
