const sharp = require('sharp');
const path = require('path');

async function createHeroBackdrop() {
  const refHero = 'storage/evidence/reference-sections/02-hero.png';
  const outPath = 'public/assets/landing-v2/hero-full-backdrop.png';

  // 1. Cherry blossoms on far left (x: 0 to 35) preserved.
  // 2. Pure white (100% opaque) over the text area x: 45 to 380, smoothly fading to 0% at x: 450 so Mt. Fuji begins naturally.
  // 3. Right side: inside the floating card area ONLY (x: 810 to 984, y: 80 to 304, rx: 16),
  //    paint 100% opaque white with rounded corners, leaving the Japanese pagoda above (y: 0 to 80)
  //    and cherry blossoms below (y: 304 to 380) completely intact!
  const svgOverlay = Buffer.from(`
    <svg width="1024" height="380" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leftFadeIn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.0" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1.0" />
        </linearGradient>
        <linearGradient id="leftFadeOut" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1.0" />
          <stop offset="70%" stop-color="#FFFFFF" stop-opacity="0.95" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Smooth fade-in from left sakura (x: 25 to 55) -->
      <rect x="25" y="0" width="30" height="380" fill="url(#leftFadeIn)" />

      <!-- 100% Solid white over text block (x: 55 to 380) with zero ghosting -->
      <rect x="55" y="0" width="325" height="380" fill="#FFFFFF" />

      <!-- Smooth fade-out into Mt. Fuji & landscape (x: 380 to 455) -->
      <rect x="380" y="0" width="75" height="380" fill="url(#leftFadeOut)" />

      <!-- Clean card footprint on the right matching exact reference bounds (x: 810 to 984, y: 80 to 304) -->
      <!-- Preserves the pagoda above (y: 0 to 80) and cherry blossoms below (y: 304 to 380) -->
      <rect x="810" y="80" width="174" height="224" rx="16" fill="#FFFFFF" />
    </svg>
  `);

  await sharp(refHero)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .png()
    .toFile(outPath);

  console.log('✔ Successfully generated refined hero-full-backdrop.png with intact pagoda and cherry blossoms');
}

createHeroBackdrop().catch(console.error);
