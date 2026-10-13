const fs = require('fs');

let content = fs.readFileSync('components/FeaturePage.tsx', 'utf8');
content = content.replace(/screenshot:\s*'https:\/\/picsum\.photos\/seed\/[^']+'/g, `screenshot: ''`); // Or just remove the image usages
fs.writeFileSync('components/FeaturePage.tsx', content);

console.log("Patched FeaturePage images");
