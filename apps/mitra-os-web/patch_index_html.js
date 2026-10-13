import fs from 'fs';
let content = fs.readFileSync('index.html', 'utf8');

content = content.replace(/<title>.*?<\/title>/gi, '');
content = content.replace(/<meta name="description" content=".*?" \/>/gi, '');

fs.writeFileSync('index.html', content);
console.log("Patched index.html!");
