import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, Navigate } from "react-router-dom";
import geoData from "../lib/geoData.json";
import { HybridMovieWrapper } from "./HybridMovieWrapper";

const industries = [
  "FMCG",
  "Electronics",
  "Apparel",
  "Hardware",
  "Pharma",
  "Grocery",
  "Jewelry",
  "Textile",
  "Automobile",
  "Trading",
];

const h1Templates = [
  "AI Retail Automation for Shops in {city}",
  "Smart Billing & Khata Software in {city}",
  "Next-Gen Dukaan Management in {city}",
  "Transform Your Retail Shop in {city} with AI",
  "Automate Udhaar & Inventory in {city}",
  "The #1 AI Munim for {city} Retailers",
  "Zero-Click Billing Software in {city}",
  "Grow Your Inventory Business in {city} Digitally",
  "Voice-Powered Retail AI in {city}",
  "{city}'s Smartest Retail Automation Platform",
];

const valueProps = [
  "As {city} embraces digital commerce, local {industry} retailers often struggle with manual entry, missed payments, and inaccurate stock management. Our advanced Artificial Intelligence Munim runs entirely inside WhatsApp.",
  "Retailers in {city} are losing hours daily to manual Khata management. DukaanMitra introduces a fully automated, WhatsApp-based zero-click billing system specifically tailored for the {industry} sector.",
  "Upgrade your {industry} shop in {city} without buying expensive computers. Simply speak into your phone, and our AI updates ledgers, tracks udhaar, and sends instant digital receipts.",
  "From wholesale markets to local {industry} shops in {city}, DukaanMitra is eliminating the need for traditional bookkeeping by leveraging cutting-edge LLMs natively inside WhatsApp.",
  "Stop worrying about lost ledger books. Merchants based in {city} can now run their entire {industry} business via voice notes, with 100% reliable cloud backups and instant AI insights.",
  "With the booming digital economy in {city}, traditional {industry} billing is too slow. Our AI assistant automates stock syncing and daily sales tracking effortlessly.",
  "No staff training needed. If you know how to use WhatsApp in {city}, you can use DukaanMitra to completely digitize your {industry} shop's udhaar recovery and inventory.",
  "DukaanMitra helps {city} shop owners focus on growth instead of accounting. Our AI parses Hinglish and local language voice notes to generate enterprise-grade {industry} invoices.",
  "Cash flow bottlenecks are history for {industry} businesses in {city}. DukaanMitra automatically sends polite WhatsApp payment reminders to customers, recovering pending udhaar 3x faster.",
  "Join the smartest {industry} retailers in {city}. Whether you sell wholesale or retail, our AI billing app ensures zero calculation errors and effortless daily summaries.",
];

const schemaDescTemplates = [
  "DukaanMitra provides cutting-edge AI billing and retail automation software for the {industry} sector in {city}, {state}.",
  "Leading zero-click accounting and digital khata solutions for businesses located in {city}, {state}.",
  "Streamline your {industry} retail store with voice-powered AI management in {city}.",
  "Complete local retail software and inventory management services across {city}, {country}.",
  "Top-rated WhatsApp AI Munim helping {city} shopkeepers digitize their financial records.",
  "Automated ledger, digital billing, and udhaar recovery systems for {industry} shops in {city}.",
  "Enterprise-grade AI accounting made accessible for local businesses and wholesale traders in {city}.",
  "AI-powered WhatsApp CRM and billing tool for {city}'s fast-growing {industry} retail market.",
  "Secure, cloud-based shop management application serving merchants in {city}, {state}.",
  "Smart retail automation platform increasing margins and saving time for {city} store owners.",
];

