const fs = require('fs');

console.log('\n========================================================');
console.log('⚡ NIHOMI.COM — VERCEL WARNING FIX & FEATURE INTEGRATION');
console.log('========================================================\n');

// ১. package.json এ esbuild define যুক্ত করে import.meta ওয়ার্নিং দূর করা
try {
  const pkgPath = 'package.json';
  if (fs.existsSync(pkgPath)) {
    let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.scripts && pkg.scripts.build && !pkg.scripts.build.includes('--define:import.meta.env=process.env')) {
      pkg.scripts.build = pkg.scripts.build.replace(
        'server.ts --bundle',
        'server.ts --bundle --define:import.meta.env=process.env'
      );
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
      console.log('✅ [Cleaned]: esbuild import.meta warning eliminated from package.json');
    }
  }
} catch (e) {
  console.log('Error updating package.json:', e.message);
}

// ২. .env ফাইলে মিসিং অ্যানালিটিক্স ভেরিয়েবল সেট করে Vite ওয়ার্নিং দূর করা
try {
  const envPath = '.env';
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  let updated = false;

  if (!envContent.includes('VITE_GA_MEASUREMENT_ID')) {
    envContent += '\nVITE_GA_MEASUREMENT_ID=""';
    updated = true;
  }
  if (!envContent.includes('VITE_META_PIXEL_ID')) {
    envContent += '\nVITE_META_PIXEL_ID=""';
    updated = true;
  }
  if (updated) {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ [Cleaned]: Added missing analytics placeholders to .env (Vite warnings cleared)');
  }
} catch (e) {
  console.log('Error updating .env:', e.message);
}

console.log('--- READY FOR CLEAN PRODUCTION BUILD ---\n');
