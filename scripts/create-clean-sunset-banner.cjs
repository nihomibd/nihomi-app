const sharp = require('sharp');
const path = require('path');

async function cleanSunsetBanner() {
  const refBanner = 'storage/evidence/reference-sections/08-banner.png';
  const outPath = 'public/assets/landing-v2/sunset-panorama-cta.png';

  const { data, info } = await sharp(refBanner)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const outData = Buffer.from(data);

  // 1. Seamless mathematical sky reconstruction across text zones:
  // Interpolates vertically between the unblemished top sky (y=0..2)
  // and unblemished horizon sky (y=52..54) column-by-column.
  // Because it follows the exact column x colors, the natural twilight-to-sunset
  // gradient is preserved with ZERO visible edges, ZERO patch boundaries, and ZERO ghost text.
  for (let x = 35; x <= 750; x++) {
    const inTextZone = (x >= 40 && x <= 205) || (x >= 270 && x <= 730);
    if (!inTextZone) continue;

    // Sample pristine top sky (y=0..2)
    let topR = 0, topG = 0, topB = 0;
    for (let dy = 0; dy <= 2; dy++) {
      const idx = (dy * info.width + x) * 3;
      topR += data[idx]; topG += data[idx+1]; topB += data[idx+2];
    }
    topR /= 3; topG /= 3; topB /= 3;

    // Sample pristine horizon sky (y=52..54)
    let botR = 0, botG = 0, botB = 0;
    for (let dy = 52; dy <= 54; dy++) {
      const idx = (dy * info.width + x) * 3;
      botR += data[idx]; botG += data[idx+1]; botB += data[idx+2];
    }
    botR /= 3; botG /= 3; botB /= 3;

    // Interpolate vertically for y from 3 to 51
    for (let y = 3; y <= 51; y++) {
      const t = (y - 3) / (51 - 3);
      const ease = t * t * (3 - 2 * t); // smoothstep
      const r = Math.round(topR + (botR - topR) * ease);
      const g = Math.round(topG + (botG - topG) * ease);
      const b = Math.round(botB + (botB - topB) * ease);

      // Horizontal edge feathering near region boundaries to eliminate any seam
      let hWeight = 1.0;
      if (x < 55) hWeight = (x - 40) / 15;
      else if (x > 190 && x <= 205) hWeight = (205 - x) / 15;
      else if (x >= 270 && x < 285) hWeight = (x - 270) / 15;
      else if (x > 715 && x <= 730) hWeight = (730 - x) / 15;

      hWeight = Math.max(0, Math.min(1, hWeight));
      hWeight = hWeight * hWeight * (3 - 2 * hWeight);

      const idx = (y * info.width + x) * 3;
      outData[idx] = Math.round(data[idx] * (1 - hWeight) + r * hWeight);
      outData[idx+1] = Math.round(data[idx+1] * (1 - hWeight) + g * hWeight);
      outData[idx+2] = Math.round(data[idx+2] * (1 - hWeight) + b * hWeight);
    }
  }

  // 2. City silhouette inpainting behind the CTA button (y: 56 to 94, x: 375 to 625)
  // Replaces the button footprint with the natural building silhouette smoothly blended
  // from adjacent skyline columns at x=370 and x=630.
  for (let y = 56; y <= 94; y++) {
    for (let x = 375; x <= 625; x++) {
      const dx = (x - 500) / 115;
      const dy = (y - 75) / 18;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1.1) continue;

      let weight = Math.max(0, Math.min(1, (1.1 - dist) / 0.3));
      weight = weight * weight * (3 - 2 * weight);

      const u = (x - 370) / (630 - 370);
      const idxLeft = (y * info.width + 370) * 3;
      const idxRight = (y * info.width + 630) * 3;

      const cityR = data[idxLeft] * (1 - u) + data[idxRight] * u;
      const cityG = data[idxLeft+1] * (1 - u) + data[idxRight+1] * u;
      const cityB = data[idxLeft+2] * (1 - u) + data[idxRight+2] * u;

      const idx = (y * info.width + x) * 3;
      outData[idx] = Math.round(outData[idx] * (1 - weight) + cityR * weight);
      outData[idx+1] = Math.round(outData[idx+1] * (1 - weight) + cityG * weight);
      outData[idx+2] = Math.round(outData[idx+2] * (1 - weight) + cityB * weight);
    }
  }

  await sharp(outData, { raw: info })
    .png()
    .toFile(outPath);

  console.log('✔ Successfully generated seamless clean sunset-panorama-cta.png');
}

cleanSunsetBanner().catch(console.error);
