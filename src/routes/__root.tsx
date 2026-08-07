import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_URL, GSC_VERIFICATION } from "../lib/seo";
import { analyticsScripts } from "../lib/analytics";
import { ConsentBanner } from "../components/site/ConsentBanner";

const STRUCTURED_DATA = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Onam Security",
    alternateName: "Onam",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-512.png`,
    description:
      "Unified cloud security platform: CSPM, CIEM, attack paths, threat detection, and compliance across AWS, Azure, GCP, OCI, Alibaba, IBM, and Kubernetes. 100% agentless.",
    slogan: "One graph. Every cloud. Complete security picture.",
    knowsAbout: [
      "Cloud Security Posture Management (CSPM)",
      "Cloud Infrastructure Entitlement Management (CIEM)",
      "Cloud-Native Application Protection Platform (CNAPP)",
      "Attack path analysis",
      "Cloud threat detection and response (CDR)",
      "Cloud compliance automation",
      "Kubernetes security",
    ],
    // sameAs consolidates the brand entity across properties. It is also how
    // Google disambiguates "Onam Security" from the Onam festival — add every
    // official profile as it goes live (LinkedIn, GitHub, Crunchbase).
    sameAs: [
      "https://x.com/onamsecurity",
      "https://www.youtube.com/@Onamsecurity",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Onam Security",
    alternateName: "Onam Security — CSPM & Cloud Security Platform",
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
  },
];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[#0B1220]">Page not found</h2>
        <p className="mt-2 text-sm text-[#64748B]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-[10px] bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-[#0B1220]">This page didn't load</h1>
        <p className="mt-2 text-sm text-[#64748B]">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-[10px] bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-[10px] border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-medium text-[#0B1220] transition-colors hover:bg-[#F1F5F9]">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Onam Security — Unified CSPM & Cloud Security Platform" },
      {
        name: "description",
        content:
          "Unified CSPM & cloud security platform: misconfigurations, identity risk, attack paths, threat detection & compliance across AWS, Azure, GCP, OCI, Alibaba, IBM & Kubernetes. 100% agentless.",
      },
      { name: "author", content: "Onam Security" },
      { name: "theme-color", content: "#FFFFFF" },
      // Emitted only when a token is configured — an empty content attribute
      // reads to Google as a failed verification.
      ...(GSC_VERIFICATION ? [{ name: "google-site-verification", content: GSC_VERIFICATION }] : []),
      { property: "og:title", content: "Onam Security — Unified CSPM & Cloud Security Platform" },
      {
        property: "og:description",
        content:
          "One platform for CSPM, CIEM, attack paths, threat detection, and compliance across AWS, Azure, GCP, OCI, Alibaba, IBM, and Kubernetes.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Onam Security" },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@onamsecurity" },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "alternate",
        type: "application/rss+xml",
        title: "Onam Security — Blog & Learn",
        href: `${SITE_URL}/rss.xml`,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    // Consent-free providers only (Plausible). GA4 is cookie-setting, so it is
    // injected client-side after opt-in by ConsentBanner — never from here.
    scripts: analyticsScripts(),
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* NLB terminates TLS at L4, so the server can't distinguish http from https
            to issue a 301 — redirect client-side, scoped to our hostnames only so the
            platform app on the raw ELB hostname is unaffected. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){var h=location.hostname;if((h==="onamsecurity.com"||h==="www.onamsecurity.com")&&(location.protocol!=="https:"||h==="onamsecurity.com"))location.replace("https://www.onamsecurity.com"+location.pathname+location.search+location.hash)})();',
          }}
        />
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ConsentBanner />
    </QueryClientProvider>
  );
}
