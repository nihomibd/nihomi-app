const sharp = require('sharp');
const path = require('path');

async function cleanSunsetBanner() {
  const refBanner = 'storage/evidence/reference-sections/08-banner.png';
  const outPath = 'public/assets/landing-v2/sunset-panorama-cta.png';

  // Build targeted, zero-ghosting vector masks that cover the exact text/button areas
  // while preserving 100% of the vibrancy of the surrounding scenery (Mt. Fuji, torii gate, pagoda, cherry blossoms)
  const svgOverlay = Buffer.from(`
    <svg width="1024" height="111" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- 1. Left English text patch gradient (x: 48 to 190, y: 6 to 52) -->
        <linearGradient id="leftSkyPatch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3C4690" />
          <stop offset="50%" stop-color="#4F4C92" />
          <stop offset="100%" stop-color="#675095" />
        </linearGradient>

        <!-- 2. Center Bengali title & subtitle horizontal sky wash (x: 310 to 690, y: 0 to 52) -->
        <!-- Interpolates twilight blue to sunset horizon glow -->
        <linearGradient id="centerSkyH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#444C96" />
          <stop offset="25%" stop-color="#4D58A6" />
          <stop offset="55%" stop-color="#6F64A8" />
          <stop offset="80%" stop-color="#A57CAD" />
          <stop offset="100%" stop-color="#D092A5" />
        </linearGradient>

        <!-- Vertical feather for center sky patch fading into skyline -->
        <linearGradient id="centerSkyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.0" />
          <stop offset="70%" stop-color="#000000" stop-opacity="0.0" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.2" />
        </linearGradient>

        <!-- 3. Button wash (cx: 500, cy: 74, rx: 115, ry: 21) -->
        <!-- Solid background wipe of the button area to eliminate ghosting -->
        <radialGradient id="buttonCleanWash" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2D1758" stop-opacity="1.0" />
          <stop offset="80%" stop-color="#331A62" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#3A1F6E" stop-opacity="0.0" />
        </radialGradient>
      </defs>

      <!-- Targeted patch for left English text (starts at x=48 to preserve left sakura) -->
      <rect x="48" y="6" width="144" height="46" rx="8" fill="url(#leftSkyPatch)" />

      <!-- Targeted 100% solid patch for center Bengali text (x=310 to 690, y=0 to 52) -->
      <rect x="310" y="0" width="380" height="52" fill="url(#centerSkyH)" />
      <rect x="310" y="0" width="380" height="52" fill="url(#centerSkyFade)" />

      <!-- Targeted patch for center button position -->
      <ellipse cx="500" cy="74" rx="120" ry="22" fill="url(#buttonCleanWash)" />
    </svg>
  `);

  await sharp(refBanner)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .png()
    .toFile(outPath);

  console.log('✔ Successfully generated clean, zero-ghosting sunset-panorama-cta.png');
}

cleanSunsetBanner().catch(console.error);
