import 'server-only';
import { auth } from './auth';
import { headers } from 'next/headers';

export const getTokenServer = async () => {
  const { token } = await (auth() as any).api.getToken({
    headers: await headers(),
  });

  return token || null;
};
