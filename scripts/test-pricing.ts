// Scenario tests for the /pricing calculator maths. Run: npx tsx scripts/test-pricing.ts
import {
  CLOUD_PLANS, CLOUD_RESOURCES, DEV_LEVELS, DEV_PRICE, MIN_UNITS, SAAS_BANDS, UNIT_LEVELS,
  sizeFor, volumePrice,
} from "../src/data/pricing";

let pass = 0, fail = 0;
const eq = (name: string, got: unknown, want: unknown) => {
  const ok = typeof want === "number" ? Math.abs((got as number) - want) < 0.005 : got === want;
  ok ? pass++ : fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: got ${got}, want ${want}`);
};

const factor = (k: string) => CLOUD_RESOURCES.find((r) => r.key === k)!.factor;
const saasUnits = (k: string) => SAAS_BANDS.find((b) => b.key === k)!.units ?? 0;

/** Same steps the page runs. */
function estimate(cloud: Record<string, number>, saas: string[], devs: number, plan: "complete" | "posture" = "complete") {
  const p = CLOUD_PLANS.find((x) => x.key === plan)!;
  const units = Object.entries(cloud).reduce((s, [k, n]) => s + n * factor(k), 0) + saas.reduce((s, b) => s + saasUnits(b), 0);
  const billed = units > 0 ? Math.max(units, MIN_UNITS) : 0;
  const u = volumePrice(billed, p.unitPrice, UNIT_LEVELS);
  const c = volumePrice(devs, DEV_PRICE, DEV_LEVELS);
  return { units, billed, size: sizeFor(units).label, u, c, total: Math.round((u.total + c.total) * 100) / 100 };
}

console.log("— Cloud, Complete plan ($20), by number of VMs");
const vm: [number, number, number, string][] = [
  // VMs, expected monthly total, expected discount, size
  [0, 0, 0, "Small"],
  [10, 500, 0, "Small"], // minimum 25 units
  [25, 500, 0, "Small"],
  [100, 2000, 0, "Small"],
  [101, 2020, 0, "Mid-size"],
  [400, 8000, 0, "Mid-size"],
  [457, 9140, 0, "Mid-size"], // 457 x 20 = 9,140, below the 500-unit price
  [459, 9170, 10, "Mid-size"], // 459 x 20 = 9,180, capped at 500 x 18.34
  [499, 9170, 810, "Mid-size"],
  [500, 9170, 830, "Large"], // the case that failed: 8.3% on all 500
  [501, 9188.34, 831.66, "Large"],
  [800, 14672, 1328, "Large"],
  [999, 16660, 3320, "Large"], // capped at 1,000 x 16.66
  [1000, 16660, 3340, "Large"],
  [2500, 41650, 8350, "Large"],
  [4999, 75000, 24980, "Large"], // capped at 5,000 x 15
  [5000, 75000, 25000, "Very large"],
  [9999, 134000, 65980, "Very large"], // capped at 10,000 x 13.40
  [10000, 134000, 66000, "Enterprise"],
  [20000, 268000, 132000, "Enterprise"],
];
for (const [n, total, disc, size] of vm) {
  const e = estimate({ vm: n }, [], 0);
  eq(`${n} VMs total`, e.total, total);
  eq(`${n} VMs discount`, e.u.discount, disc);
  eq(`${n} VMs size`, e.size, size);
}

console.log("— Posture plan ($14)");
eq("10 VMs (minimum 25 units)", estimate({ vm: 10 }, [], 0, "posture").total, 350);
eq("100 VMs", estimate({ vm: 100 }, [], 0, "posture").total, 1400);
eq("500 VMs (8.3% off: 14 -> 12.84)", estimate({ vm: 500 }, [], 0, "posture").total, 6420);
eq("1,000 VMs (16.7% off: 14 -> 11.66)", estimate({ vm: 1000 }, [], 0, "posture").total, 11660);

console.log("— Code security ($39 per developer)");
const dv: [number, number, number][] = [
  [0, 0, 0], [10, 390, 0], [45, 1755, 0], [46, 1788, 6], [49, 1788, 123], [50, 1788, 162],
  [100, 3576, 324], [199, 6498, 1263], [200, 6498, 1302], [500, 16245, 3255],
];
for (const [n, total, disc] of dv) {
  const e = estimate({}, [], n);
  eq(`${n} developers total`, e.total, total);
  eq(`${n} developers discount`, e.c.discount, disc);
}

console.log("— Fractions, SaaS and mixed estates");
eq("1 function = 0.02 units, billed at the 25-unit minimum", estimate({ function: 1 }, [], 0).total, 500);
eq("50 functions = 1 unit", estimate({ function: 50 }, [], 0).units, 1);
eq("10 buckets = 1 unit", estimate({ bucket: 10 }, [], 0).units, 1);
eq("2 databases = 1 unit", estimate({ db: 2 }, [], 0).units, 1);
eq("One M365 tenant up to 100 users = 5 units -> minimum $500", estimate({}, ["b100"], 0).total, 500);
eq("Tenant over 10,000 users adds no units (quote)", estimate({}, ["over"], 0).units, 0);
eq("Two tenants 101-500 + 2,001-10,000 = 115 units", estimate({}, ["b500", "b10000"], 0).units, 115);
const mid = estimate({ vm: 120, function: 300, bucket: 150, db: 15 }, ["b500"], 25);
eq("Mid-size mix units (120+6+15+7.5+15)", mid.units, 163.5);
eq("Mid-size mix total (163.5 x 20 + 25 x 39)", mid.total, 4245);
eq("Mid-size mix size", mid.size, "Mid-size");
const big = estimate({ vm: 450, node: 60, bucket: 400 }, ["b2000"], 120);
// 450 + 60 + 40 + 40 = 590 units at 18.34 = 10,820.60; 120 devs at 35.76 = 4,291.20
eq("Large mix units", big.units, 590);
eq("Large mix total", big.total, 15111.8);
eq("Large mix list price", big.u.list + big.c.list, 11800 + 4680);

console.log("— Never drops as the customer grows; never above list");
let prev = -1, bad = 0;
for (let u = 0; u <= 20000; u += 0.5) {
  const t = volumePrice(u, 20, UNIT_LEVELS);
  if (t.total < prev - 1e-9 || t.total > t.list + 1e-9 || t.discount < -1e-9) bad++;
  prev = t.total;
}
eq("units 0 to 20,000 (Complete): rises only, discount >= 0", bad, 0);
prev = -1; bad = 0;
for (let u = 0; u <= 20000; u += 0.5) {
  const t = volumePrice(u, 14, UNIT_LEVELS);
  if (t.total < prev - 1e-9 || t.total > t.list + 1e-9) bad++;
  prev = t.total;
}
eq("units 0 to 20,000 (Posture): rises only", bad, 0);
prev = -1; bad = 0;
for (let d = 0; d <= 2000; d++) {
  const t = volumePrice(d, 39, DEV_LEVELS);
  if (t.total < prev - 1e-9 || t.total > t.list + 1e-9) bad++;
  prev = t.total;
}
eq("developers 0 to 2,000: rises only", bad, 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
