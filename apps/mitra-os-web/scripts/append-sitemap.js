/* eslint-env node */
/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');

const existingSitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';

const coreRoutes = [
  '/',
  '/about',
  '/features',
  '/pricing',
  '/contact',
  '/services',
  '/how-it-works',
  '/case-studies',
  '/free-tools',
  '/android-app',
  '/explore',
  '/official-domain',
  '/templates',
  '/faq',
  '/blog',
  '/knowledge',
  '/coverage',
  '/agents',
  '/privacy',
  '/terms',
  '/whatsapp-shop-management',
  '/get-more-google-reviews-for-shop',
  '/udhaar-management-app',
];

const newUrls = coreRoutes.map(route => `
  <url>
    <loc>https://dukaanmitra.in${route === '/' ? '' : route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

let newSitemap;
if (existingSitemap.includes('</urlset>')) {
  newSitemap = existingSitemap.replace('</urlset>', newUrls + '\n</urlset>');
} else {
  newSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${newUrls}
</urlset>`;
}

fs.writeFileSync(sitemapPath, newSitemap);
console.log('Sitemap appended');
