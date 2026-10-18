const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG_PATH = 'C:\\Users\\bdtri\\AppData\\Local\\ms-playwright\\ffmpeg-1013\\ffmpeg-win64.exe';
const HTML_PATH = path.resolve(__dirname, '../storage/marketing/nihomi-explainer-60s/motion-canvas/index.html');
const POSTER_OUTPUT = path.resolve(__dirname, '../public/media/nihomi-explainer-poster.png');
const VIDEO_OUTPUT = path.resolve(__dirname, '../public/media/nihomi-explainer-60s.webm');

async function main() {
  console.log('=== NIHOMI 60-SECOND EXPLAINER VIDEO PRODUCTION PIPELINE (PHASE 8) ===');
  if (!fs.existsSync(CHROME_PATH)) {
    console.error('Chrome executable not found at', CHROME_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(FFMPEG_PATH)) {
    console.error('FFmpeg executable not found at', FFMPEG_PATH);
    process.exit(1);
  }

  // Ensure output directory exists
  const mediaDir = path.dirname(POSTER_OUTPUT);
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,720']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
  await page.goto('file:///' + HTML_PATH.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });

  const captureContainer = await page.$('#captureContainer');
  if (!captureContainer) {
    console.error('Capture container #captureContainer not found!');
    await browser.close();
    process.exit(1);
  }

  // Step 1: Capture Poster Image at t = 40.0s (Tokyo Workplace Simulation)
  console.log('Capturing video poster at t = 40.0s (Tokyo Workplace Simulation)...');
  await page.evaluate(() => window.setTime(40.0));
  await new Promise(r => setTimeout(r, 200));

  await captureContainer.screenshot({ path: POSTER_OUTPUT, type: 'png' });
  const posterStats = fs.statSync(POSTER_OUTPUT);
  console.log(`✓ Video poster captured (${(posterStats.size / 1024).toFixed(1)} KB): ${POSTER_OUTPUT}`);

  // Step 2: Spawn FFmpeg to encode WebM (VP9 codec from Playwright FFmpeg build)
  const fps = 10;
  const totalDuration = 60.0;
  const totalFrames = Math.floor(totalDuration * fps); // 600 frames

  console.log(`Rendering ${totalFrames} frames for 60.0-second video at ${fps} fps...`);

  const ffmpeg = spawn(FFMPEG_PATH, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-r', String(fps),
    '-i', 'pipe:0',
    '-c:v', 'libvpx-vp9',
    '-pix_fmt', 'yuv420p',
    '-b:v', '1200k',
    '-crf', '30',
    VIDEO_OUTPUT
  ]);

  let ffmpegStderr = '';
  ffmpeg.stderr.on('data', (d) => {
    ffmpegStderr += d.toString();
  });

  ffmpeg.on('error', (err) => {
    console.error('FFmpeg process error:', err);
  });

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    await page.evaluate((time) => window.setTime(time), t);

    const frameBuffer = await captureContainer.screenshot({ type: 'jpeg', quality: 85 });
    ffmpeg.stdin.write(frameBuffer);

    if (f % 100 === 0 || f === totalFrames - 1) {
      console.log(`Rendered frame ${f + 1}/${totalFrames} (${t.toFixed(1)}s / ${totalDuration}s)`);
    }
  }

  ffmpeg.stdin.end();

  const exitCode = await new Promise((resolve) => {
    ffmpeg.on('close', resolve);
  });

  await browser.close();

  if (exitCode !== 0) {
    console.error(`FFmpeg exited with error code ${exitCode}`);
    console.error('FFmpeg stderr last 500 chars:\n', ffmpegStderr.slice(-500));
    process.exit(1);
  } else {
    const stats = fs.statSync(VIDEO_OUTPUT);
    console.log(`✓ 60.0-SECOND VIDEO RENDERED SUCCESSFULLY!`);
    console.log(`  Path: ${VIDEO_OUTPUT}`);
    console.log(`  Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes)`);
    console.log(`  Duration: 60.0s (600 frames @ 10fps)`);
    console.log(`  Dimensions: 1280x720`);
    console.log(`  Format: WebM (VP9)`);
  }
}

main().catch(err => {
  console.error('Fatal renderer failure:', err);
  process.exit(1);
});
