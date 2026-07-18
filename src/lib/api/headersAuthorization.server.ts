import 'server-only';
import { cookies } from 'next/headers';

const headersAuthorization = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

export default headersAuthorization;
