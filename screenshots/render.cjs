const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screens = [
  { file: 'screen-findings.html',     out: 'screenshot-findings.png'     },
  { file: 'screen-attack-path.html',  out: 'screenshot-attack-path.png'  },
  { file: 'screen-compliance.html',   out: 'screenshot-compliance.png'   },
  { file: 'screen-risk.html',         out: 'screenshot-risk.png'         },
];

const dir = path.join(__dirname);

(async () => {
  const browser = await chromium.launch();

  for (const s of screens) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    const filePath = 'file://' + path.join(dir, s.file);
    await page.goto(filePath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800); // let fonts settle
    const outPath = path.join(dir, s.out);
    await page.screenshot({ path: outPath, fullPage: false });
    await page.close();
    console.log('rendered:', s.out);
  }

  await browser.close();
  console.log('all done');
})();
