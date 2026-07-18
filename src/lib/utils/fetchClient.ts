let cachedToken: string | null = null;

const fetchToken = async (): Promise<string | null> => {
  try {
    const res = await fetch("/api/auth/token", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token ?? null;
  } catch {
    return null;
  }
};

const fetchClient = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!cachedToken) {
    cachedToken = await fetchToken();
  }

  const authHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (cachedToken) {
    authHeaders["Authorization"] = `Bearer ${cachedToken}`;
  }

  const res = await fetch(`${apiUrl}${endpoint}`, {
    credentials: "include",
    headers: {
      ...authHeaders,
      ...options?.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    cachedToken = await fetchToken();
    if (cachedToken) {
      authHeaders["Authorization"] = `Bearer ${cachedToken}`;
      const retryRes = await fetch(`${apiUrl}${endpoint}`, {
        credentials: "include",
        headers: {
          ...authHeaders,
          ...options?.headers,
        },
        ...options,
      });
      if (!retryRes.ok) {
        const error = await retryRes.json().catch(() => ({}));
        throw new Error(error?.message || "Something went wrong");
      }
      return retryRes.json();
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Something went wrong");
  }

  return res.json();
};

export default fetchClient;
