const fs = require('fs');
let content = fs.readFileSync('components/ui/Button.tsx', 'utf8');

content = content.replace(/'h-10 px-4 text-\[10px\] rounded-xl'/, "'h-11 px-5 text-[10px] md:text-xs rounded-xl'");
content = content.replace(/'h-12 w-12 rounded-xl p-0'/, "'h-12 w-12 md:h-14 md:w-14 rounded-xl p-0'");

fs.writeFileSync('components/ui/Button.tsx', content);
console.log("Patched Button.tsx for touch targets");
