const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function sliceSections() {
  const refPath = 'storage/evidence/reference-1024x1536.png';
  const outDir = 'storage/evidence/reference-sections';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const sections = [
    { name: '01-header', top: 0, height: 60 },
    { name: '02-hero', top: 60, height: 380 },
    { name: '03-try-lesson', top: 440, height: 235 },
    { name: '04-journey', top: 675, height: 215 },
    { name: '05-outcomes', top: 890, height: 210 },
    { name: '06-testimonials', top: 1100, height: 160 },
    { name: '07-pricing', top: 1260, height: 165 },
    { name: '08-banner', top: 1425, height: 111 }
  ];

  for (const s of sections) {
    await sharp(refPath)
      .extract({ left: 0, top: s.top, width: 1024, height: s.height })
      .toFile(path.join(outDir, `${s.name}.png`));
    console.log(`Sliced ${s.name}: top ${s.top}, height ${s.height}`);
  }
}

sliceSections().catch(console.error);
