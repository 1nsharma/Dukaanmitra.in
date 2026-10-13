import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, ChevronRight, Zap } from "lucide-react";

interface SeoPageData {
  title: string;
  metaDesc: string;
  keywords: string;
  h1: string;
  subtitle: string;
  problemHeading: string;
  problems: string[];
  solutionHeading: string;
  solutions: string[];
  ctaText: string;
  category: "Money" | "Growth" | "Problem";
}

const seoPagesDatabase: Record<string, SeoPageData> = {
  // Pillar 1: Core Product (Money)
  "Business-store-software": {
    category: "Money",
    title: "Inventory Business Management Software | WhatsApp First App",
    metaDesc:
      "The only Inventory Business software you need runs directly on WhatsApp. No complex POS, no learning curve. Manage inventory and billing fast.",
    keywords:
      "Inventory Business management software, retail shop software india, small shop billing software",
    h1: "The Simplest Inventory Business Software is WhatsApp",
    subtitle: "Stop paying for heavy desktop POS systems. Upgrade to AI Munim.",
    problemHeading: "Traditional Software is Broken",
    problems: [
      "Requires expensive computers",
      "Hard to train new staff",
      "Constant app updates",
      "Hidden annual fees",
    ],
    solutionHeading: "Why inventory businesss Choose WhatsApp",
    solutions: [
      "Works on any smartphone instantly",
      "Zero learning curve for staff",
      "Fastest billing via simple texts",
      "Always free to start",
    ],
    ctaText: "Start Digital Business",
  },
  "bahi-khata-alternative": {
    category: "Money",
    title: "Best Bahi Khata App Alternative | DukaanMitra",
    metaDesc:
      "Throw away the red notebook. DukaanMitra is the smartest bahi khata alternative that lives entirely on WhatsApp with automatic reminders.",
    keywords:
      "bahi khata app alternative, khata book app whatsapp, udhaar ledger app india",
    h1: "Replace Your Bahi Khata with WhatsApp",
    subtitle: "Digital ledger with automated Udhaar recovery.",
    problemHeading: "The Red Notebook is Costing You Money",
    problems: [
      "Water damage and lost books",
      "Forgetting to write down udhaar",
      "Calculations take hours",
      "Awkward to ask for money back",
    ],
    solutionHeading: "The AI Bahi Khata",
    solutions: [
      "Auto-calculation of all dues",
      "Polite automated WhatsApp reminders",
      "Cloud backup every second",
      "Daily summary reports",
    ],
    ctaText: "Upgrade Bahi Khata",
  },
  "inventory-management-Business": {
    category: "Money",
    title: "Inventory Management for Inventory Business | Automated Tool",
    metaDesc:
      "Smart stock management app for Inventory Businesss. Get low-stock alerts on WhatsApp automatically.",
    keywords:
      "inventory management Inventory Business, stock management app india, grocery store inventory management",
    h1: "Business Inventory Management on Auto-Pilot",
    subtitle: "Know exactly what to order, before you run out.",
    problemHeading: "Manual Stock Counting is Slow",
    problems: [
      "Running out of best-sellers",
      "Dead stock eating cash flow",
      "No idea of actual profit",
      "Hours spent manually matching items",
    ],
    solutionHeading: "The AI Stock Manager",
    solutions: [
      "Real-time stock deduction",
      "Low-inventory WhatsApp alerts",
      "Fast-moving vs Dead item reports",
      "Data-driven purchasing",
    ],
    ctaText: "Automate Inventory",
  },
  // Pillar 2: Growth (GMB)
  "increase-google-business-rating": {
    category: "Growth",
    title: "How to Increase Google My Business Rating | Fast Strategy",
    metaDesc:
      "Increase your Local shop's Google My Business rating automatically by collecting 5-star reviews via WhatsApp after every sale.",
    keywords:
      "increase google my business rating, how to rank on google maps india, gmb optimization for small business india",
    h1: "Increase Your Google Business Rating Automatically",
    subtitle: "Rank #1 on Google Maps in your neighborhood effortlessly.",
    problemHeading: "Why Are You Losing to Local Competitors?",
    problems: [
      "Low total review count",
      "Negative reviews standing out",
      "Customers simply forget to rate",
      "Poor local SEO map ranking",
    ],
    solutionHeading: "The Automated 5-Star Engine",
    solutions: [
      "Trigger review requests via WhatsApp",
      "Increase 5-star baseline frequency",
      "Boost Google map local rankings",
      "Drive 3x more organic footfall",
    ],
    ctaText: "Grow GMB Rating",
  },
  "whatsapp-review-automation": {
    category: "Growth",
    title: "WhatsApp Review Automation for Local Shops",
    metaDesc:
      "Generate Google review links and send them automatically on WhatsApp. The best automation tool for local retail growth.",
    keywords:
      "whatsapp review automation, generate google review link, google review link generator",
    h1: "Automate Your Google Reviews via WhatsApp",
    subtitle:
      "Turn happy customers into 5-star Google promoters without asking.",
    problemHeading: "Asking for Reviews is Awkward & Manual",
    problems: [
      "Staff forgets to actually ask",
      "Customers ignore SMS links",
      "Pasting generic links looks spammy",
      "No system to track success rate",
    ],
    solutionHeading: "DukaanMitra's Silent Growth Loop",
    solutions: [
      "100% automated post-purchase sequence",
      "WhatsApp has a 98% open rate",
      "One-click frictionless path to Google Maps",
      "Track daily rating growth visually",
    ],
    ctaText: "Start Automating Reviews",
  },
  // Pillar 3: Problem / Traffic
  "apni-dukan-ko-digital-kaise-banaye": {
    category: "Growth",
    title: "Apni Dukan Ko Digital Kaise Banaye | AI For Indian Retail",
    metaDesc:
      "Apni dukan ko digital kaise banaye? AI Munim aur WhatsApp billing software ke zariye apni offline Business ya retail shop ko smart banaye.",
    keywords:
      "apni dukan ko digital kaise banaye, dukan ko online kaise kare, Business dukaan ke liye ai billing software, digital dukan app",
    h1: "Apni Dukan Ko Digital Kaise Banaye",
    subtitle:
      "Computer ya mahange software ke bina sirf WhatsApp aur AI se apni dukan ko smart banaye.",
    problemHeading: "Dukan ko Digital Banane ki Rukawatein",
    problems: [
      "Laptop/Computer lagana mehenga padta hai",
      "Naye billing app ko chalana sikhna mushkil hai",
      "Staff galti karta hai",
      "Internet disconnect ki samasya",
    ],
    solutionHeading: "Zero-Click AI Billing se Solution",
    solutions: [
      "Sirf WhatsApp pe voice note ya message bhejen",
      "AI automatically khata aur inventory update karega",
      "0% server downtime aur automatic cloud sync",
      "Graahakon ko digital parchi turant bhejein",
    ],
    ctaText: "AI Munim Start Karein",
  },
  "Business-dukaan-ke-liye-ai-billing-software": {
    category: "Money",
    title: "Business Dukaan ke liye AI Billing Software in India",
    metaDesc:
      "Business dukaan ke liye best AI billing software. Voice commands aur WhatsApp se dukaan ka hisaab-kitab rakhein. Try Munim AI.",
    keywords:
      "Business dukaan ke liye ai billing software, best billing software for Inventory Business india, whatsapp munim, hindi bahi khata app",
    h1: "Business Dukaan Ke Liye Number #1 AI Billing Software",
    subtitle:
      "Ab ginti mein koi galti nahi. Bolte jayen, aur bill bante jayenge.",
    problemHeading: "Bheed Bhaad mein Bill Banane ki Tension",
    problems: [
      "Customer lamba bill dekh kar wait karta hai",
      "Ek ek rate yaad rakhna possible nahi",
      "Udhaar book mein note karna bhool jate hain",
      "Dimag thak jata hai",
    ],
    solutionHeading: "AI Voice Billing ki Takat",
    solutions: [
      "WhatsApp voice message: 'Ramesh ko 2 kilo chini 80 wali udhaar'",
      "AI samajhta hai Hindi aur Hinglish automatically",
      "Ledger updated in 1 second",
      "No typing required at all",
    ],
    ctaText: "Get AI Billing",
  },
  "dukaan-online-kaise-laye": {
    category: "Problem",
    title: "Dukaan Online Kaise Laye? | Bina Website Beche",
    metaDesc:
      "Apni dukaan online kaise laye bina kisi app ya website ke? DukaanMitra se WhatsApp ke zariye online business shuru karein 2 minute mein.",
    keywords:
      "dukaan online kaise laye, whatsapp se dukaan kaise chalaye, bina app ke dukaan manage kaise kare",
    h1: "Dukaan Online Kaise Laye? (Bina Kisi App Ke)",
    subtitle:
      "Website banana mehenga hai. WhatsApp par business shuru karna bilkul free aur aasan hai.",
    problemHeading: "Online Jaane Ke Puraane aur Mehenge Tarike",
    problems: [
      "₹20,000+ custom website development",
      "Grahak app download nahi karte hain",
      "Swiggy/Zomato jaise >30% commission",
      "Technical knowledge ki zaroorat",
    ],
    solutionHeading: "WhatsApp Hi Aapki Nayi Dukaan Hai",
    solutions: [
      "WhatsApp par digital ordering link",
      "Direct chat par order sheet",
      "Zero commission on localized sales",
      "Sirf 2 minute mein set-up live",
    ],
    ctaText: "Dukaan Online Layein",
  },
  "whatsapp-se-saman-kaise-beche": {
    category: "Problem",
    title: "WhatsApp Se Saman Kaise Beche? | Business Guide",
    metaDesc:
      "Aasan tariko se jane whatsapp se saman kaise beche. Local customers se seedhe order receive karein aur sales badhayein.",
    keywords:
      "whatsapp se saman kaise beche, how to sell on whatsapp business, whatsapp order management system",
    h1: "WhatsApp Se Seedhe Saman Kaise Beche",
    subtitle:
      "Jab poora Bharat WhatsApp chalata hai, toh order lene ke liye kisi alag app ki kyun zaroorat?",
    problemHeading: "Phone Calls Par Order Lene Ke Nuksaan",
    problems: [
      "Line busy aana aur grahak laut jana",
      "Items list slip me bhool jana",
      "Rate aur inventory ko lekar confusion",
      "Dukaandar ke samay ki barbaadi",
    ],
    solutionHeading: "Smart WhatsApp Store Layout",
    solutions: [
      "Automated readable order list",
      "Instant digital bill PDF sharing",
      "UPI link generated for payment",
      "No missed orders, complete clarity",
    ],
    ctaText: "WhatsApp Store Start Karein",
  },
  "Business-store-ko-grow-kaise-kare": {
    category: "Problem",
    title: "Inventory Business Ko Grow Kaise Kare | AI Strategy",
    metaDesc:
      "Janiye apna Inventory Business ko grow kaise kare. Modern AI tools aur WhatsApp marketing se sales aur footfall dono badhayein.",
    keywords:
      "Inventory Business ko grow kaise kare, how to increase shop sales, local business promotion ideas india",
    h1: "Apne Inventory Business Ko Agle Level Par Kaise Le Jayein",
    subtitle:
      "Dukaan wahi, Graahak Naye. AI ki madad se badhayein apna business practically.",
    problemHeading: "Sales Badhane Me Aane Wali Pareshaniya",
    problems: [
      "Bade corporate supermarts se competition",
      "Naye grahak nahi judna",
      "Purane grahak Dmart shift hona",
      "Koi targeted marketing system na hona",
    ],
    solutionHeading: "DukaanMitra Ka Business Growth System",
    solutions: [
      "Google reviews se top neighborhood ranking",
      "WhatsApp par automated aakarshak offers bhejna",
      "Udhaar time par wapas lakar cash-flow badhana",
      "Data-based inventory decisions lena",
    ],
    ctaText: "Grow Your Inventory Business",
  },
  "whatsapp-commerce": {
    category: "Money",
    title: "WhatsApp Commerce for Inventory Businesss | DukaanMitra",
    metaDesc:
      "Turn your WhatsApp into a complete commerce platform. Take orders, send bills, and manage inventory automatically.",
    keywords:
      "whatsapp commerce, whatsapp business automation, whatsapp erp, whatsapp crm",
    h1: "WhatsApp First Commerce Platform",
    subtitle: "Your customers are on WhatsApp. Your business should be too.",
    problemHeading: "Building Apps is a Waste of Time",
    problems: [
      "Customers won't download your custom app",
      "E-commerce websites are hard to maintain",
      "High commissions on delivery apps",
      "Losing touch with local loyal customers",
    ],
    solutionHeading: "Sell Where They Already Chat",
    solutions: [
      "Share digital catalog directly in chat",
      "Automated AI order taking",
      "Instant UPI payment links",
      "Frictionless buying experience",
    ],
    ctaText: "Start WhatsApp Commerce",
  },
  "ai-munim": {
    category: "Money",
    title: "AI Munim - Your Automated Digital Accountant",
    metaDesc:
      "Meet your AI Munim. Automate your bahi khata, send udhaar reminders, and track every rupee without lifting a finger.",
    keywords:
      "ai munim, digital munim, ai accounting assistant, ai ledger management",
    h1: "Meet Your New AI Munim",
    subtitle: "The smartest digital accountant for Bharat's retailers.",
    problemHeading: "Accounting is Boring and Error-Prone",
    problems: [
      "Forgetting to note down daily expenses",
      "Calculation mistakes in the ledger",
      "Spending hours balancing books",
      "Not knowing real daily profit",
    ],
    solutionHeading: "Zero-Effort Accounting",
    solutions: [
      "Voice-activated expense tracking",
      "Real-time P&L calculations",
      "Automated ledger balancing",
      "Smart daily and weekly reports",
    ],
    ctaText: "Hire AI Munim",
  },
  "bharat-commerce-os": {
    category: "Growth",
    title: "Bharat Commerce OS | AI Platform for India",
    metaDesc:
      "The ultimate Bharat Commerce OS. Operating system designed specifically for Indian MSMEs, Businesses, and local retail.",
    keywords:
      "bharat commerce os, bharat retail os, Business tech, india retail tech",
    h1: "The Operating System for Bharat",
    subtitle: "Built specifically for the unique needs of Indian local retail.",
    problemHeading: "Western Software Doesn't Understand India",
    problems: [
      "English-only complex interfaces",
      "No support for Udhaar/Khata",
      "Requires high-speed broadband",
      "Pricing out of reach for MSMEs",
    ],
    solutionHeading: "Designed for the Indian Merchant",
    solutions: [
      "Hinglish and voice command support",
      "Native Udhaar management system",
      "Works on basic 4G smartphones",
      "Priced perfectly for small businesses",
    ],
    ctaText: "Get Bharat OS",
  },
};

