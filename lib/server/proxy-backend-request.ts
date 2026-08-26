import { auth } from "@/auth";

const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);
const BODYLESS_RESPONSE_STATUSES = new Set([204, 205, 304]);

function getBackendApiBaseUrl(): URL {
  const configuredUrl = process.env.BACKEND_API_URL;
  if (!configuredUrl) throw new Error("BACKEND_API_URL is not configured");

  return new URL(
    "api/v1/",
    configuredUrl.endsWith("/") ? configuredUrl : `${configuredUrl}/`,
  );
}

export async function proxyBackendRequest(
  request: Request,
  backendPath: string,
  options?: { forwardHeaders?: string[] },
): Promise<Response> {
  try {
    const session = await auth();
    const incomingUrl = new URL(request.url);
    const backendUrl = new URL(
      backendPath.replace(/^\/+/, ""),
      getBackendApiBaseUrl(),
    );
    backendUrl.search = incomingUrl.search;

    const headers = new Headers();
    const contentType = request.headers.get("content-type");
    const accept = request.headers.get("accept");
    const contentLength = request.headers.get("content-length");
    if (contentType) headers.set("content-type", contentType);
    if (accept) headers.set("accept", accept);
    if (contentLength) headers.set("content-length", contentLength);
    if (session?.accessToken) {
      headers.set("authorization", `Bearer ${session.accessToken}`);
    }
    for (const headerName of options?.forwardHeaders ?? []) {
      const value = request.headers.get(headerName);
      if (value) headers.set(headerName, value);
    }

    const method = request.method.toUpperCase();
    let requestBody: BodyInit | undefined;
    if (!METHODS_WITHOUT_BODY.has(method)) {
      if (contentType?.toLowerCase().startsWith("multipart/form-data")) {
        const incomingForm = await request.formData();
        const outgoingForm = new FormData();
        for (const [name, value] of incomingForm.entries()) {
          if (typeof value === "string") {
            outgoingForm.append(name, value);
          } else {
            outgoingForm.append(name, value, value.name || "upload");
          }
        }
        requestBody = outgoingForm;
        headers.delete("content-type");
        headers.delete("content-length");
      } else {
        requestBody = await request.arrayBuffer();
      }
    }
    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body: requestBody,
      cache: "no-store",
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    const responseContentType = backendResponse.headers.get("content-type");
    const location = backendResponse.headers.get("location");
    if (responseContentType) {
      responseHeaders.set("content-type", responseContentType);
    }
    if (location) responseHeaders.set("location", location);

    const hasResponseBody =
      method !== "HEAD" &&
      !BODYLESS_RESPONSE_STATUSES.has(backendResponse.status);

    return new Response(
      hasResponseBody ? await backendResponse.arrayBuffer() : null,
      {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        headers: responseHeaders,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Backend proxy request failed";
    return Response.json({ message }, { status: 502 });
  }
}