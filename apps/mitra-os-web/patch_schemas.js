import fs from 'fs';
let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

const newSchemas = `
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://dukaanmitra.in/#organization",
    "name": "DukaanMitra",
    "url": "https://dukaanmitra.in",
    "logo": "https://dukaanmitra.in/logo.png",
    "description": "The AI Commerce Operating System for Indian Retail."
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://dukaanmitra.in/#website",
    "url": "https://dukaanmitra.in/",
    "name": "DukaanMitra",
    "description": "AI Commerce Operating System for Indian Retail",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://dukaanmitra.in/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://dukaanmitra.in/"
    }]
  };
`;

content = content.replace('const softwareSchema = {', newSchemas + '\n  const softwareSchema = {');

content = content.replace(
  '<script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>',
  `<script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(webSiteSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>`
);

fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Patched schemas in LandingPage!");
