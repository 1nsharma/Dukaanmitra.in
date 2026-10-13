import fs from 'fs';
import path from 'path';

// Import geoData JSON safely using fs
const geoDataPath = path.resolve('./lib/geoData.json');
let geoData = { locations: [] };
if (fs.existsSync(geoDataPath)) {
  geoData = JSON.parse(fs.readFileSync(geoDataPath, 'utf8'));
}

const SITE_URL = 'https://dukaanmitra.in';

// Define core routes
const routes = [
  { path: '', changefreq: 'daily', priority: 1.0 },
  { path: 'features', changefreq: 'weekly', priority: 0.9 },
  { path: 'services', changefreq: 'weekly', priority: 0.9 },
  { path: 'how-it-works', changefreq: 'weekly', priority: 0.9 },
  { path: 'pricing', changefreq: 'monthly', priority: 0.7 },
  { path: 'udhaar-management-app', changefreq: 'weekly', priority: 1.0 },
  { path: 'whatsapp-shop-management', changefreq: 'weekly', priority: 1.0 },
  { path: 'get-more-google-reviews-for-shop', changefreq: 'weekly', priority: 1.0 },
  { path: 'free-tools', changefreq: 'weekly', priority: 0.9 },
  { path: 'templates', changefreq: 'weekly', priority: 0.9 },
  { path: 'case-studies', changefreq: 'weekly', priority: 0.8 },
  { path: 'contact', changefreq: 'weekly', priority: 0.8 },
  { path: 'blog', changefreq: 'daily', priority: 0.8 },
  { path: 'faq', changefreq: 'monthly', priority: 0.5 },
  { path: 'knowledge', changefreq: 'daily', priority: 0.9 },
  { path: 'coverage', changefreq: 'weekly', priority: 0.7 },
  { path: 'docs', changefreq: 'weekly', priority: 0.9 },
  { path: 'changelog', changefreq: 'weekly', priority: 0.7 },
  { path: 'roadmap', changefreq: 'weekly', priority: 0.8 },
  { path: 'founder', changefreq: 'weekly', priority: 0.8 },
  { path: 'security', changefreq: 'weekly', priority: 0.9 },
  { path: 'support', changefreq: 'weekly', priority: 0.8 },
  { path: 'llms.txt', changefreq: 'weekly', priority: 0.8 },
  { path: 'llms-full.txt', changefreq: 'weekly', priority: 0.8 },
  { path: 'robots.txt', changefreq: 'weekly', priority: 0.5 },
];

const programmaticComparisons = ['okcredit', 'khatabook', 'vyapar'];
const programmaticPages = [
  'retail-store-software', 'bahi-khata-alternative', 'inventory-management-retail',
  'increase-google-business-rating', 'whatsapp-review-automation', 'dukaan-online-kaise-laye',
  'apni-dukan-ko-digital-kaise-banaye', 'retail-dukaan-ke-liye-ai-billing-software',
  'whatsapp-se-saman-kaise-beche', 'retail-store-ko-grow-kaise-kare', 'best-billing-software-for-mobile-shop',
  'garment-shop-software-free', 'hardware-shop-billing-app', 'medical-store-software-india',
  'supermarket-billing-software-free-download', 'jewellery-shop-management-software',
  'sweet-shop-billing-software', 'footwear-shop-software', 'electronics-shop-billing-app',
  'retail-khata-app-for-pc', 'bina-internet-ke-billing-machine', 'whatsapp-par-customer-ko-bill-kaise-bheje',
  'auto-parts-shop-free-billing', 'grocery-shop-inventory-excel', 'retail-shop-accounting-software',
  'free-gst-billing-software', 'mobile-accessories-shop-software', 'retail-shop-profit-calculator',
  'whatsapp-catalog-maker-app', 'digital-payment-tracker-for-shop',
  'dukaanmitra', 'mitraos', 'munim-ai', 'ai-retail-os', 'whatsapp-commerce', 
  'ai-munim', 'retail-automation', 'digital-udhaar', 'retail-intelligence', 'bharat-commerce-os'
];

