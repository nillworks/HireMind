const fetchClient = async <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${apiUrl}${endpoint}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || 'Something went wrong');
  }

  return res.json();
};

export default fetchClient;
