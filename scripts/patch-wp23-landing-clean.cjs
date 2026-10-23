const fs = require('fs');

console.log('--- Cleaning remaining rogue colors in Landing V2 components ---');

// 1. JlptMockPracticeSection.tsx
let jlpt = fs.readFileSync('src/components/landing-v2/JlptMockPracticeSection.tsx', 'utf8').replace(/\r\n/g, '\n');
jlpt = jlpt.replace("badgeColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30'", "badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30'");
jlpt = jlpt.replace("badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30'", "badgeColor: 'bg-[#E45147]/20 text-[#E45147] border-[#E45147]/30'");
jlpt = jlpt.replace("badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'", "badgeColor: 'bg-stone-500/20 text-stone-300 border-stone-500/30'");
fs.writeFileSync('src/components/landing-v2/JlptMockPracticeSection.tsx', jlpt, 'utf8');
console.log('✓ JlptMockPracticeSection.tsx cleaned');

// 2. FinalJapanCTA.tsx
let fcta = fs.readFileSync('src/components/landing-v2/FinalJapanCTA.tsx', 'utf8').replace(/\r\n/g, '\n');
fcta = fcta.replace('text-purple-100 font-medium', 'text-stone-200 font-medium');
fcta = fcta.replace('bg-gradient-to-r from-[#F472B6] via-[#E879F9] to-[#38BDF8] hover:opacity-95 text-[#101A59] font-black text-[10px] border border-white/80 shadow-[0_0_12px_rgba(232,121,249,0.5)]', 'bg-gradient-to-r from-[#E45147] to-[#F59E0B] hover:brightness-110 text-white font-black text-[11px] border border-white/40 shadow-lg shadow-red-600/30');
fs.writeFileSync('src/components/landing-v2/FinalJapanCTA.tsx', fcta, 'utf8');
console.log('✓ FinalJapanCTA.tsx cleaned');

// 3. JapanReadinessSection.tsx
let jread = fs.readFileSync('src/components/landing-v2/JapanReadinessSection.tsx', 'utf8').replace(/\r\n/g, '\n');
jread = jread.replace('hover:border-purple-200', 'hover:border-amber-400/50');
fs.writeFileSync('src/components/landing-v2/JapanReadinessSection.tsx', jread, 'utf8');
console.log('✓ JapanReadinessSection.tsx cleaned');

// 4. LearningJourneySection.tsx
let ljs = fs.readFileSync('src/components/landing-v2/LearningJourneySection.tsx', 'utf8').replace(/\r\n/g, '\n');
ljs = ljs.replace("accent: 'text-indigo-600'", "accent: 'text-amber-500'");
ljs = ljs.replace("border: 'hover:border-indigo-600/50'", "border: 'hover:border-amber-500/50'");
fs.writeFileSync('src/components/landing-v2/LearningJourneySection.tsx', ljs, 'utf8');
console.log('✓ LearningJourneySection.tsx cleaned');

// 5. TryLessonSection.tsx
let tls = fs.readFileSync('src/components/landing-v2/TryLessonSection.tsx', 'utf8').replace(/\r\n/g, '\n');
tls = tls.replace("bg-gradient-to-r from-[#6D25EA] to-[#4F46E5] text-white shadow-xs", "bg-gradient-to-r from-[#E45147] to-[#F59E0B] text-white shadow-xs");
tls = tls.replace("bg-transparent text-slate-700 hover:bg-purple-50/70 hover:text-[#6D25EA]", "bg-transparent text-slate-700 hover:bg-red-50 hover:text-[#E45147]");
tls = tls.replace("bg-purple-100 border-[#6D25EA] text-[#6D25EA] scale-105", "bg-[#E45147]/15 border-[#E45147] text-[#E45147] scale-105");
tls = tls.replace("bg-slate-50/80 hover:bg-purple-50/60", "bg-slate-50/80 hover:bg-red-50/60");
tls = tls.replace("bg-[#FAF5FF] p-1.5 rounded-xl text-[8.5px] font-semibold text-slate-800 leading-tight border border-purple-100/70", "bg-amber-500/10 p-1.5 rounded-xl text-[8.5px] font-semibold text-slate-800 leading-tight border border-amber-500/20");
tls = tls.replace("bg-gradient-to-r from-[#3B1774] to-[#581C87]", "bg-[#141726]");
tls = tls.replace(/bg-purple-300/g, 'bg-amber-400');
tls = tls.replace("bg-[#6D25EA] hover:bg-[#5818D1]", "bg-[#E45147] hover:bg-[#c93f35]");
tls = tls.replace("bg-[#FDF2F8]/60 p-1.5 rounded-xl border border-pink-100", "bg-emerald-500/10 p-1.5 rounded-xl border border-emerald-500/20");
tls = tls.replace("text-[#6D25EA]", "text-emerald-700 font-bold");
fs.writeFileSync('src/components/landing-v2/TryLessonSection.tsx', tls, 'utf8');
console.log('✓ TryLessonSection.tsx cleaned');

console.log('--- Landing V2 rogue colors fully eliminated! ---');
