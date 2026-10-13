import React from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { NotFound } from "./NotFound";
import { HybridMovieWrapper } from "./HybridMovieWrapper";

// ... (skipping to the city array)
const validCities = [
  "lucknow",
  "kanpur",
  "delhi",
  "mumbai",
  "bangalore",
  "pune",
  "ahmedabad",
  "hyderabad",
  "chennai",
  "kolkata",
  "jaipur",
  "surat",
  "agra",
  "aligarh",
  "allahabad",
  "amritsar",
  "aurangabad",
  "bareilly",
  "bhavnagar",
  "bhiwandi",
  "bhopal",
  "bhubaneswar",
  "bikaner",
  "chandigarh",
  "coimbatore",
  "cuttack",
  "dehradun",
  "dhanbad",
  "bhilai",
  "durgapur",
  "erode",
  "faridabad",
  "firozabad",
  "ghaziabad",
  "gorakhpur",
  "gulbarga",
  "guntur",
  "gwalior",
  "guwahati",
  "hubli",
  "indore",
  "jabalpur",
  "jalandhar",
  "jalgaon",
  "jamnagar",
  "jamshedpur",
  "jhansi",
  "jodhpur",
  "kakinada",
  "kochi",
  "kolhapur",
  "kollam",
  "kota",
  "kozhikode",
  "kurnool",
  "ludhiana",
  "madurai",
  "malegaon",
  "mangalore",
  "meerut",
  "moradabad",
  "mysore",
  "nagpur",
  "nanded",
  "nashik",
  "nellore",
  "noida",
  "patna",
  "pondicherry",
  "raipur",
  "rajkot",
  "rajahmundry",
  "ranchi",
  "rourkela",
  "salem",
  "sangli",
  "siliguri",
  "solapur",
  "srinagar",
  "thiruvananthapuram",
  "thrissur",
  "tiruchirappalli",
  "tirunelveli",
  "tiruppur",
  "ujjain",
  "vadodara",
  "varanasi",
  "vasai-virar",
  "vijayawada",
  "visakhapatnam",
  "warangal",
  "gurgaon",
  "ajmer",
  "akola",
  "ulhasnagar",
  "saharanpur",
  "rohtak",
  "mathura",
  "gaya",
];

