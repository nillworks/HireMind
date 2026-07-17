import { headers } from 'next/headers';
import { auth } from './auth';

const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
};

export default getUserSession;
