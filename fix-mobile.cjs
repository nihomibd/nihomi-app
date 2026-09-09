const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', '.next'].includes(file)) {
        results = results.concat(walk(full));
      }
    } else if (/\.(tsx|ts|jsx|js|html)$/.test(file)) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('src');

// ১. FOCUS NEWS 24 ব্র্যান্ডিং রিমুভ
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  if (/focusnews/i.test(content) || /FOCUS\s*NEWS/i.test(content)) {
    content = content.replace(/<a[^>]*focusnews[^>]*>.*?<\/a>/gis, '');
    content = content.replace(/<img[^>]*focusnews[^>]*\/?>/gis, '');
    content = content.replace(/FOCUS\s*NEWS\s*24/gi, '');
    content = content.replace(/focusnews24\.com/gi, 'nihomi.com');
  }
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Cleaned] FocusNews removed from: ${f}`);
  }
});

// ২. CoursesView এর বাটন টেক্সট ভাঙা ফিক্স (whitespace-nowrap)
const coursesPath = path.join('src', 'views', 'CoursesView.tsx');
if (fs.existsSync(coursesPath)) {
  let content = fs.readFileSync(coursesPath, 'utf8');
  let original = content;
  content = content.replace(/(className\s*=\s*['"`][^'"`]*)(['"`])/g, (match, prefix, quote) => {
    if ((prefix.includes('rounded-') || prefix.includes('px-')) && !prefix.includes('whitespace-nowrap')) {
      return `${prefix} whitespace-nowrap shrink-0${quote}`;
    }
    return match;
  });
  if (content !== original) {
    fs.writeFileSync(coursesPath, content, 'utf8');
    console.log('[Fixed] CoursesView level buttons nowrap applied.');
  }
}

// ৩. ভাসমান লাল AI বাটনটি বটম নেভ বারের ওপরে তোলা
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;
  content = content.replace(/fixed\s+bottom-([1-6])\s+right-([1-6])/g, 'fixed bottom-20 md:bottom-6 right-$2');
  content = content.replace(/bottom-([2-5])\s+right-([2-6])\s+z-([3-5]0)/g, 'bottom-20 md:bottom-4 right-$2 z-$3');
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log(`[Fixed] Lifted floating button in: ${f}`);
  }
});

console.log('--- ALL MOBILE UI FIXES APPLIED SUCCESSFULLY ---');