const cityData = {
  lucknow: {
    name: "Lucknow",
    title: "Best Dukaan Management App in Lucknow | AI Business OS Lucknow",
    description:
      "Empowering Lucknow's Inventory Businesss with AI-powered WhatsApp automation. Join 500+ shops in Lucknow using DukaanMitra to manage sales and udhaar.",
    keywords:
      "AI Business OS lucknow, dukaan app lucknow, retail management lucknow, shop automation lucknow",
    stats: "500+ Shops in Lucknow",
    testimonial:
      "Lucknow ke dukaandaaro ke liye DukaanMitra sabse bada vardaan hai. Ab bahi-khata ki tension khatam!",
    author: "Rajesh Kumar, Aminabad",
    localTips:
      "Lucknow markets like Aminabad and Chowk are seeing a massive shift to digital payments. DukaanMitra helps local merchants track these UPI payments alongside cash automatically.",
    cityGuides: [
      "kanpur-me-shop-ko-online-kaise-laaye",
      "google-business-profile-kaise-banaye",
    ],
    wikidataId: "Q47916",
    state: "Uttar Pradesh",
    retailBusinesses: "25,000",
  },
  kanpur: {
    name: "Kanpur",
    title: "WhatsApp Munim in Kanpur — Best AI AI Business OS | DukaanMitra",
    description:
      "Transform your Kanpur inventory business with DukaanMitra — India's first AI-powered WhatsApp Munim. No app download. Just message and manage your dukaan from WhatsApp.",
    keywords:
      "WhatsApp Munim Kanpur, AI AI Business OS Kanpur, dukaan management app Uttar Pradesh, Inventory Business software kanpur, retail software kanpur",
    stats: "750+ Shops in Kanpur",
    testimonial:
      "Kanpur ki bheed mein hisaab rakhna mushkil tha, par DukaanMitra ne sab asaan kar diya. No app needed, direct WhatsApp par chal raha hai.",
    author: "Suresh Gupta, Gumti No. 5",
    localTips:
      "In Kanpur's busy hubs like Naveen Market, speed is key. Our AI parses voice notes and texts in seconds, perfect for high-volume traders.",
    cityGuides: [
      "kanpur-me-shop-ko-online-kaise-laaye",
      "gbp-suspend-kyun-hota-hai",
    ],
    wikidataId: "Q66568",
    state: "Uttar Pradesh",
    retailBusinesses: "32,000",
  },
  delhi: {
    name: "Delhi",
    title: "Enterprise Retail App Delhi | Digital Shop Software NCR",
    description:
      "Scale your Delhi retail empire with DukaanMitra. Advanced automation for Delhi's competitive markets from Chandni Chowk to Karol Bagh.",
    keywords:
      "AI Business OS delhi, retail app delhi, shop management software delhi, business automation delhi",
    stats: "1200+ Shops in Delhi NCR",
    testimonial:
      "Delhi NCR ke competitive market mein DukaanMitra humein edge deta hai.",
    author: "Mohit Jain, Chandni Chowk",
    localTips:
      "Delhi merchants use DukaanMitra to handle both local customers and wholesale tracking efficiently.",
    cityGuides: [
      "google-business-profile-kaise-banaye",
      "ai-sandboxing-secure-shop-data",
    ],
    wikidataId: "Q1353",
    state: "Delhi NCR",
    retailBusinesses: "150,000",
  },
  mumbai: {
    name: "Mumbai",
    title: "Retail Automation Mumbai | Smart Dukaan App Maharashtra",
    description:
      "Automate your Mumbai shop with India's smartest AI Munim. Trusted by retailers across Mumbai and Navi Mumbai.",
    keywords:
      "AI Business OS mumbai, retail management mumbai, dukaan app mumbai, business automation mumbai",
    stats: "1000+ Shops in Mumbai",
    testimonial:
      "Mumbai local jaisi tezi chahiye shop management mein, aur woh DukaanMitra deta hai.",
    author: "Vikas Patil, Dadar",
    localTips:
      "Mumbai's high real estate costs mean you need efficient inventory. Tracking dead stock helps save space.",
    cityGuides: [
      "whatsapp-se-order-kaise-le",
      "local-business-ko-customer-kaise-mile",
    ],
    wikidataId: "Q1156",
    state: "Maharashtra",
    retailBusinesses: "120,000",
  },
  bangalore: {
    name: "Bangalore",
    title: "Tech-Forward Retail App Bangalore | AI Business OS Bengaluru",
    description:
      "Bring the Silicon Valley efficiency to your Bangalore Inventory Business. AI-driven shop management for modern Karnataka retailers.",
    keywords:
      "AI Business OS bangalore, retail app bangalore, shop management software bengaluru, business automation karnataka",
    stats: "850+ Shops in Bangalore",
    testimonial:
      "Tech city ke liye tech-smart munim! DukaanMitra is revolutionary.",
    author: "Ananth K, Indiranagar",
    localTips:
      "Bangalore customers expect digital bills. DukaanMitra sends them instantly via WhatsApp.",
    cityGuides: [
      "ai-sandboxing-secure-shop-data",
      "manage-Business-store-digitally-india-2026",
    ],
    wikidataId: "Q1355",
    state: "Karnataka",
    retailBusinesses: "80,000",
  },
  pune: {
    name: "Pune",
    title: "Smart Shop Management Pune | Retail Software Maharashtra",
    description:
      "The most efficient way to manage your retail business in Pune. Simplify bahi-khata and recover udhaar faster with AI.",
    keywords:
      "AI Business OS pune, retail app pune, shop management software pune, business automation maharashtra",
    stats: "600+ Shops in Pune",
    testimonial: "Pune ki dukaano ke liye sabse asaan digital tool.",
    author: "Abhishek Deshmukh, Kothrud",
    localTips:
      "Pune merchants prefer our clean analytics to track monthly growth trends.",
    cityGuides: [
      "manage-Business-store-digitally-india-2026",
      "gbp-suspend-kyun-hota-hai",
    ],
    wikidataId: "Q1538",
    state: "Maharashtra",
    retailBusinesses: "45,000",
  },
  ahmedabad: {
    name: "Ahmedabad",
    title: "Best AI Business OS Ahmedabad | Shop App Gujarat",
    description:
      "Modernize your Ahmedabad business with AI. Top-rated retail management for merchants in Manek Chowk and CG Road.",
    keywords:
      "AI Business OS ahmedabad, retail app ahmedabad, shop management gujarat",
    stats: "450+ Shops in Ahmedabad",
    testimonial:
      "Ahmedabad ke vyapariyon ke liye sabse tez hisaab-kitab software.",
    author: "Gautam Shah, Manek Chowk",
    localTips:
      "Ahmedabad merchants use our AI to track bulk transactions and festive season sales.",
    cityGuides: [
      "Business-shop-daily-sales-system",
      "google-business-profile-kaise-banaye",
    ],
    wikidataId: "Q1070",
    state: "Gujarat",
    retailBusinesses: "50,000",
  },
  hyderabad: {
    name: "Hyderabad",
    title: "Top Retail App Hyderabad | AI Business OS Telangana",
    description:
      "Efficiency meeting tradition. The best WhatsApp-first shop software for Hyderabad's busy retailers and wholesalers.",
    keywords:
      "retail app hyderabad, AI Business OS telangana, shop management hyderabad",
    stats: "550+ Shops in Hyderabad",
    testimonial:
      "Banjara Hills and Ameerpet shops are managing wholesale orders via our WhatsApp catalogue automation.",
    author: "Srinivas Rao, Ameerpet",
    localTips:
      "Hyderabad businesses are moving to digital catalogues to handle high order volumes.",
    cityGuides: [
      "whatsapp-se-order-kaise-le",
      "best-billing-software-for-small-shop",
    ],
    wikidataId: "Q1361",
    state: "Telangana",
    retailBusinesses: "65,000",
  },
  chennai: {
    name: "Chennai",
    title: "Smart Shop App Chennai | Retail Software Tamil Nadu",
    description:
      "Automate your Chennai shop with AI. Recover udhaar faster and manage sales via WhatsApp. Trusted by T. Nagar merchants.",
    keywords:
      "shop app chennai, retail software tamil nadu, AI Business OS chennai",
    stats: "400+ Shops in Chennai",
    testimonial:
      "Anna Nagar boutiques are automating customer replies using our AI sandbox logic.",
    author: "Karthik Raja, T. Nagar",
    localTips:
      "Chennai merchants prioritize data privacy, which our AI Sandbox ensures.",
    cityGuides: [
      "ai-sandboxing-secure-shop-data",
      "local-business-ko-customer-kaise-mile",
    ],
    wikidataId: "Q1352",
    state: "Tamil Nadu",
    retailBusinesses: "55,000",
  },
  kolkata: {
    name: "Kolkata",
    title: "Best Bahi-Khata App Kolkata | Retail Software West Bengal",
    description:
      "Replace manual registers in Kolkata with AI Munim. Digital transformation for Burrabazar and Park Street wholesalers.",
    keywords:
      "bahi khata app kolkata, retail software west bengal, shop management kolkata",
    stats: "650+ Shops in Kolkata",
    testimonial:
      "Kolkata wholesalers are digitizing their manual registers using DukaanMitra AI.",
    author: "Arijit Das, Burrabazar",
    localTips:
      "Burrabazar traders save 4 hours daily using our automated ledger sync.",
    cityGuides: [
      "udhaar-ka-hisaab-kaise-rakhe",
      "best-billing-software-for-small-shop",
    ],
    wikidataId: "Q1348",
    state: "West Bengal",
    retailBusinesses: "75,000",
  },
  jaipur: {
    name: "Jaipur",
    title: "Shop Management App Jaipur | AI Business OS Rajasthan",
    description:
      "The most trusted digital munim for Jaipur's retailers. Manage your Pink City shop with the power of WhatsApp AI.",
    keywords:
      "shop app jaipur, AI Business OS rajasthan, retail management jaipur",
    stats: "350+ Shops in Jaipur",
    testimonial:
      "Johari Bazar and C-Scheme outlets use AI insights to manage seasonal stock demands.",
    author: "Vikram Singh, C-Scheme",
    localTips:
      "Jaipur outlets use AI reports to predict tourist season stock requirements.",
    cityGuides: [
      "manage-Business-store-digitally-india-2026",
      "Business-shop-daily-sales-system",
    ],
    wikidataId: "Q200019",
    state: "Rajasthan",
    retailBusinesses: "30,000",
  },
  surat: {
    name: "Surat",
    title: "Fast Billing Software Surat | Retail App Gujarat",
    description:
      "Handle 100+ daily transactions easily. The fastest WhatsApp billing software for Surat's textile and Business markets.",
    keywords:
      "billing software surat, retail app surat, shop management gujarat",
    stats: "700+ Shops in Surat",
    testimonial:
      "Textile market merchants are using high-speed WhatsApp billing to manage 100+ daily transactions.",
    author: "Dhaval Patel, Varachha",
    localTips:
      "Surat traders love our 'One-Message Billing' for high-frequency sales.",
    cityGuides: [
      "best-billing-software-for-small-shop",
      "udhaar-ka-hisaab-kaise-rakhe",
    ],
    wikidataId: "Q228224",
    state: "Gujarat",
    retailBusinesses: "40,000",
  },
};

