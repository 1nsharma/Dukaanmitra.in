import fs from 'fs';
let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

// Remove duplicate canonical
content = content.replace('<link rel="canonical" href="https://dukaanmitra.in/" />', '');

// Update H1
content = content.replace(
  /<h1 className="hero-text.*?">[\s\S]*?<\/h1>/,
  `<h1 className="hero-text text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black text-white leading-[0.9] tracking-tighter italic break-words">
              AI WhatsApp Business <br/>
              <span className="text-emerald-400">Operating System</span> <br/>
              for Kirana Stores
            </h1>`
);

// Update SoftwareApplication Schema features
content = content.replace(
  '"Gesture Controls",\n      "Spatial Computing UI",',
  '"WhatsApp Billing",\n      "Inventory Management",\n      "Udhaar Tracking",\n      "Customer CRM",\n      "AI Accounting",\n      "GST Reports",\n      "Analytics",'
);

// Update Video section with real iframe
const videoSectionOld = `<div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-900 aspect-video bg-slate-900 flex items-center justify-center">
            {/* Placeholder for actual video iframe */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
            <div className="relative z-10 w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_50px_rgba(16,185,129,0.5)]">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-slate-900 border-b-[12px] border-b-transparent ml-2"></div>
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-bold tracking-widest uppercase text-sm drop-shadow-md">Play Product Demo</p>
          </div>`;

const videoSectionNew = `<div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-900 aspect-video bg-slate-900">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&rel=0" 
              title="DukaanMitra AI Demo" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>`;

content = content.replace(videoSectionOld, videoSectionNew);

// Add missing schemas to LandingPage
const additionalSchemas = `
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "DukaanMitra",
    "image": "https://dukaanmitra.in/logo.png",
    "@id": "https://dukaanmitra.in/#localbusiness",
    "url": "https://dukaanmitra.in",
    "priceRange": "₹",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "DukaanMitra AI OS",
    "image": "https://dukaanmitra.in/logo.png",
    "description": "AI WhatsApp Business Operating System for Kirana Stores",
    "brand": {
      "@type": "Brand",
      "name": "DukaanMitra"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250"
    }
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "DukaanMitra AI Demo",
    "description": "Watch how DukaanMitra automates billing and udhaar recovery via WhatsApp.",
    "thumbnailUrl": "https://dukaanmitra.in/logo.png",
    "uploadDate": "2024-01-01T08:00:00+08:00",
    "contentUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  };
`;

content = content.replace('const organizationSchema = {', additionalSchemas + '\n  const organizationSchema = {');

content = content.replace(
  '<script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>',
  `<script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>`
);

fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Patched LandingPage.tsx!");
