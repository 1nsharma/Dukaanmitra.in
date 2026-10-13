import fs from 'fs';

function addOgImage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /<meta property="og:url" content=.*? \/>/,
    (match) => `${match}\n        <meta property="og:image" content="https://dukaanmitra.in/logo.png" />\n        <meta name="twitter:image" content="https://dukaanmitra.in/logo.png" />`
  );
  fs.writeFileSync(filePath, content);
}

['App.tsx', 'components/LandingPage.tsx'].forEach(addOgImage);
console.log("Patched OG images!");
