const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function extractAssets() {
  const refPath = path.resolve('design/references/nihomi-landing-reference.png');
  const outDir = path.resolve('public/assets/landing-v2');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const meta = await sharp(refPath).metadata();
  console.log('Reference dimensions:', meta.width, meta.height);
  const W = meta.width;   // 682
  const H = meta.height;  // 1024

  // Crop definitions based on exact visual inspection of the 682x1024 poster:
  // 1. Hero Artwork (Center learner character + Fuji + blossoms + speech bubble):
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.382), top: Math.round(H * 0.04), width: Math.round(W * 0.410), height: Math.round(H * 0.25) })
    .toFile(path.join(outDir, 'hero-learner-sensei.png'));
  console.log('✔ Extracted refined hero-learner-sensei.png');

  // Full Hero Background / Character composition (wider crop for rich responsive backdrop):
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.28), top: Math.round(H * 0.04), width: Math.round(W * 0.50), height: Math.round(H * 0.25) })
    .toFile(path.join(outDir, 'hero-scene.png'));
  console.log('✔ Extracted hero-scene.png');

  // 2. Lesson Demo Cards:
  // 'あお (নীল)' thumbnail
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.495), top: Math.round(H * 0.372), width: Math.round(W * 0.06), height: Math.round(H * 0.032) })
    .toFile(path.join(outDir, 'lesson-blue-ao.png'));
  console.log('✔ Extracted lesson-blue-ao.png');

  // 'りんご (আপেল)' thumbnail
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.575), top: Math.round(H * 0.372), width: Math.round(W * 0.06), height: Math.round(H * 0.032) })
    .toFile(path.join(outDir, 'lesson-apple-ringo.png'));
  console.log('✔ Extracted lesson-apple-ringo.png');

  // 'いぬ (কুকুর)' thumbnail
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.655), top: Math.round(H * 0.372), width: Math.round(W * 0.06), height: Math.round(H * 0.032) })
    .toFile(path.join(outDir, 'lesson-dog-inu.png'));
  console.log('✔ Extracted lesson-dog-inu.png');

  // Sensei avatar (top right of lesson card)
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.755), top: Math.round(H * 0.295), width: Math.round(W * 0.05), height: Math.round(H * 0.03) })
    .toFile(path.join(outDir, 'sensei-avatar.png'));
  console.log('✔ Extracted sensei-avatar.png');

  // 3. Japan Outcome 4 Cards (More than Language section):
  // Card 1: Study in Japan (Girl student with book)
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.306), top: Math.round(H * 0.582), width: Math.round(W * 0.152), height: Math.round(H * 0.070) })
    .toFile(path.join(outDir, 'japan-study.png'));
  console.log('✔ Extracted japan-study.png');

  // Card 2: Work in Japan (Young professionals at desk)
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.472), top: Math.round(H * 0.582), width: Math.round(W * 0.152), height: Math.round(H * 0.070) })
    .toFile(path.join(outDir, 'japan-work.png'));
  console.log('✔ Extracted japan-work.png');

  // Card 3: Travel in Japan (Chureito pagoda & Fuji & blossoms)
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.645), top: Math.round(H * 0.582), width: Math.round(W * 0.152), height: Math.round(H * 0.070) })
    .toFile(path.join(outDir, 'japan-travel.png'));
  console.log('✔ Extracted japan-travel.png');

  // Card 4: Culture in Japan (Girl enjoying bowl)
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.820), top: Math.round(H * 0.582), width: Math.round(W * 0.152), height: Math.round(H * 0.070) })
    .toFile(path.join(outDir, 'japan-culture.png'));
  console.log('✔ Extracted japan-culture.png');

  // 4. Student Story Avatars:
  // Student 1 (Sanjida)
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.07), top: Math.round(H * 0.735), width: Math.round(W * 0.065), height: Math.round(H * 0.043) })
    .toFile(path.join(outDir, 'student-sanjida.png'));
  console.log('✔ Extracted student-sanjida.png');

  // Student 2 (Riad)
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.38), top: Math.round(H * 0.735), width: Math.round(W * 0.065), height: Math.round(H * 0.043) })
    .toFile(path.join(outDir, 'student-riad.png'));
  console.log('✔ Extracted student-riad.png');

  // Student 3 (Tania)
  await sharp(refPath)
    .extract({ left: Math.round(W * 0.69), top: Math.round(H * 0.735), width: Math.round(W * 0.065), height: Math.round(H * 0.043) })
    .toFile(path.join(outDir, 'student-tania.png'));
  console.log('✔ Extracted student-tania.png');

  // 5. Final Sunset Panorama Banner (bottom):
  await sharp(refPath)
    .extract({ left: 0, top: Math.round(H * 0.920), width: W, height: Math.round(H * 0.080) })
    .toFile(path.join(outDir, 'sunset-panorama-cta.png'));
  console.log('✔ Extracted sunset-panorama-cta.png');

  console.log('All assets successfully extracted!');
}

extractAssets().catch(console.error);
