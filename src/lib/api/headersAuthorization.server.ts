import 'server-only';
import { getTokenServer } from '../getTokenServer';


const headersAuthorization = async (): Promise<Record<string, string>> => {
    const token = await getTokenServer();

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
};

export default headersAuthorization;
