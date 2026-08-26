import { proxyBackendRequest } from "@/lib/server/proxy-backend-request";

export async function POST(request: Request) {
  return proxyBackendRequest(request, "wallets/topup-requests/webhook", {
    forwardHeaders: ["X-Webhook-Signature"],
  });
}
