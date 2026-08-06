import { createServerFn } from "@tanstack/react-start";

/**
 * Lead capture for /request-demo and /company/contact.
 *
 * Both forms previously validated input, showed a success message, and threw
 * the submission away — no fetch, no backend. Every lead since launch was lost.
 *
 * Design, in priority order:
 *
 *  1. **S3 is the source of truth.** Each lead is written to
 *     s3://onam-platform-588989875114/leads/<form>/<date>/<id>.json before any
 *     email is attempted. If SES is misconfigured, unverified, throttled or
 *     down, the lead still exists.
 *  2. **Email is a best-effort notification.** A failure is logged and
 *     swallowed — it must never turn a captured lead into an error for the
 *     visitor.
 *  3. **The visitor only sees success if the lead was actually persisted.**
 *     Silent data loss is what we are fixing; we do not reintroduce it.
 *
 * Credentials come from IRSA (service account `cspm-docs-website-sa` →
 * role `onam-website-lead-capture`), which grants exactly ses:SendEmail on the
 * onamsecurity.com identity and s3:PutObject under leads/ — nothing else.
 * No keys are stored anywhere.
 */

const REGION = "ap-south-1";
const BUCKET = "onam-platform-588989875114";

/**
 * Both must be SES-verified identities, and while the account is in the SES
 * sandbox the RECIPIENT must be verified too — not just the sender.
 *
 * Defaults target onamsecurity.com, which is the intended long-term address.
 * Until its DKIM records finish verifying, the deployment overrides these with
 * LEAD_FROM / LEAD_TO pointing at an already-verified identity so notifications
 * work now. Once `aws sesv2 get-email-identity --email-identity
 * onamsecurity.com` reports SUCCESS, drop the env vars and the defaults apply.
 */
const FROM = process.env.LEAD_FROM || "sales@onamsecurity.com";
const TO = process.env.LEAD_TO || "sales@onamsecurity.com";

export type LeadKind = "demo" | "contact";

export type LeadInput = {
  kind: LeadKind;
  email: string;
  name: string;
  company?: string;
  reason?: string;
  message?: string;
  clouds?: string[];
  /** Honeypot — real users never fill this. Bots do. */
  website?: string;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Trim, cap length, and strip control characters before anything is stored. */
function clean(v: unknown, max = 2000): string {
  if (typeof v !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return v.replace(/[\u0000-\u001F\u007F]/g, " ").trim().slice(0, max);
}

function validate(raw: unknown): LeadInput {
  const d = (raw ?? {}) as Record<string, unknown>;
  const kind: LeadKind = d.kind === "contact" ? "contact" : "demo";
  const email = clean(d.email, 254);
  const name = clean(d.name, 200);

  if (!EMAIL_RE.test(email)) throw new Error("A valid email address is required.");
  if (!name) throw new Error("Name is required.");

  return {
    kind,
    email,
    name,
    company: clean(d.company, 200),
    reason: clean(d.reason, 200),
    message: clean(d.message, 5000),
    clouds: Array.isArray(d.clouds) ? d.clouds.slice(0, 20).map((c) => clean(c, 40)) : [],
    website: clean(d.website, 200),
  };
}

/** Deterministic-ish id without pulling in a uuid dependency. */
function leadId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const submitLead = createServerFn({ method: "POST" })
  .validator(validate)
  .handler(async ({ data }) => {
    // Honeypot: accept and discard so the bot sees success and does not retry.
    if (data.website) return { ok: true as const };

    const now = new Date();
    const id = leadId();
    const key = `leads/${data.kind}/${now.toISOString().slice(0, 10)}/${id}.json`;

    const record = {
      id,
      receivedAt: now.toISOString(),
      form: data.kind,
      name: data.name,
      email: data.email,
      company: data.company || null,
      reason: data.reason || null,
      message: data.message || null,
      clouds: data.clouds?.length ? data.clouds : null,
      source: "www.onamsecurity.com",
    };

    // ---- 1. Persist. This is the step that must succeed. -------------------
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const s3 = new S3Client({ region: REGION });
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(record, null, 2),
        ContentType: "application/json",
      }),
    );

    // ---- 2. Notify. Best effort — never fails the request. -----------------
    try {
      const { SESv2Client, SendEmailCommand } = await import("@aws-sdk/client-sesv2");
      const ses = new SESv2Client({ region: REGION });

      const lines = [
        `Form:     ${data.kind === "demo" ? "Request a demo" : "Contact"}`,
        `Name:     ${data.name}`,
        `Email:    ${data.email}`,
        data.company ? `Company:  ${data.company}` : null,
        data.reason ? `Reason:   ${data.reason}` : null,
        data.clouds?.length ? `Clouds:   ${data.clouds.join(", ")}` : null,
        data.message ? `\nMessage:\n${data.message}` : null,
        ``,
        `Received: ${now.toISOString()}`,
        `Record:   s3://${BUCKET}/${key}`,
      ].filter(Boolean);

      await ses.send(
        new SendEmailCommand({
          FromEmailAddress: FROM,
          Destination: { ToAddresses: [TO] },
          ReplyToAddresses: [data.email],
          Content: {
            Simple: {
              Subject: {
                Data: `[${data.kind === "demo" ? "Demo" : "Contact"}] ${data.name}${
                  data.company ? ` — ${data.company}` : ""
                }`,
              },
              Body: { Text: { Data: lines.join("\n") } },
            },
          },
        }),
      );
    } catch (err) {
      // The lead is already safe in S3. Log loudly so the gap is visible in
      // pod logs, but return success — the visitor did nothing wrong.
      console.error("[lead-capture] SES notification failed (lead IS stored):", err);
    }

    return { ok: true as const };
  });
