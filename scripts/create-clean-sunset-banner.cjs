const sharp = require('sharp');
const path = require('path');

async function cleanSunsetBanner() {
  const refBanner = 'storage/evidence/reference-sections/08-banner.png';
  const outPath = 'public/assets/landing-v2/sunset-panorama-cta.png';

  const { data, info } = await sharp(refBanner)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const outData = Buffer.from(data);

  // 1. Pristine sky reconstruction across all text columns (x: 40 to 825)
  for (let x = 40; x <= 825; x++) {
    // Top sky sample (y = 0..2)
    let topR = 0, topG = 0, topB = 0;
    for (let dy = 0; dy <= 2; dy++) {
      const idx = (dy * info.width + x) * 3;
      topR += data[idx]; topG += data[idx+1]; topB += data[idx+2];
    }
    topR /= 3; topG /= 3; topB /= 3;

    // Determine bottom of sky for this column (protect Mt. Fuji peak at x: 575..605)
    let maxY = 51;
    if (x >= 575 && x <= 605) {
      const distFromPeak = Math.abs(x - 590);
      maxY = Math.min(51, Math.round(33 + distFromPeak * 1.2));
    }

    // Bottom sky sample (average of maxY..maxY+2)
    let botR = 0, botG = 0, botB = 0;
    for (let dy = maxY; dy <= maxY + 2; dy++) {
      const idx = (dy * info.width + x) * 3;
      botR += data[idx]; botG += data[idx+1]; botB += data[idx+2];
    }
    botR /= 3; botG /= 3; botB /= 3;

    // Interpolate vertically for y from 3 to maxY
    for (let y = 3; y <= maxY; y++) {
      const t = (y - 3) / Math.max(1, (maxY - 3));
      const ease = t * t * (3 - 2 * t);
      const r = Math.round(topR + (botR - topR) * ease);
      const g = Math.round(topG + (botG - topG) * ease);
      const b = Math.round(botB + (botB - topB) * ease);

      let hWeight = 1.0;
      if (x < 60) hWeight = (x - 40) / 20;
      else if (x > 805) hWeight = (825 - x) / 20;

      hWeight = Math.max(0, Math.min(1, hWeight));
      hWeight = hWeight * hWeight * (3 - 2 * hWeight);

      const idx = (y * info.width + x) * 3;
      outData[idx] = Math.round(data[idx] * (1 - hWeight) + r * hWeight);
      outData[idx+1] = Math.round(data[idx+1] * (1 - hWeight) + g * hWeight);
      outData[idx+2] = Math.round(data[idx+2] * (1 - hWeight) + b * hWeight);
    }
  }

  // 2. City silhouette inpainting behind the CTA button (y: 53 to 96, x: 380 to 640)
  for (let y = 53; y <= 95; y++) {
    for (let x = 380; x <= 640; x++) {
      const dx = (x - 510) / 125;
      const dy = (y - 74) / 20;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1.15) continue;

      let weight = Math.max(0, Math.min(1, (1.15 - dist) / 0.35));
      weight = weight * weight * (3 - 2 * weight);

      const u = (x - 370) / (650 - 370);
      const idxLeft = (y * info.width + 370) * 3;
      const idxRight = (y * info.width + 650) * 3;

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

  console.log('✔ Successfully generated clean, zero-ghosting sunset-panorama-cta.png');
}

cleanSunsetBanner().catch(console.error);
