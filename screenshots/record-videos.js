const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const videos = [
  {
    file: 'screen-demo-animated.html',
    out: 'demo.mp4',
    duration: 9000,
    label: 'Findings Scan Demo',
  },
  {
    file: 'screen-onboarding-animated.html',
    out: 'demo-onboarding.mp4',
    duration: 9000,
    label: 'Onboarding — Connect AWS Account',
  },
  {
    file: 'screen-attack-path-animated.html',
    out: 'demo-attack-path.mp4',
    duration: 8000,
    label: 'Attack Path Analysis',
  },
];

const dir = path.join(__dirname);
const videoDir = path.join(__dirname, '../public/video');
fs.mkdirSync(videoDir, { recursive: true });

(async () => {
  const browser = await chromium.launch();

  for (const v of videos) {
    const filePath = path.join(dir, v.file);
    if (!fs.existsSync(filePath)) {
      console.warn('SKIP (not found):', v.file);
      continue;
    }

    const tmpDir = path.join(dir, `video-tmp-${v.out.replace('.mp4','')}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: tmpDir, size: { width: 1440, height: 900 } },
    });

    const page = await context.newPage();
    await page.goto('file://' + filePath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(v.duration);
    await context.close();

    // Find the webm
    const webmFiles = fs.readdirSync(tmpDir).filter(f => f.endsWith('.webm'));
    if (webmFiles.length === 0) {
      console.error('No webm for', v.label);
      continue;
    }

    const webm = path.join(tmpDir, webmFiles[0]);
    const mp4 = path.join(videoDir, v.out);
    execSync(`ffmpeg -i "${webm}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart "${mp4}" -y 2>/dev/null`);

    const size = Math.round(fs.statSync(mp4).size / 1024);
    console.log(`encoded: ${v.out} (${size}K) — ${v.label}`);
  }

  await browser.close();
  console.log('all videos done');
})();