const faqTemplates = [
  [
    {
      q: "How does DukaanMitra work without a computer in {city}?",
      a: "It runs completely on WhatsApp. You just send a voice note or text describing the sale, and our AI generates the bill and updates the ledger instantly.",
    },
    {
      q: "Is it suitable for a {industry} shop?",
      a: "Yes, our AI understands {industry}-specific terms and automatically categorizes your items and inventory.",
    },
    {
      q: "Can it handle pending Udhaar?",
      a: "Absolutely. It tracks all pending amounts and can send automated, polite WhatsApp reminders to your customers in {city}.",
    },
  ],
  [
    {
      q: "Do I need to train my staff in {city}?",
      a: "Zero training required. If they can use WhatsApp, they can use DukaanMitra for your {industry} business.",
    },
    {
      q: "Is my data safe?",
      a: "We use enterprise-grade cloud security. Your {city} business data is backed up instantly and never stored locally where it can be lost.",
    },
    {
      q: "Does it work with slow internet?",
      a: "Yes, WhatsApp-based communication uses minimal data, making it highly reliable anywhere in {state}.",
    },
  ],
  [
    {
      q: "How fast can I generate a bill?",
      a: "Usually under 3 seconds. The AI processes your natural language input and instantly returns a formatted PDF receipt.",
    },
    {
      q: "Will this help my {industry} shop grow?",
      a: "By freeing up hours of manual entry and tracking dead stock, you can focus entirely on customer service and growth in {city}.",
    },
    {
      q: "Can I try it before paying?",
      a: "Yes, we offer trial periods so you can see the AI magic work in your {city} store firsthand.",
    },
  ],
];

const marketNamesTemplate = [
  "Main Bazaar",
  "Station Road Market",
  "Sadar Bazaar",
  "Gandhi Market",
  "Chowk Area",
  "Civil Lines",
  "Wholesale Market",
  "New Market",
  "City Centre",
  "Old Town Stores",
  "Sarafa Bazaar",
  "Subhash Market",
  "Commercial Street",
  "MG Road Sector",
];

