interface Env {
  BACKEND_URL?: string;
  API_URL?: string;
  APP_URL?: string;
}

interface EventContext<E = any> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: E;
  params: Record<string, string | string[]>;
  data: Record<string, any>;
}

// Cloudflare Pages Functions Gateway for Nihomi API
export const onRequest = async (context: EventContext<Env>): Promise<Response> => {
  const url = new URL(context.request.url);

  // Handle CORS preflight options directly at the edge
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  // Determine upstream backend base URL
  const backendBase =
    context.env.BACKEND_URL ||
    context.env.API_URL ||
    context.env.APP_URL ||
    'https://ais-pre-wn2umbi6yiubu5fbcbxn53-774523299323.asia-southeast1.run.app';

  // Construct target backend API destination
  const targetUrl = new URL(url.pathname + url.search, backendBase);

  // Clone headers and forward Authorization and Content-Type
  const reqHeaders = new Headers(context.request.headers);
  reqHeaders.set('X-Forwarded-Host', url.host);
  reqHeaders.set('X-Forwarded-Proto', url.protocol.replace(':', ''));

  const requestInit: RequestInit = {
    method: context.request.method,
    headers: reqHeaders,
    redirect: 'follow',
  };

  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    requestInit.body = await context.request.arrayBuffer();
  }

  try {
    const upstreamResponse = await fetch(targetUrl.toString(), requestInit);

    // Forward response with cross-origin headers
    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: 'Backend Gateway Connection Failed',
        message: err.message || 'Unable to connect to upstream Nihomi backend',
        target: targetUrl.toString()
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
};
