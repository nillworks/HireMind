import { toNextJsHandler } from 'better-auth/next-js';

const handler = async (request: Request) => {
  const { auth } = await import('@/lib/auth');
  const { POST, GET } = toNextJsHandler(auth());
  const method = request.method;
  if (method === 'POST') return POST(request);
  return GET(request);
};

export const POST = handler;
export const GET = handler;