// Simple hash function for consistent RNG
const getStringHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const GlobalCityPage: React.FC = () => {
  const { country, state, city } = useParams<{
    country: string;
    state: string;
    city: string;
  }>();

  // Use raw parameters or format them
  const formattedCity = city
    ? encodeURIComponent(city.replace(/-/g, " "))
    : "City";
  const formattedState = state
    ? encodeURIComponent(state.replace(/-/g, " "))
    : "State";
  const formattedCountry = country
    ? encodeURIComponent(country.replace(/-/g, " "))
    : "Country";

  const decodedCity = decodeURIComponent(formattedCity)
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const decodedState = decodeURIComponent(formattedState)
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const decodedCountry = decodeURIComponent(formattedCountry)
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Dynamic Content Logic - Fuzzy Match / Fallback (No 404s)
  const geoNode = (
    geoData.locations as {
      city: string;
      display_name: string;
      wikidata?: string;
      population_tier?: string;
      industry?: string;
    }[]
  ).find(
    (loc) =>
      loc.city === city ||
      loc.display_name.toLowerCase() === decodedCity.toLowerCase(),
  );

  if (!geoNode) {
    return <Navigate to={`/solutions/${country}/${state}`} replace />;
  }

  const wikidataId = geoNode?.wikidata || "";
  const tier = geoNode?.population_tier || "Tier-X";

  // Content Spintax / RNG based on city hash to make templates unique but deterministic per city
  const hash = getStringHash(
    `${decodedCity}-${decodedState}-${decodedCountry}`,
  );

  // Use geoNode industry if available, else fallback to RNG
  const localIndustry =
    geoNode?.industry || industries[hash % industries.length];

  const h1Text = h1Templates[hash % h1Templates.length].replace(
    /{city}/g,
    decodedCity,
  );
  const valuePropText = valueProps[hash % valueProps.length]
    .replace(/{city}/g, decodedCity)
    .replace(/{industry}/g, localIndustry)
    .replace(/{state}/g, decodedState);

  const schemaDescText = schemaDescTemplates[hash % schemaDescTemplates.length]
    .replace(/{city}/g, decodedCity)
    .replace(/{industry}/g, localIndustry)
    .replace(/{state}/g, decodedState)
    .replace(/{country}/g, decodedCountry);

  const selectedFaqs = [
    {
      q: `Is DukaanMitra available for shops in ${decodedCity}?`,
      a: `Yes, DukaanMitra is fully operational in ${decodedCity}, ${decodedState}, providing local support and AI billing solutions tailored for the ${localIndustry} market.`,
    },
    ...faqTemplates[hash % faqTemplates.length].map((faq) => ({
      q: faq.q
        .replace(/{city}/g, decodedCity)
        .replace(/{industry}/g, localIndustry)
        .replace(/{state}/g, decodedState),
      a: faq.a
        .replace(/{city}/g, decodedCity)
        .replace(/{industry}/g, localIndustry)
        .replace(/{state}/g, decodedState),
    })),
  ];

  // Markets Logic
  const numMarkets = (hash % 3) + 2;
  const localMarkets = Array.from({ length: numMarkets }).map(
    (_, i) => marketNamesTemplate[(hash + i) % marketNamesTemplate.length],
  );

  // Semantic Mesh logic: Fetch sister cities from the same state
  const sisterCities = (
    geoData.locations as {
      city: string;
      state: string;
      country: string;
      display_name: string;
    }[]
  )
    .filter(
      (loc) =>
        loc.state === state && loc.country === country && loc.city !== city,
    )
    .sort(() => 0.5 - Math.random()) // Randomize slightly or use hash-based if strict determinism needed
    .slice(0, 8); // Take up to 8

  const title = `AI-Powered Business & Billing Software in ${decodedCity}, ${decodedState} | DukaanMitra`;
  const description = `Looking for ${localIndustry} retail software or a smart billing app in ${decodedCity}? DukaanMitra brings AI-driven WhatsApp accounting to ${decodedState}, ${decodedCountry}. Replace your manual khata today.`;

  // Dynamic dynamic coordinates logic for high-fidelity LocalBusiness GEO tagging
  const coords = (() => {
    const normalized = decodedCity.toLowerCase().trim();
    const knownCoords: Record<string, { lat: number; lng: number }> = {
      mumbai: { lat: 19.076, lng: 72.8777 },
      delhi: { lat: 28.7041, lng: 77.1025 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      bengaluru: { lat: 12.9716, lng: 77.5946 },
      hyderabad: { lat: 17.385, lng: 78.4867 },
      ahmedabad: { lat: 23.0225, lng: 72.5714 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      pune: { lat: 18.5204, lng: 73.8567 },
      surat: { lat: 21.1702, lng: 72.8311 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      lucknow: { lat: 26.8467, lng: 80.9462 },
      kanpur: { lat: 26.4499, lng: 80.3319 },
      patna: { lat: 25.5941, lng: 85.1376 },
      indore: { lat: 22.7196, lng: 75.8577 },
      bhopal: { lat: 23.2599, lng: 77.4126 },
      ludhiana: { lat: 30.901, lng: 75.8573 },
      varanasi: { lat: 25.3176, lng: 82.9739 },
      agra: { lat: 27.1767, lng: 78.0081 },
      saharanpur: { lat: 29.964, lng: 77.546 },
      gurgaon: { lat: 28.4595, lng: 77.0266 },
      gurugram: { lat: 28.4595, lng: 77.0266 },
      noida: { lat: 28.5355, lng: 77.391 },
    };
    if (knownCoords[normalized]) return knownCoords[normalized];
    let tempHash = 0;
    for (let i = 0; i < normalized.length; i++) {
      tempHash = (tempHash << 5) - tempHash + normalized.charCodeAt(i);
      tempHash |= 0;
    }
    const factorLat = Math.abs(tempHash % 1000) / 1000;
    const factorLng = Math.abs((tempHash >> 3) % 1000) / 1000;
    return {
      lat: Math.round((12 + factorLat * 18) * 10000) / 10000,
      lng: Math.round((72 + factorLng * 15) * 10000) / 10000,
    };
  })();

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `https://dukaanmitra.in/solutions/${country}/${state}/${city}#software`,
    name: `DukaanMitra AI for ${decodedCity}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    description: schemaDescText,
    provider: {
      "@type": "Organization",
      name: "DukaanMitra",
    },
    areaServed: {
      "@type": "City",
      name: decodedCity,
      addressRegion: decodedState,
      addressCountry: decodedCountry,
    },
    ...(wikidataId
      ? {
          sameAs: [
            `https://www.wikidata.org/wiki/${wikidataId}`,
            `https://en.wikipedia.org/wiki/${decodedCity.replace(/ /g, "_")}`,
          ],
        }
      : {}),
    url: `https://dukaanmitra.in/solutions/${country}/${state}/${city}`,
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://dukaanmitra.in/solutions/${country}/${state}/${city}#local-business`,
    name: `DukaanMitra AI Retail & CRM - ${decodedCity}`,
    image: "https://dukaanmitra.in/assets/logo.svg",
    description: `DukaanMitra voice-powered WhatsApp accounting, smart billing & automated ledger management service personalized for merchants from ${decodedCity}, ${decodedState}.`,
    telephone: "+919876543210",
    url: `https://dukaanmitra.in/solutions/${country}/${state}/${city}`,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: decodedCity,
      addressRegion: decodedState,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: coords.lat,
      longitude: coords.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `https://dukaanmitra.in/solutions/${country}/${state}/${city}#service`,
    name: "DukaanMitra WhatsApp AI Billing & Bookkeeping",
    serviceType: "Retail Automation & Digital Ledger Book Service",
    provider: {
      "@type": "Organization",
      name: "DukaanMitra",
      url: "https://dukaanmitra.in/",
    },
    areaServed: {
      "@type": "City",
      name: decodedCity,
      addressRegion: decodedState,
      addressCountry: "IN",
    },
    description: `Voice-powered automated bookkeeping, real-time inventory management, zero-click invoices, and automated polite WhatsApp payment reminders for ${decodedCity} store keepers.`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `https://dukaanmitra.in/solutions/${country}/${state}/${city}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://dukaanmitra.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Coverage",
        item: "https://dukaanmitra.in/coverage",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: decodedState,
        item: `https://dukaanmitra.in/solutions/${country}/${state}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: decodedCity,
        item: `https://dukaanmitra.in/solutions/${country}/${state}/${city}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://dukaanmitra.in/solutions/${country}/${state}/${city}#faq`,
    mainEntity: selectedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <HybridMovieWrapper>
      <div className="min-h-screen bg-slate-50">
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta
            name="keywords"
            content={`ai retail ${decodedCity}, AI Business OS ${decodedState}, ${localIndustry} billing app, business automation ${decodedCountry}, dukaan management app, ${tier} retail software`}
          />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`https://dukaanmitra.in/solutions/${country}/${state}/${city}`}
          />
          <meta property="og:site_name" content="DukaanMitra" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <link
            rel="canonical"
            href={`https://dukaanmitra.in/solutions/${country}/${state}/${city}`}
          />
          <script type="application/ld+json">
            {JSON.stringify(schemaJson)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(localBusinessSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(serviceSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        </Helmet>

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-slate-900 border-b border-slate-800">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500 blur-[150px] translate-x-1/2 -translate-y-1/2 rounded-full"></div>
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-indigo-500 blur-[150px] -translate-x-1/2 translate-y-1/2 rounded-full"></div>
          </div>

          <div className="max-w-6xl mx-auto relative z-10 text-center space-y-10">
            {/* Breadcrumbs Navigation */}
            <nav className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center justify-center space-x-2">
              <Link to="/" className="hover:text-emerald-400 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                to="/coverage"
                className="hover:text-emerald-400 transition-colors"
              >
                Coverage
              </Link>
              <span>/</span>
              <Link
                to={`/solutions/${country}/${state}`}
                className="hover:text-emerald-400 transition-colors"
              >
                {decodedState}
              </Link>
              <span>/</span>
              <span className="text-white">{decodedCity}</span>
            </nav>

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/50 border border-slate-700/50 shadow-2xl backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                {decodedCountry} &gt; {decodedState} &gt; {decodedCity}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tighter leading-[1.1] uppercase text-white">
              {h1Text.split("{city}")[0]}
              {h1Text.includes("{city}") && (
                <span className="text-emerald-400">{decodedCity}</span>
              )}
              {h1Text.split("{city}")[1]}
            </h1>
            <p className="text-xl text-slate-400 font-bold max-w-3xl mx-auto">
              DukaanMitra is bringing next-gen AI billing and inventory tools to{" "}
              {localIndustry} businesses in {decodedCity}, {decodedCountry}.
              Transform your daily khata into a smart automated engine.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/whatsapp"
                className="group relative inline-flex items-center justify-center gap-4 bg-emerald-400 text-slate-900 px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-emerald-300 hover:shadow-[0_0_40px_rgba(52,211,153,0.4)] hover:scale-105"
              >
                Start AI Shop in {decodedCity}
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24 px-6 bg-slate-50 relative">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight text-slate-900">
              Why Replace Your Manual Khata in {decodedCity}?
            </h2>
            <div className="prose prose-lg text-slate-600 font-medium leading-relaxed italic">
              <p>{valuePropText}</p>
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-lg my-6">
                <span className="font-bold text-slate-900 block mb-2">
                  Key Retail Catchments in {decodedCity}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {localMarkets.map((market) => (
                    <span
                      key={market}
                      className="bg-white text-indigo-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm"
                    >
                      {market}
                    </span>
                  ))}
                </div>
              </div>
              <p>
                Whether you are running a Inventory Business, a hardware shop,
                or a local boutique in {decodedState}, moving to conversational
                AI billing saves you an average of 14 hours a week. Simply type
                or speak into WhatsApp, and the system automatically updates
                your ledgers, syncs your inventory, and manages your Udhaar
                (credit) recovery.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
                <h3 className="text-2xl font-black italic text-slate-900 mb-4">
                  Zero Learning Curve
                </h3>
                <p className="text-slate-600">
                  If you know how to send a WhatsApp message in {decodedCity},
                  you already know how to use DukaanMitra. It understands
                  natural local languages.
                </p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
                <h3 className="text-2xl font-black italic text-slate-900 mb-4">
                  Cloud Secure Tracking
                </h3>
                <p className="text-slate-600">
                  Your customer data and accounts are safely backed up to
                  enterprise cloud databases. Never lose a ledger book to damage
                  again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight text-slate-900 text-center">
              Frequently Asked Questions in {decodedCity}
            </h2>
            <div className="space-y-6">
              {selectedFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-8 rounded-3xl border border-slate-100"
                >
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-slate-600 font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Semantic Mesh - Related Hubs */}
        {sisterCities.length > 0 && (
          <section className="py-24 px-6 bg-slate-900 border-t border-slate-800">
            <div className="max-w-5xl mx-auto space-y-12">
              <h2 className="text-3xl font-black italic uppercase tracking-tight text-white text-center">
                Explore Other Retail Hubs in {decodedState}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {sisterCities.map((sister) => (
                  <Link
                    key={sister.city}
                    to={`/solutions/${sister.country}/${sister.state}/${sister.city}`}
                    className="bg-slate-800 hover:bg-emerald-500 text-slate-300 hover:text-slate-900 border border-slate-700 hover:border-emerald-400 px-6 py-3 rounded-full font-bold uppercase text-sm tracking-wider transition-all"
                  >
                    {sister.display_name}
                  </Link>
                ))}
              </div>
              <div className="text-center pt-8">
                <Link
                  to={`/solutions/${country}/${state}`}
                  className="text-emerald-400 font-bold hover:text-emerald-300 underline underline-offset-4 uppercase tracking-widest text-xs"
                >
                  View All Cities in {decodedState} &rarr;
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Entity Credibility Footer */}
        <footer className="bg-slate-950 py-12 px-6 border-t border-slate-900">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <p className="text-slate-400 font-medium italic">
              DukaanMitra by{" "}
              <a
                href="https://www.linkedin.com/in/amitsharma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                Amit Sharma
              </a>{" "}
              — Revolutionizing {localIndustry} Retail in {decodedCity},{" "}
              {decodedState}.
            </p>
          </div>
        </footer>
      </div>
    </HybridMovieWrapper>
  );
};
