const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screens = [
  // Static screenshots
  { file: 'screen-findings.html',      out: 'screenshot-findings.png',      wait: 800  },
  { file: 'screen-attack-path.html',   out: 'screenshot-attack-path.png',   wait: 800  },
  { file: 'screen-compliance.html',    out: 'screenshot-compliance.png',     wait: 800  },
  { file: 'screen-risk.html',          out: 'screenshot-risk.png',           wait: 800  },
  // New screens
  { file: 'screen-dashboard.html',     out: 'screenshot-dashboard.png',      wait: 800  },
  { file: 'screen-onboarding.html',    out: 'screenshot-onboarding.png',     wait: 800  },
  { file: 'screen-iam.html',           out: 'screenshot-iam.png',            wait: 800  },
  { file: 'screen-network.html',       out: 'screenshot-network.png',        wait: 800  },
  { file: 'screen-cdr.html',           out: 'screenshot-cdr.png',            wait: 800  },
  { file: 'screen-container.html',     out: 'screenshot-container.png',      wait: 800  },
  { file: 'screen-datasec.html',       out: 'screenshot-datasec.png',        wait: 800  },
  // New modules
  { file: 'screen-saas-security.html', out: 'screenshot-saas-security.png',  wait: 800  },
  { file: 'screen-cwpp.html',          out: 'screenshot-cwpp.png',           wait: 800  },
  { file: 'screen-cnapp.html',         out: 'screenshot-cnapp.png',          wait: 800  },
];

const dir = path.join(__dirname);

(async () => {
  const browser = await chromium.launch();

  for (const s of screens) {
    const filePath = path.join(dir, s.file);
    if (!fs.existsSync(filePath)) {
      console.warn('SKIP (not found):', s.file);
      continue;
    }
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('file://' + filePath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(s.wait);
    const outPath = path.join(dir, s.out);
    await page.screenshot({ path: outPath, fullPage: false });
    await page.close();
    const size = Math.round(fs.statSync(outPath).size / 1024);
    console.log(`rendered: ${s.out} (${size}K)`);
  }

  await browser.close();
  console.log('all screenshots done');
})();
