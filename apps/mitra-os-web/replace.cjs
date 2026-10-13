const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'components');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(/Kirana Software/gi, 'AI Business OS');
  content = content.replace(/Kirana Store/gi, 'Inventory Business');
  content = content.replace(/kirana store/gi, 'inventory business');
  content = content.replace(/kirana shop/gi, 'inventory business');
  content = content.replace(/Kirana shop/gi, 'Inventory Business');
  content = content.replace(/Kiranas/gi, 'Businesses');
  content = content.replace(/kiranas/gi, 'businesses');
  content = content.replace(/Kirana/gi, 'Business');
  content = content.replace(/kirana/gi, 'business');

  fs.writeFileSync(p, content, 'utf8');
}
console.log('Replaced');
