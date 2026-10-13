import fs from 'fs';
let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

const moreSchemas = `
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "DukaanMitra AI OS",
    "description": "AI WhatsApp Business Operating System for Kirana Stores",
    "url": "https://dukaanmitra.in",
    "primaryImageOfPage": {
      "@type": "ImageObject",
      "url": "https://dukaanmitra.in/logo.png"
    }
  };
`;

content = content.replace('const localBusinessSchema = {', moreSchemas + '\n  const localBusinessSchema = {');
content = content.replace(
  '<script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>',
  `<script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>`
);

fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Patched more schemas!");
