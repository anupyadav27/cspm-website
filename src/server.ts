import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// HSTS. Every variant of this site — http://onamsecurity.com, https://onamsecurity.com,
// http://www — returns 200 with a full page, and the ONLY thing sending a visitor to
// https://www is a client-side location.replace in __root.tsx. That means a first visit
// renders completely over plain HTTP before any redirect fires.
//
// A server-side 301 is not available here: TLS terminates at the NLB, nginx receives no
// X-Forwarded-Proto and so cannot tell the schemes apart, and both ingress mechanisms for
// a path-preserving redirect are blocked by cluster policy (see
// deploy/apex-redirect-ingress.yaml for that investigation). HSTS is the part that IS
// fixable here: after one HTTPS visit the browser refuses plain HTTP for this origin
// outright, without asking the network.
//
// includeSubDomains is safe: the ACM cert is SAN onamsecurity.com + *.onamsecurity.com,
// so every present and future subdomain is covered. `preload` is deliberately NOT set —
// preload list removal takes months, and it should only be added once this has run
// unremarkably for a while.
//
// Sent unconditionally. RFC 6797 requires a browser to ignore HSTS delivered over plain
// HTTP, so the header is inert on the HTTP variant rather than wrong.
const HSTS = "max-age=31536000; includeSubDomains";

// HTML documents went out with NO Cache-Control at all, while hashed assets under
// /assets/ correctly carry `public, max-age=31536000, immutable`. With no directive
// a browser falls back to heuristic caching and may reuse the page shell for a
// while — which is why a deploy could go live, be verifiable with curl, and still
// show the previous page to someone who had visited before. It looks like a broken
// deploy and is not one.
//
// `no-cache` does NOT mean "do not store". It means store it and revalidate before
// reuse, so an unchanged page still costs a 304 and a changed one is picked up on
// the next navigation. That is the correct setting for a server-rendered shell whose
// content changes on every deploy while its URL does not.
//
// Deliberately scoped to HTML: the immutable asset headers are right and must not be
// touched, and an existing Cache-Control is left alone so a route can opt out.
const HTML_CACHE_CONTROL = "no-cache";

function withSecurityHeaders(response: Response): Response {
  // Response headers can be immutable depending on how the body was constructed, so
  // rebuild rather than mutating in place.
  const headers = new Headers(response.headers);
  headers.set("Strict-Transport-Security", HSTS);
  if (
    !headers.has("Cache-Control") &&
    (headers.get("Content-Type") ?? "").includes("text/html")
  ) {
    headers.set("Cache-Control", HTML_CACHE_CONTROL);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return withSecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
