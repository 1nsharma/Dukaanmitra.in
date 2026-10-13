const fs = require('fs');
let content = fs.readFileSync('components/FeaturePage.tsx', 'utf8');

content = content.replace(/p-10 rounded-3xl/g, 'p-6 md:p-10 rounded-3xl');
content = content.replace(/text-4xl md:text-6xl/g, 'text-3xl md:text-5xl lg:text-6xl');
content = content.replace(/text-3xl font-black text-slate-900 italic tracking-tight/g, 'text-2xl md:text-3xl font-black text-slate-900 italic tracking-tight');
content = content.replace(/text-2xl font-bold text-indigo-600 leading-relaxed border-l-4/g, 'text-xl md:text-2xl font-bold text-indigo-600 leading-relaxed border-l-4');
content = content.replace(/p-8 rounded-3xl/g, 'p-6 md:p-8 rounded-[2rem]');

fs.writeFileSync('components/FeaturePage.tsx', content);
console.log("Patched FeaturePage responsive");