const blogPages = [
  'udhaar-ka-hisaab-kaise-rakhe', 'retail-shop-daily-sales-system', 'best-billing-software-for-small-shop',
  'kanpur-me-shop-ko-online-kaise-laaye', 'ai-sandboxing-secure-shop-data', 'google-business-profile-kaise-banaye',
  'gbp-suspend-kyun-hota-hai', 'whatsapp-se-order-kaise-le', 'local-business-ko-customer-kaise-mile',
  'manage-retail-store-digitally-india-2026', 'bahi-khata-ai-se-kaise-manage-karein', 'whatsapp-munim-vs-human-munim'
];

const aiCities = [
  "mumbai", "delhi", "bangalore", "hyderabad", "ahmedabad", "chennai", "kolkata", "pune", "surat", 
  "jaipur", "lucknow", "kanpur", "indore", "nagpur", "patna", "ludhiana", "coimbatore", "kochi", 
  "visakhapatnam", "bhopal", "varanasi", "madurai", "meerut", "nashik", "rajkot"
];

// Combine standard cities array + AI specific cities array to avoid duplication
const cities = Array.from(new Set([
  'lucknow', 'kanpur', 'delhi', 'mumbai', 'bangalore', 'pune', 'ahmedabad', 'hyderabad', 'chennai', 'kolkata', 'jaipur', 'surat',
  'agra', 'aligarh', 'allahabad', 'amritsar', 'aurangabad', 'bareilly', 'bhavnagar', 'bhiwandi', 'bhopal', 'bhubaneswar',
  'bikaner', 'chandigarh', 'coimbatore', 'cuttack', 'dehradun', 'dhanbad', 'bhilai', 'durgapur', 'erode', 'faridabad',
  'firozabad', 'ghaziabad', 'gorakhpur', 'gulbarga', 'guntur', 'gwalior', 'guwahati', 'hubli', 'indore', 'jabalpur',
  'jalandhar', 'jalgaon', 'jamnagar', 'jamshedpur', 'jhansi', 'jodhpur', 'kakinada', 'kochi', 'kolhapur', 'kollam',
  'kota', 'kozhikode', 'kurnool', 'ludhiana', 'madurai', 'malegaon', 'mangalore', 'meerut', 'moradabad', 'mysore',
  'nagpur', 'nanded', 'nashik', 'nellore', 'noida', 'patna', 'pondicherry', 'raipur', 'rajkot', 'rajahmundry', 'ranchi',
  'rourkela', 'salem', 'sangli', 'siliguri', 'solapur', 'srinagar', 'thiruvananthapuram', 'thrissur', 'tiruchirappalli',
  'tirunelveli', 'tiruppur', 'ujjain', 'vadodara', 'varanasi', 'vasai-virar', 'vijayawada', 'visakhapatnam', 'warangal',
  'gurgaon', 'ajmer', 'akola', 'ulhasnagar', 'saharanpur', 'rohtak', 'mathura', 'gaya', ...aiCities
]));

const today = new Date().toISOString().split('T')[0];

function generateXmlEntry(url, changefreq, priority, lastmod = today) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Core Routes
routes.forEach(route => {
  xmlContent += generateXmlEntry(`${SITE_URL}${route.path ? '/' + route.path : ''}`, route.changefreq, route.priority) + '\n';
});

// Comparison Routes
programmaticComparisons.forEach(slug => {
  xmlContent += generateXmlEntry(`${SITE_URL}/compare/${slug}`, 'monthly', 0.8) + '\n';
});

// Programmatic Features/Pain Point Pages
programmaticPages.forEach(slug => {
  xmlContent += generateXmlEntry(`${SITE_URL}/p/${slug}`, 'weekly', 0.8) + '\n';
});

// Blog Pages
blogPages.forEach(slug => {
  xmlContent += generateXmlEntry(`${SITE_URL}/blog/${slug}`, 'weekly', 0.8) + '\n';
});

// City Pages
cities.forEach(city => {
  xmlContent += generateXmlEntry(`${SITE_URL}/solutions/retail-ai-${city}`, 'weekly', 0.7) + '\n';
});

// Global Strategy Pages
geoData.locations.forEach(loc => {
  xmlContent += generateXmlEntry(`${SITE_URL}/solutions/${loc.country}/${loc.state}/${loc.city}`, 'weekly', 0.7) + '\n';
});

xmlContent += `</urlset>`;

// Write to public folder usually, but we will write to dist before deploying and to root for keeping track
fs.writeFileSync(path.resolve('./public/sitemap.xml'), xmlContent);

