/**
 * Submits URLs to IndexNow (instant indexing for Bing, Yandex, Seznam, Naver —
 * Bing's index feeds ChatGPT search and Copilot).
 *
 * Usage:
 *   npx tsx scripts/indexnow.ts /resources/blog/my-post /platform/cspm
 *   npx tsx scripts/indexnow.ts --all        # every URL in public/sitemap.xml
 *
 * The key file public/<KEY>.txt must be live on the site before pings count.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const KEY = "bcd8bec729a7429c55a2a764fa049d60";
const HOST = "www.onamsecurity.com";

const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

let urls: string[];
if (args.includes("--all")) {
  const xml = readFileSync(join(here, "../public/sitemap.xml"), "utf8");
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} else if (args.length > 0) {
  urls = args.map((a) => (a.startsWith("http") ? a : `https://${HOST}${a}`));
} else {
  console.error("Usage: tsx scripts/indexnow.ts <path...> | --all");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});

// 200/202 = accepted; 403 = key file not reachable; 422 = URL/host mismatch
console.log(`IndexNow: ${res.status} ${res.statusText} — submitted ${urls.length} URL(s)`);
if (!res.ok && res.status !== 202) process.exit(1);
