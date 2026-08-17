import { proxyBackendRequest } from "@/lib/server/proxy-backend-request";

type AuthProxyContext = { params: Promise<{ all: string[] }> };

async function proxy(request: Request, context: AuthProxyContext) {
  const { all } = await context.params;
  return proxyBackendRequest(
    request,
    ["auth", ...all].map(encodeURIComponent).join("/"),
  );
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;