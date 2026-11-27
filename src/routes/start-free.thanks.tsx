import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "@/components/site/icons";
import { SiteLayout } from "@/components/site/SiteLayout";
import { seo } from "@/lib/seo";

/**
 * /start-free/thanks — shown after a free-plan sign-up, so a completed sign-up is a URL that
 * analytics can count. No provisioning time is promised until the owner commits to one.
 */
export const Route = createFileRoute("/start-free/thanks")({
  head: () => ({
    ...seo({ title: "You're registered — Onam free plan", description: "We are creating your Onam workspace.", path: "/start-free/thanks" }),
    meta: [
      ...seo({ title: "You're registered — Onam free plan", description: "We are creating your Onam workspace.", path: "/start-free/thanks" }).meta,
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Thanks,
});

function Thanks() {
  const steps = [
    "We create your Onam workspace on the free plan and email your login details to the address you registered with.",
    "Sign in and connect a cloud account with a read-only role. You can read every permission before you deploy it.",
    "Your first scan runs and your findings appear, ranked with their fixes and the compliance controls they affect.",
  ];
  return (
    <SiteLayout>
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-14 h-14 rounded-full bg-tint-blue grid place-items-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-brand-500" />
        </div>
        <h1 className="mt-5 font-display font-black text-ink text-3xl md:text-4xl tracking-tight">You're registered.</h1>
        <p className="mt-3 text-body leading-relaxed">
          We've sent you a confirmation email. Here is what happens next:
        </p>
        <ol className="mt-8 space-y-4 text-left">
          {steps.map((t, i) => (
            <li key={i} className="flex gap-4 rounded-xl bg-white ring-1 ring-line p-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[13px] font-black text-white">{i + 1}</span>
              <span className="text-sm text-body leading-relaxed">{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm text-body">
          While you wait, read{" "}
          <Link to="/docs/$" params={{ _splat: "onboarding/aws" }} className="text-brand-600 hover:underline">
            how the read-only connection works
          </Link>{" "}
          or reply to the confirmation email with any question.
        </p>
      </section>
    </SiteLayout>
  );
}
