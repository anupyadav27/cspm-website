const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const outDir = path.join(__dirname, 'video-tmp');
  fs.mkdirSync(outDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();
  const htmlPath = 'file://' + path.join(__dirname, 'screen-demo-animated.html');
  await page.goto(htmlPath, { waitUntil: 'networkidle' });

  // Wait for full animation to complete (7.5 seconds of animation)
  await page.waitForTimeout(7500);

  // Hold the final state for 1.5 seconds
  await page.waitForTimeout(1500);

  await context.close();
  await browser.close();

  // Find the recorded video file
  const files = fs.readdirSync(outDir).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    console.error('No video file found in', outDir);
    process.exit(1);
  }

  const videoFile = path.join(outDir, files[0]);
  console.log('Recorded video:', videoFile);
  console.log('Now run ffmpeg to convert to mp4:');
  console.log(`ffmpeg -i "${videoFile}" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart "${path.join(__dirname, '../public/video/demo.mp4')}"`);
})();
