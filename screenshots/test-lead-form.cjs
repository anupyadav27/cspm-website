/**
 * End-to-end test of the lead-capture path.
 *
 * Drives the real /request-demo form in a browser exactly as a visitor would,
 * so it exercises the full client -> server function -> S3 -> SES chain rather
 * than a guessed internal RPC endpoint.
 *
 * Usage: node screenshots/test-lead-form.cjs [baseUrl]
 * Then:  aws s3 ls s3://onam-platform-588989875114/leads/demo/ --recursive
 */
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:8099';
const MARKER = `e2e-${Date.now()}`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const serverCalls = [];
  page.on('response', (r) => {
    const u = r.url();
    if (r.request().method() === 'POST' && !u.includes('/_build/')) {
      serverCalls.push(`${r.status()} ${u.replace(BASE, '')}`);
    }
  });
  page.on('console', (m) => {
    if (m.type() === 'error') console.log('  [browser error]', m.text().slice(0, 160));
  });

  await page.goto(`${BASE}/request-demo`, { waitUntil: 'networkidle' });

  await page.fill('input[type="email"]', `${MARKER}@onamsecurity.com`);
  // Name/Company have no explicit type attribute, so select by placeholder.
  await page.fill('form input[placeholder="Alex Rivera"]', 'Pipeline Test');
  await page.fill('form input[placeholder="Acme Corp"]', 'Onam Internal QA');

  await page.getByRole('button', { name: 'AWS', exact: true }).first().click();  // cloud chip
  await page.selectOption('form select', 'Evaluating vendors');                  // reason is a <select>

  const textarea = page.locator('form textarea');
  if (await textarea.count()) await textarea.first().fill(`automated end-to-end check ${MARKER}`);

  await page.locator('form button[type="submit"]').click();

  // Success state replaces the form with a confirmation heading.
  let ok = false;
  try {
    await page.waitForSelector('text=Thanks — you\'re in.', { timeout: 25000 });
    ok = true;
  } catch {
    const err = await page.locator('form p.text-\\[\\#E32D25\\]').allTextContents();
    console.log('  visible errors:', err.filter(Boolean).slice(0, 4));
  }

  console.log(`\n  marker:       ${MARKER}`);
  console.log(`  POST calls:   ${serverCalls.join(', ') || 'NONE — form never hit the server'}`);
  console.log(`  success UI:   ${ok ? 'YES' : 'NO'}`);
  console.log(ok ? '\n✓ form submitted end-to-end' : '\n✗ submission did not complete');

  await browser.close();
  process.exit(ok ? 0 : 1);
})();