import { NotFound } from "./NotFound";

// Extract the valid slugs from the database to restrict rendering of fake paths
const validSlugs = Object.keys(seoPagesDatabase);

// Additional generated slugs from the sitemap list that don't have explicit DB entries yet,
// to ensure we don't 404 on them while they use the fallback generator.
const sitemapSlugs = [
  "Business-store-software",
  "bahi-khata-alternative",
  "inventory-management-Business",
  "increase-google-business-rating",
  "whatsapp-review-automation",
  "dukaan-online-kaise-laye",
  "whatsapp-se-saman-kaise-beche",
  "Business-store-ko-grow-kaise-kare",
  "best-billing-software-for-mobile-shop",
  "garment-shop-software-free",
  "hardware-shop-billing-app",
  "medical-store-software-india",
  "supermarket-billing-software-free-download",
  "jewellery-shop-management-software",
  "sweet-shop-billing-software",
  "footwear-shop-software",
  "electronics-shop-billing-app",
  "Business-khata-app-for-pc",
  "bina-internet-ke-billing-machine",
  "whatsapp-par-customer-ko-bill-kaise-bheje",
  "auto-parts-shop-free-billing",
  "grocery-shop-inventory-excel",
  "retail-shop-accounting-software",
  "free-gst-billing-software",
  "mobile-accessories-shop-software",
  "Business-shop-profit-calculator",
  "whatsapp-catalog-maker-app",
  "digital-payment-tracker-for-shop",
  "dukaanmitra",
  "mitraos",
  "munim-ai",
  "ai-retail-os",
  "whatsapp-commerce",
  "ai-munim",
  "Business-automation",
  "digital-udhaar",
  "retail-intelligence",
  "bharat-commerce-os",
];

