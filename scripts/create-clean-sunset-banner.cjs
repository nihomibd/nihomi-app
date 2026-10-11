const sharp = require('sharp');
const path = require('path');

async function cleanSunsetBanner() {
  const refBanner = 'storage/evidence/reference-sections/08-banner.png';
  const outPath = 'public/assets/landing-v2/sunset-panorama-cta.png';

  // Extract a seamless blurred strip of the dusk sky to softly dissolve the text
  // The sky gradient at y=0 is #1A1144, at y=50 is #3D1C6A.
  const svgOverlay = Buffer.from(`
    <svg width="1024" height="111" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fullSkyWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1c124a" stop-opacity="0.92" />
          <stop offset="35%" stop-color="#2a165e" stop-opacity="0.88" />
          <stop offset="55%" stop-color="#381b70" stop-opacity="0.75" />
          <stop offset="70%" stop-color="#462080" stop-opacity="0.40" />
          <stop offset="100%" stop-color="#542590" stop-opacity="0.0" />
        </linearGradient>
        <radialGradient id="buttonWash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#261358" stop-opacity="0.95" />
          <stop offset="70%" stop-color="#261358" stop-opacity="0.75" />
          <stop offset="100%" stop-color="#261358" stop-opacity="0.0" />
        </radialGradient>
      </defs>

      <!-- Smooth full-width sky wash from top fading seamlessly into the skyline -->
      <rect x="0" y="0" width="1024" height="65" fill="url(#fullSkyWash)" />

      <!-- Soft radial wash around original button position -->
      <ellipse cx="500" cy="74" rx="140" ry="24" fill="url(#buttonWash)" />
    </svg>
  `);

  await sharp(refBanner)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .png()
    .toFile(outPath);

  console.log('✔ Successfully generated seamless sunset-panorama-cta.png');
}

cleanSunsetBanner().catch(console.error);
