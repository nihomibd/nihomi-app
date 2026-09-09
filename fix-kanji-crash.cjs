const fs = require('fs');
const path = require('path');

console.log('\n========================================================');
console.log('🛡️ NIHOMI.COM — RECOVERY CRASH GUARD (SAFE KANJI DRILL)');
console.log('========================================================\n');

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
    } else if (/\.(tsx|ts|jsx|js)$/.test(file)) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('src');
let patchedCount = 0;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // ১. unsafe array/item access guarding
  content = content.replace(/(\w+\[[^\]]+\])\.kanji/g, '$1?.kanji');
  content = content.replace(/(\w+)\.kanji\.map/g, '($1?.kanji || []).map');
  content = content.replace(/(\w+)\.kanji\[/g, '($1?.kanji || [])[');
  content = content.replace(/(?<!\?)\.kanji(?!\w)/g, '?.kanji');

  // ২. LessonView specific fallback injection
  if (f.includes('LessonView.tsx')) {
    if (!content.includes('safeCurrentLesson')) {
      content = content.replace(
        /const\s+(\w+)\s*=\s*(currentLesson|selectedLesson|lesson);/g,
        'const $1 = $2 || { kanji: [], vocab: [], grammar: [] };\n  const safeCurrentLesson = $1;'
      );
    }
  }

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    patchedCount++;
    console.log(`✅ [Patched Safety]: ${f}`);
  }
});

console.log(`\n🎉 Total files secured against undefined crash: ${patchedCount}`);
console.log('--- RUNNING CLEAN PRODUCTION BUILD ---\n');
