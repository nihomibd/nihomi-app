import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateOgBanner() {
  const width = 1200;
  const height = 630;

  const svgBanner = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#08080e" />
        <stop offset="40%" stop-color="#0e0e18" />
        <stop offset="100%" stop-color="#14080b" />
      </linearGradient>

      <!-- Crimson Sun Radial Glow -->
      <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#dc2626" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#b91c1c" stop-opacity="0.5" />
        <stop offset="100%" stop-color="#7f1d1d" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="accentLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#dc2626" />
        <stop offset="50%" stop-color="#fbbf24" />
        <stop offset="100%" stop-color="#f43f5e" />
      </linearGradient>

      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1e2d" />
        <stop offset="100%" stop-color="#13131c" />
      </linearGradient>

      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.7" />
      </filter>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="20" flood-color="#dc2626" flood-opacity="0.6" />
      </filter>
    </defs>

    <!-- Base Canvas -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Subtle Grid Overlay -->
    <g opacity="0.08" stroke="#ffffff" stroke-width="1">
      <line x1="100" y1="0" x2="100" y2="630" />
      <line x1="250" y1="0" x2="250" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="550" y1="0" x2="550" y2="630" />
      <line x1="700" y1="0" x2="700" y2="630" />
      <line x1="850" y1="0" x2="850" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
      <line x1="1150" y1="0" x2="1150" y2="630" />
      <line x1="0" y1="100" x2="1200" y2="100" />
      <line x1="0" y1="200" x2="1200" y2="200" />
      <line x1="0" y1="315" x2="1200" y2="315" />
      <line x1="0" y1="430" x2="1200" y2="430" />
      <line x1="0" y1="530" x2="1200" y2="530" />
    </g>

    <!-- Right Rising Sun Graphic -->
    <circle cx="980" cy="315" r="260" fill="url(#sunGlow)" />
    <circle cx="980" cy="315" r="180" fill="#dc2626" opacity="0.85" filter="url(#glow)" />
    <circle cx="980" cy="315" r="140" fill="#991b1b" opacity="0.9" />

    <!-- Big Kanji Silhouette inside the sun -->
    <text x="980" y="365" font-family="'Noto Serif JP', 'Yu Mincho', serif" font-size="140" font-weight="900" fill="#ffffff" text-anchor="middle" opacity="0.95">
      日本語
    </text>

    <!-- Outer Card Border -->
    <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="24" fill="none" stroke="#262635" stroke-width="2" />
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="20" fill="none" stroke="#dc2626" stroke-width="1.5" stroke-opacity="0.3" />

    <!-- Top Left Brand Badge -->
    <g transform="translate(70, 65)">
      <!-- Logo Mark -->
      <rect width="48" height="48" rx="12" fill="#dc2626" />
      <text x="24" y="32" font-family="'Noto Serif JP', serif" font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">日</text>
      
      <!-- Brand Text -->
      <text x="64" y="28" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="900" letter-spacing="2" fill="#ffffff">
        NIHOMI<tspan fill="#f43f5e">.COM</tspan>
      </text>
      <text x="64" y="44" font-family="'Noto Sans JP', sans-serif" font-size="12" font-weight="700" letter-spacing="4" fill="#a1a1aa">
        にほみ • JAPANESE LEARNING OS
      </text>
    </g>

    <!-- Top Right Pill: JLPT N5-N1 Ready -->
    <g transform="translate(870, 70)">
      <rect width="250" height="42" rx="21" fill="#1e1e2d" stroke="#3f3f50" stroke-width="1.5" />
      <circle cx="24" cy="21" r="6" fill="#10b981" />
      <text x="40" y="27" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#f4f4f5">
        JLPT N5–N1 • LIVE 2026
      </text>
    </g>

    <!-- Main Catchphrase (Bangla + English High Converting) -->
    <g transform="translate(70, 190)">
      <!-- Top Eyebrow -->
      <text x="0" y="0" font-family="system-ui, sans-serif" font-size="16" font-weight="800" letter-spacing="3" fill="#fbbf24">
        ★ BANGLADESH TO TOKYO CAREER ACCELERATOR
      </text>

      <!-- Main Headline in Bangla -->
      <text x="0" y="55" font-family="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" font-size="44" font-weight="800" fill="#ffffff">
        শূন্য থেকে JLPT N5 জাপানিজ
      </text>
      <text x="0" y="115" font-family="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" font-size="44" font-weight="800" fill="#ffffff">
        ভাষা শেখার <tspan fill="#f43f5e">AI প্ল্যাটফর্ম</tspan>
      </text>

      <!-- Subtitle Description -->
      <text x="0" y="165" font-family="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" font-size="19" font-weight="500" fill="#d4d4d8">
        বাংলায় সহজ ব্যাখ্যা • ২৪/৭ পার্সোনাল AI সেনসি • অথেনটিক ২৫ লেসন
      </text>
      <text x="0" y="195" font-family="'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" font-size="19" font-weight="500" fill="#d4d4d8">
        টোকিও জব ও ভিসা ইন্টারভিউ সিমুলেশন • ৬০ সেকেন্ডে কুইজ শুরু করুন!
      </text>
    </g>

    <!-- 3 Core Feature Badges (Bottom left) -->
    <g transform="translate(70, 470)">
      <!-- Badge 1 -->
      <g transform="translate(0, 0)">
        <rect width="210" height="64" rx="14" fill="url(#badgeGrad)" stroke="#27273a" stroke-width="1.5" />
        <text x="20" y="28" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#f87171">📚 25 LESSONS</text>
        <text x="20" y="48" font-family="'Hind Siliguri', sans-serif" font-size="12" font-weight="600" fill="#a1a1aa">মিন্না নো নিহোঙ্গো মাস্টার</text>
      </g>

      <!-- Badge 2 -->
      <g transform="translate(225, 0)">
        <rect width="220" height="64" rx="14" fill="url(#badgeGrad)" stroke="#27273a" stroke-width="1.5" />
        <text x="20" y="28" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#fbbf24">⚡ AI SENSEI 24/7</text>
        <text x="20" y="48" font-family="'Hind Siliguri', sans-serif" font-size="12" font-weight="600" fill="#a1a1aa">ভয়েস টুইন ও অ্যাকসেন্ট ল্যাব</text>
      </g>

      <!-- Badge 3 -->
      <g transform="translate(460, 0)">
        <rect width="230" height="64" rx="14" fill="url(#badgeGrad)" stroke="#27273a" stroke-width="1.5" />
        <text x="20" y="28" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#34d399">🗼 TOKYO READINESS</text>
        <text x="20" y="48" font-family="'Hind Siliguri', sans-serif" font-size="12" font-weight="600" fill="#a1a1aa">ভিসা ও কনভিনি জব ওএস</text>
      </g>
    </g>

    <!-- Call to Action Banner on Bottom Right -->
    <g transform="translate(850, 480)">
      <rect width="270" height="54" rx="27" fill="#dc2626" filter="url(#shadow)" />
      <text x="135" y="34" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">
        nihomi.com/start →
      </text>
    </g>

    <!-- Bottom Accent Gradient Line -->
    <rect x="70" y="575" width="${width - 140}" height="3" rx="1.5" fill="url(#accentLine)" />
  </svg>
  `;

  const outputJpgPath = path.resolve('public/assets/og-nihomi-launch.jpg');
  const outputPngPath = path.resolve('public/assets/og-nihomi-banner.png');

  // Convert SVG to JPEG with high quality
  await sharp(Buffer.from(svgBanner))
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(outputJpgPath);
  console.log(`✅ Generated: ${outputJpgPath}`);

  // Also output PNG for social networks preferring PNG
  await sharp(Buffer.from(svgBanner))
    .png({ compressionLevel: 9 })
    .toFile(outputPngPath);
  console.log(`✅ Generated: ${outputPngPath}`);
}

generateOgBanner().catch((err) => {
  console.error('Error generating OG banner:', err);
  process.exit(1);
});
