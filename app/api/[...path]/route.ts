import { proxyBackendRequest } from "@/lib/server/proxy-backend-request";

type ProxyContext = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, context: ProxyContext) {
  const { path } = await context.params;
  return proxyBackendRequest(request, path.map(encodeURIComponent).join("/"));
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const HEAD = proxy;
export const OPTIONS = proxy;