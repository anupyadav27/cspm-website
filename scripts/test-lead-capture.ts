// Scenario tests for inbound lead handling. Run: npx tsx scripts/test-lead-capture.ts
import { AckThrottle, ackEmail, replyByDate, routeTag, wantsAck } from "../src/lib/lead-inbound";

let pass = 0, fail = 0;
const eq = (name: string, got: unknown, want: unknown) => {
  const ok = got === want;
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
};
const iso = (d: Date) => d.toISOString().slice(0, 10);

console.log("— Reply by: next working day, India time");
// 2026-11-16 is a Monday.
eq("Mon 10:00 IST -> Tue", iso(replyByDate(new Date("2026-11-16T04:30:00Z")).date), "2026-11-17");
eq("Thu 18:00 IST -> Fri", iso(replyByDate(new Date("2026-11-19T12:30:00Z")).date), "2026-11-20");
eq("Fri 10:00 IST -> Mon", iso(replyByDate(new Date("2026-11-20T04:30:00Z")).date), "2026-11-23");
eq("Sat -> Mon", iso(replyByDate(new Date("2026-11-21T06:00:00Z")).date), "2026-11-23");
eq("Sun -> Mon", iso(replyByDate(new Date("2026-11-22T06:00:00Z")).date), "2026-11-23");
// Fri 20:00 UTC is already Sat 01:30 IST -> Monday.
eq("Fri late UTC = Sat IST -> Mon", iso(replyByDate(new Date("2026-11-20T20:00:00Z")).date), "2026-11-23");
// Sun 20:00 UTC is Mon 01:30 IST -> Tuesday.
eq("Sun late UTC = Mon IST -> Tue", iso(replyByDate(new Date("2026-11-22T20:00:00Z")).date), "2026-11-24");
eq("label", replyByDate(new Date("2026-11-20T04:30:00Z")).label, "Mon 23 Nov 2026, end of day IST");
eq("month/year roll", iso(replyByDate(new Date("2026-12-31T06:00:00Z")).date), "2027-01-01");

console.log("— Route tag");
eq("demo form", routeTag({ kind: "demo", message: "Want to see attack paths" }), "demo");
eq("audit form", routeTag({ kind: "audit" }), "audit");
eq("free plan form", routeTag({ kind: "free" }), "free");
eq("partner reason on contact", routeTag({ kind: "contact", reason: "Partner or integration enquiry" }), "partner");
eq("MSSP on demo form", routeTag({ kind: "demo", message: "We are an MSSP and want to resell" }), "partner");
eq("investor", routeTag({ kind: "contact", reason: "General question", message: "I am an angel investor" }), "investor");
eq("VC word", routeTag({ kind: "contact", message: "We are a VC looking at cloud security" }), "investor");
eq("second opinion reason", routeTag({ kind: "contact", reason: "A second opinion on our cloud (security, cost or recovery)" }), "audit");
eq("pricing reason", routeTag({ kind: "contact", reason: "Pre-sales & pricing" }), "demo");
eq("press", routeTag({ kind: "contact", reason: "Press or analyst", message: "Article request" }), "other");
eq("no false VC in word", routeTag({ kind: "contact", message: "Our svc mesh" }), "other");

console.log("— Acknowledgement");
eq("demo wants ack", wantsAck("demo"), true);
eq("audit wants ack", wantsAck("audit"), true);
eq("contact wants ack", wantsAck("contact"), true);
eq("subscribe gets none", wantsAck("subscribe"), false);
eq("free plan wants ack", wantsAck("free"), true);
const f = ackEmail({ kind: "free", name: "Ravi K" }, "");
eq("free subject", f.subject, "Your Onam free plan: we are setting it up");
eq("free says login by email", f.body.includes("email your login details"), true);
eq("free says 25 units", f.body.includes("up to 25 units"), true);
const a = ackEmail({ kind: "audit", name: "Priya Sharma" }, "");
eq("greets first name", a.body.startsWith("Hello Priya,"), true);
eq("one working day", a.body.includes("within one working day"), true);
eq("no booking line when unset", a.body.includes("pick a time"), false);
eq("audit subject", a.subject, "Your audit scan request: we have it");
const b = ackEmail({ kind: "demo", name: "" }, "https://calendar.app.google/abc");
eq("plain hello when no name", b.body.startsWith("Hello,"), true);
eq("booking line when set", b.body.includes("If you would like to pick a time now: https://calendar.app.google/abc"), true);
const banned = /within minutes|guarantee|risk-free|free trial|certified|our customers|nothing is installed/i;
for (const k of ["demo", "audit", "contact", "free"] as const) {
  eq(`${k} ack has no banned claims`, banned.test(ackEmail({ kind: k, name: "A" }, "x").body), false);
}

console.log("— Throttle: one ack per address per day");
const t = new AckThrottle(1000, 3);
eq("first", t.allow("x@a.com", 0), true);
eq("repeat blocked", t.allow("X@A.com ", 10), false);
eq("other address", t.allow("y@a.com", 10), true);
eq("after window", t.allow("x@a.com", 1500), true);
t.allow("z@a.com", 1500);
eq("cap keeps working", t.allow("w@a.com", 1600), true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
