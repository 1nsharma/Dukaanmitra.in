import fs from 'fs';
import path from 'path';

function replaceImages(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+(\?auto=format&fit=crop&q=80&w=1200)?/g, (match) => {
    const seed = match.split('-')[1].substring(0, 8);
    return `https://picsum.photos/seed/${seed}/1200/800`;
  });
  content = content.replace(/\/assets\/textures\/cubes\.png/g, 'https://picsum.photos/seed/cubes/1024/1024');
  
  fs.writeFileSync(filePath, content);
}

const files = ['components/StoreDashboard.tsx', 'components/FeaturePage.tsx', 'components/LandingPage.tsx', 'components/3d/core/CineEngine.tsx'];
for (const file of files) {
  if (fs.existsSync(file)) {
    replaceImages(file);
    console.log("Patched images in " + file);
  }
}
