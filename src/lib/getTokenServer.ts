import 'server-only';
import { auth } from './auth';
import { headers } from 'next/headers';

export const getTokenServer = async () => {
  const { token } = await (auth() as any).api.getToken({
    headers: await headers(),
  });

  console.log(token)

  return token || null;
};