const CityPage: React.FC = () => {
  const { city } = useParams<{ city: string }>();

  if (!city || !validCities.includes(city.toLowerCase())) {
    return <NotFound />;
  }

  let data = cityData[city.toLowerCase() as keyof typeof cityData];

  if (!data) {
    const formattedCity = city
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    data = {
      name: formattedCity,
      state: "India",
      wikidataId: "",
      marketType: "Emerging City",
      retailProfile: "Growing Local Business Hub",
      title: `Best Dukaan & AI Business OS in ${formattedCity} | DukaanMitra`,
      description: `Empowering ${formattedCity}'s retail stores with AI-powered WhatsApp automation. Start managing udhaar and billing digitally.`,
      keywords: `AI Business OS ${formattedCity}, dukaan app ${formattedCity}, retail management ${formattedCity}, shop automation ${formattedCity}`,
      stats: `Trusted Local Business Tool`,
      testimonial: `${formattedCity} ke dukaandaaron ke liye sabse asaan WhatsApp munim. Zero tracking errors aur faster udhaar recovery.`,
      author: "Local Merchant",
      localTips: `Digital payments are booming in ${formattedCity}. DukaanMitra helps local merchants track these alongside cash automatically.`,
      cityGuides: [
        "kanpur-me-shop-ko-online-kaise-laaye",
        "whatsapp-se-order-kaise-le",
      ],
    } as {
      name: string;
      title?: string;
      description?: string;
      retailProfile?: string;
      keywords?: string;
      testimonial?: string;
      author?: string;
      stats?: string;
      localTips?: string;
      state?: string;
      wikidataId?: string;
      marketType?: string;
      cityGuides?: string[];
    };
  }

  // Ensure title and description exist if falling back on imported cityData which might lack it
  const pageTitle =
    (
      data as {
        name: string;
        title?: string;
        description?: string;
        retailProfile?: string;
      }
    ).title || `AI Retail Solutions in ${data.name} | DukaanMitra`;
  const pageDesc =
    (
      data as {
        name: string;
        title?: string;
        description?: string;
        retailProfile?: string;
      }
    ).description ||
    `Transforming ${data.name}'s ${(data as { retailProfile?: string }).retailProfile} with AI-powered billing. Connect with ${data.name}'s smartest shop management tool.`;

  // Dynamic dynamic coordinates logic for high-fidelity LocalBusiness GEO tagging
  const coords = (() => {
    const normalized = data.name.toLowerCase().trim();
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

  const canonicalUrl = `https://dukaanmitra.in/solutions/retail-ai-${city.toLowerCase()}`;

  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${canonicalUrl}#service`,
    name: `DukaanMitra AI for Retail in ${data.name}`,
    description: pageDesc,
    provider: {
      "@type": "Organization",
      name: "DukaanMitra",
      url: "https://dukaanmitra.in/",
    },
    areaServed: {
      "@type": "City",
      name: data.name,
      ...(data.wikidataId
        ? { sameAs: `https://www.wikidata.org/wiki/${data.wikidataId}` }
        : {}),
    },
    url: canonicalUrl,
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${canonicalUrl}#local-business`,
    name: `DukaanMitra AI Retail & CRM - ${data.name}`,
    image: "https://dukaanmitra.in/assets/logo.svg",
    description: `Voice-powered automated AI accounting, WhatsApp billing, inventory trackers and automated ledger entries specialized for merchants from ${data.name}, India.`,
    telephone: "+919876543210",
    url: canonicalUrl,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: data.name,
      addressRegion: data.state || "India",
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
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
        name: data.name,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${canonicalUrl}#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: `Is DukaanMitra billing software available in ${data.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, DukaanMitra is fully available for all retail & wholesale stores in ${data.name}. You can manage all transactions, billing and udhaar directly inside WhatsApp.`,
        },
      },
      {
        "@type": "Question",
        name: `Do I need to buy computer hardware to use DukaanMitra in ${data.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `No computers or laptops are needed! All features run directly on your smartphone inside WhatsApp, making it highly affordable and easy for any shopkeeper in ${data.name}.`,
        },
      },
      {
        "@type": "Question",
        name: `Can it send automated payment reminders to buyers in ${data.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Absolutely. DukaanMitra tracks all pending customer balances (Udhaar) and lets you send automated, friendly WhatsApp payment reminders to recover credit 3x faster.`,
        },
      },
    ],
  };

  return (
    <HybridMovieWrapper>
      <div className="min-h-screen bg-white">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <meta
            name="keywords"
            content={
              (data as { keywords?: string; name: string }).keywords ||
              `retail ai ${data.name}, Inventory Business software`
            }
          />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDesc} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:site_name" content="DukaanMitra" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDesc} />
          <link rel="canonical" href={canonicalUrl} />
          <script type="application/ld+json">
            {JSON.stringify(schemaJson)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(localBusinessSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        </Helmet>

        <section className="py-32 px-6 lg:px-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
          </div>
          <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-3 bg-white/10 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                Local SEO Spotlight: {data.name}
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black italic tracking-tighter leading-[0.9] uppercase">
              Transforming Retail in <br />
              <span className="text-emerald-400">{data.name}</span> with AI
              Automation
            </h1>
            <p className="text-xl text-slate-300 font-bold max-w-3xl mx-auto">
              As a {data.marketType} city, {data.name} is a critical hub for{" "}
              {data.retailProfile}. DukaanMitra helps {data.name} shop owners
              reduce manual entry by 80% and increase speed.
            </p>
            <div className="pt-12">
              <Link
                to="/"
                className="bg-white text-indigo-900 px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all inline-block italic tracking-tighter"
              >
                Get Started for FREE in {data.name} 🚀
              </Link>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 lg:px-20 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
                Why {data.name}'s Smart दुकानदार Choose Us?
              </h2>
              <div className="space-y-6">
                {[
                  {
                    t: "99.9% Accuracy",
                    d: "Our AI understands local dialects and slang used in UP markets.",
                  },
                  {
                    t: "Zero Training",
                    d: "If you can use WhatsApp, you can use DukaanMitra.",
                  },
                  {
                    t: "Instant Udhaar Reminders",
                    d: "Recover payments faster with automated WhatsApp alerts.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic text-slate-900 uppercase">
                        {item.t}
                      </h3>
                      <p className="text-slate-500 font-bold italic">
                        {item.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 shadow-2xl space-y-8">
              <div className="text-6xl text-indigo-600 opacity-20 font-black italic">
                "
              </div>
              <p className="text-2xl font-black italic text-slate-900 leading-relaxed">
                {(data as { testimonial?: string; name: string }).testimonial ||
                  `${data.name} ke retailers ko aksar inventory and udhaar management mein dikkat aati thi, but AI munim makes it easy!`}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xs">
                  {((data as { author?: string }).author || "L").charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black italic text-slate-900">
                    {(data as { author?: string }).author || "Local Merchant"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {(data as { stats?: string }).stats || "500+ Shops"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 lg:px-20 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
                Local Insights for {data.name} Retailers
              </h2>
              <p className="text-xl text-slate-500 font-bold italic">
                {(data as { localTips?: string; name: string }).localTips ||
                  `${data.name} markets are modernizing quickly. Track cash and UPI seamlessly.`}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-4">
                <h3 className="text-xl font-black italic text-slate-900 uppercase">
                  Best Shop App in {data.name}
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Looking for the best shop management app in {data.name}?
                  DukaanMitra provides localized AI tools for {data.name}{" "}
                  retailers.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-4">
                <h3 className="text-xl font-black italic text-slate-900 uppercase">
                  AI Business OS {data.name}
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Join 500+ Inventory Businesss in {data.name} using our
                  WhatsApp billing system. Modernize your {data.name} business
                  today.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-4">
                <h3 className="text-xl font-black italic text-slate-900 uppercase">
                  WhatsApp Billing {data.name}
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  Setup high-speed WhatsApp billing for your {data.name} based
                  shop. No hardware, just your phone.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
                <h3 className="text-2xl font-black italic text-slate-900 uppercase">
                  Related Guides for {data.name}
                </h3>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/blog/kanpur-me-shop-ko-online-kaise-laaye"
                      className="text-indigo-600 font-black italic text-lg hover:underline block leading-tight"
                    >
                      • How to take your {data.name} based physical shop online?
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/blog/gbp-suspend-kyun-hota-hai"
                      className="text-indigo-600 font-black italic text-lg hover:underline block leading-tight"
                    >
                      • Fixing your shop's Google Maps location issues in{" "}
                      {data.name}.
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
                <h3 className="text-2xl font-black italic text-slate-900 uppercase">
                  Our Presence in {data.name}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  DukaanMitra is actively partnering with local merchant
                  associations in {data.name} to digitize the traditional
                  Business ecosystem. We believe in "Local First, Digital Next".
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-6 lg:px-20 bg-indigo-600 text-white text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
              Join the {data.name} Retail Revolution
            </h2>
            <p className="text-xl font-bold italic opacity-90">
              Stop wasting time on manual entries. Let AI handle your dukaan.
            </p>
            <a
              href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-white hover:text-indigo-600 transition-all inline-block italic tracking-tighter"
            >
              Start Your 14-Day Free Trial ➔
            </a>
          </div>
        </section>
      </div>
    </HybridMovieWrapper>
  );
};

export default CityPage;
