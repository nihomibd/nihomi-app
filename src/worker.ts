export interface Env {
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
  BACKEND_ORIGIN?: string;
}

const DEFAULT_BACKEND = "https://ais-pre-wn2umbi6yiubu5fbcbxn53-774523299323.asia-southeast1.run.app";

export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // Handle API requests
    if (url.pathname.startsWith("/api/")) {
      // CORS Preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
            "Access-Control-Max-Age": "86400",
          },
        });
      }

      const backendOrigin = env.BACKEND_ORIGIN || DEFAULT_BACKEND;
      const targetUrl = new URL(url.pathname + url.search, backendOrigin);

      const forwardHeaders = new Headers(request.headers);
      const targetHost = new URL(backendOrigin).host;
      forwardHeaders.set("host", targetHost);
      forwardHeaders.set("x-forwarded-host", url.host);
      forwardHeaders.set("x-forwarded-proto", url.protocol.replace(":", ""));

      try {
        const upstreamResponse = await fetch(targetUrl.toString(), {
          method: request.method,
          headers: forwardHeaders,
          body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
          redirect: "follow",
        });

        const responseHeaders = new Headers(upstreamResponse.headers);
        responseHeaders.set("Access-Control-Allow-Origin", "*");
        responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin");
        responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        responseHeaders.set("X-Gateway-Proxy", "Cloudflare-Worker-Nihomi");

        return new Response(upstreamResponse.body, {
          status: upstreamResponse.status,
          statusText: upstreamResponse.statusText,
          headers: responseHeaders,
        });
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            error: "Backend upstream unavailable",
            message: err?.message || String(err),
            timestamp: new Date().toISOString(),
          }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    // Serve static assets with single-page-application routing
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  },
};