export const ProgrammaticSeoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const isDynamicKeyword =
    (slug?.toLowerCase()?.startsWith("dukaanmitra-ai") ||
      slug?.toLowerCase()?.startsWith("dukaanmitra-smart")) ??
    false;

  if (
    !slug ||
    (!validSlugs.includes(slug.toLowerCase()) &&
      !sitemapSlugs.includes(slug.toLowerCase()) &&
      !isDynamicKeyword)
  ) {
    return <NotFound />;
  }

  let data = seoPagesDatabase[slug.toLowerCase()];

  if (!data && slug) {
    const formattedTitle = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    data = {
      category: "Growth",
      title: `${formattedTitle} | DukaanMitra OS Solutions`,
      metaDesc: `Discover the best automated solutions for ${formattedTitle} using DukaanMitra's  WhatsApp-first AI engine. Apni dukan ko digital kaise banaye, sikhiye.`,
      keywords: `${slug.replace(/-/g, " ")}, small business tools india, retail shop software, ai billing software, apne business ko grow karein`,
      h1: formattedTitle,
      subtitle:
        "Transform your dukaan business practically with AI automation.",
      problemHeading: "The Traditional Hassle (Purane Tarike ki Pareshani)",
      problems: [
        "Manual tracking takes up to 3 hours daily",
        "Hisaab-kitab mein errors (Calculation Mistakes)",
        "Udhaar recovery mein delay (Awkward to ask for pending money)",
        "Competitive disadvantage against modern corporate marts",
      ],
      solutionHeading: "The AI-Powered Path (Aapka Naya Digital Munim)",
      solutions: [
        "100% automated WhatsApp workflows",
        "Zero staff training required - Sirf WhatsApp par type karein",
        "Data-driven business decisions using AI",
        "Increase overall margins and recover cash faster",
      ],
      ctaText: "Start AI Billing Now",
    };
  }

  if (!data) {
    return <Navigate to="/blog" replace />; // Fallback if slug not found
  }

  const badgeColor =
    data.category === "Money"
      ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
      : data.category === "Growth"
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        : "bg-amber-500/20 text-amber-400 border-amber-500/30";

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.metaDesc} />
        <meta name="keywords" content={data.keywords} />
        <meta property="og:title" content={data.title} />
        <meta property="og:description" content={data.metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://dukaanmitra.in/p/${slug}`} />
        <meta property="og:site_name" content="DukaanMitra" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={data.title} />
        <meta name="twitter:description" content={data.metaDesc} />
        <link rel="canonical" href={`https://dukaanmitra.in/p/${slug}`} />
      </Helmet>

      {/* Primary Hero */}
      <section className="bg-slate-900 text-white py-24 lg:py-32 px-6 lg:px-20 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[100px] transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] bg-emerald-500/10 rounded-full blur-[100px] transform translate-y-1/4 translate-x-1/4 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div
            className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${badgeColor}`}
          >
            {data.category} Solution
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-lg">
            {data.h1}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-bold max-w-2xl mx-auto opacity-90">
            {data.subtitle}
          </p>
          <div className="pt-8">
            <a
              href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black tracking-widest uppercase hover:bg-slate-100 transition-all shadow-xl hover:scale-105"
            >
              <Zap size={20} className="text-amber-500" />
              <span>{data.ctaText}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Problem Framework */}
      <section className="py-24 px-6 lg:px-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
              {data.problemHeading}
            </h2>
            <div className="space-y-4">
              {data.problems.map((problem, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <div className="w-10 h-10 shrink-0 bg-red-100 text-red-500 rounded-full flex items-center justify-center font-black">
                    ❌
                  </div>
                  <p className="font-bold text-slate-600 text-lg">{problem}</p>
                </div>
              ))}
            </div>
            <p className="text-xl font-black italic text-red-500 uppercase tracking-wide pt-4">
              You are losing money and time.
            </p>
          </div>
          <div className="relative h-full min-h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-white rounded-[3rem] shadow-inner border border-slate-200 transform rotate-3"></div>
            <div className="relative z-10 text-center space-y-6">
              <div className="text-8xl">🤦</div>
              <h3 className="text-2xl font-black text-slate-400 italic uppercase">
                The Old Way
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Framework */}
      <section className="py-24 px-6 lg:px-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center flex-col-reverse md:flex-row">
          <div className="relative h-full min-h-[400px] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-emerald-50 rounded-[3rem] shadow-xl border border-indigo-50 transform -rotate-3"></div>
            <div className="relative z-10 text-center space-y-6">
              <div className="text-8xl animate-bounce">📱</div>
              <h3 className="text-2xl font-black text-indigo-600 italic uppercase">
                The Munim Way
              </h3>
            </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
              {data.solutionHeading}
            </h2>
            <div className="space-y-4">
              {data.solutions.map((solution, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl border-l-[6px] border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
                >
                  <CheckCircle2
                    className="text-emerald-500 shrink-0"
                    size={28}
                  />
                  <p className="font-black italic text-slate-800 text-lg tracking-tight">
                    {solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Traffic & ROI Projection */}
      <section className="py-24 px-6 lg:px-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
              The Math Behind The Growth
            </h2>
            <p className="text-xl font-bold text-slate-500">
              See what happens when you publish consistently at scale.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="text-4xl font-black text-indigo-600">156</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Blogs / Year
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="text-4xl font-black text-amber-500">50</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Visits Daily / Blog
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="text-4xl font-black text-emerald-500">2.8M</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                Annual Traffic
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                (156 * 50 * 365)
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 text-center space-y-4 transform hover:-translate-y-2 transition-transform">
              <div className="text-4xl font-black text-emerald-600">28,000</div>
              <div className="text-sm font-bold text-slate-700 uppercase tracking-widest">
                New Customers
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                (at 1% conversion)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Action */}
      <section className="py-24 px-6 bg-slate-900 border-t-8 border-indigo-500 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-8 relative z-10 text-white">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
            Join Thousands of Smart Shopkeepers
          </h2>
          <p className="text-xl font-bold text-slate-400 pb-8">
            DukaanMitra lets you operate natively via WhatsApp. Free to start,
            entirely AI powered.
          </p>
          <a
            href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex mt-8 items-center gap-3 px-12 py-6 bg-emerald-500 text-slate-900 rounded-[2rem] font-black text-xl tracking-widest uppercase hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105"
          >
            <span>Send "START" Now</span>
            <ChevronRight size={24} />
          </a>
        </div>
      </section>
    </div>
  );
};
