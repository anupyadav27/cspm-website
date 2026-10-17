import { ArrowUpRight, Clock, Handshake, ShoppingBag } from "lucide-react";
import { MARKETPLACES, anyMarketplaceLive, liveMarketplaces } from "@/data/marketplaces";
import { Container, Section, SectionHeading } from "@/components/site/system";
import { cn } from "@/lib/utils";

/**
 * "Buy through your cloud marketplace" — driven entirely by src/data/marketplaces.ts.
 * A marketplace without a listing URL shows "Coming soon"; if it has a partner profile,
 * the tile links there and names it as a partner profile, never as a listing.
 */
function Tile({ m }: { m: (typeof MARKETPLACES)[number] }) {
  const live = Boolean(m.url);
  const href = m.url ?? m.partner?.url;
  const Icon = live || !m.partner ? ShoppingBag : Handshake;
  const body = (
    <>
      <Icon className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{live || !m.partner ? m.name : m.partner.label}</span>
        <span className={cn("mt-0.5 inline-flex items-center gap-1 text-xs font-semibold", live ? "text-[#047857]" : "text-muted-500")}>
          {live ? (
            <>
              Available now <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </>
          ) : m.partner ? (
            <>
              View partner profile <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5" aria-hidden /> Coming soon
            </>
          )}
        </span>
      </span>
    </>
  );
  const cls = "flex items-center gap-3 rounded-2xl border border-line bg-white px-5 py-4";
  return href ? (
    <a href={href} target="_blank" rel="noopener" className={cn(cls, "transition hover:border-brand-500/40 hover:shadow-[0_12px_28px_rgba(16,24,40,.08)]")}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** Full band, for the homepage, Why Onam and pricing. */
export function MarketplaceStrip({ tone = "white" }: { tone?: "white" | "surface" }) {
  const live = anyMarketplaceLive();
  const liveNames = liveMarketplaces().map((m) => m.name).join(" and ");
  const pending = MARKETPLACES.filter((m) => !m.url).map((m) => m.short).join(" and ");
  return (
    <Section id="marketplaces" tone={tone}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <SectionHeading
            eyebrow="Cloud marketplaces"
            title={live ? "Buy Onam through your cloud marketplace." : "Coming to your cloud marketplace."}
            lead={
              live
                ? `Onam is listed on ${liveNames}, so you can procure it where your company already buys cloud software.${pending ? ` ${pending} listings are on the way; until then, buy directly — talk to us.` : ""}`
                : "We are onboarding with AWS, Microsoft Azure and Google Cloud marketplaces, so you can procure Onam where your company already buys cloud software. Until then, buy directly — talk to us."
            }
          />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {MARKETPLACES.map((m) => (
              <Tile key={m.key} m={m} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** One line, for the footer. */
export function MarketplaceLine({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-500", className)}>
      <span className="font-semibold text-ink-2">Cloud marketplaces:</span>
      {MARKETPLACES.map((m, i) => (
        <span key={m.key} className="inline-flex items-center gap-1">
          {m.url ? (
            <a href={m.url} target="_blank" rel="noopener" className="font-medium text-brand-500 hover:text-brand-600">
              {m.name}
            </a>
          ) : m.partner ? (
            <a href={m.partner.url} target="_blank" rel="noopener" className="font-medium text-brand-500 hover:text-brand-600">
              {m.partner.label}
            </a>
          ) : (
            <span>{m.name} (coming soon)</span>
          )}
          {i < MARKETPLACES.length - 1 && <span aria-hidden>·</span>}
        </span>
      ))}
    </div>
  );
}
