import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const REDIRECT_MAP: Record<string, string> = {
  "/solutio": "/features",
  "/solutions": "/features",
  "/solutions/in": "/features",
  "/p/auto": "/p/auto-parts-shop-free-billing",
  "/p/wha": "/p/whatsapp-catalog-maker-app",
  "/tirunel": "/solutions/retail-ai-tirunelveli",
  "/bhilai": "/solutions/retail-ai-bhilai",
  "/ujjain": "/solutions/retail-ai-ujjain",
  "/blog/u": "/blog/hinglish-ai-bookkeeping",
  "/guntur": "/solutions/retail-ai-guntur",
  "/noida": "/solutions/retail-ai-noida",
  "/rajahm": "/solutions/retail-ai-rajahmundry",
  "/compa": "/compare/vyapar",
  "/p/bhar": "/p/bharat-commerce-os",
  "/feature": "/features",
  "/p/bina": "/p/bina-internet-ke-billing-machine",
  "/p/apni": "/p/apni-dukan-ko-digital-kaise-banaye",
  "/amrits": "/solutions/retail-ai-amritsar",
  "/p/digit": "/p/digital-payment-tracker-for-shop",
  "/mathu": "/solutions/retail-ai-mathura",
  "/p/best": "/p/best-billing-software-for-mobile-shop",
  "/p/ai-m": "/p/ai-munim",
  "/pondic": "/solutions/retail-ai-pondicherry",
  "/p/elec": "/p/electronics-shop-billing-app",
  "/madur": "/solutions/retail-ai-madurai",
  "/blog/m": "/blog",
  "/aurang": "/solutions/retail-ai-aurangabad",
  "/servic": "/services",
  "/covera": "/coverage",
  "/p/reta": "/p/retail-shop-accounting-software",
  "/thiruva": "/solutions/retail-ai-thiruvananthapuram",
  "/p/bahi": "/p/bahi-khata-alternative",
  "/knowle": "/knowledge",
  "/ahmed": "/solutions/retail-ai-ahmedabad",
  "/whats": "/whatsapp-shop-management",
  "/get-m": "/get-more-google-reviews-for-shop",
  "/meerut": "/solutions/retail-ai-meerut",
  "/bhavn": "/solutions/retail-ai-bhavnagar",
  "/jamsh": "/solutions/retail-ai-jamshedpur",
  "/jaland": "/solutions/retail-ai-jalandhar",
  "/jamna": "/solutions/retail-ai-jamnagar",
  "/dhanb": "/solutions/retail-ai-dhanbad",
  "/bikane": "/solutions/retail-ai-bikaner",
  "/durga": "/solutions/retail-ai-durgapur",
  "/kozhik": "/solutions/retail-ai-kozhikode",
  "/p/mob": "/p/mobile-accessories-shop-software",
  "/rourke": "/solutions/retail-ai-rourkela",
  "/sangli": "/solutions/retail-ai-sangli",
  "/templa": "/templates",
  "/tiruppu": "/solutions/retail-ai-tiruppur",
  "/p/groc": "/p/grocery-shop-inventory-excel",
  "/firozab": "/solutions/retail-ai-firozabad",
  "/thrissu": "/solutions/retail-ai-thrissur",
  "/pune": "/solutions/retail-ai-pune",
  "/ghazia": "/solutions/retail-ai-ghaziabad",
  "/p/footw": "/p/footwear-shop-software",
  "/solapu": "/solutions/retail-ai-solapur",
  "/morad": "/solutions/retail-ai-moradabad",
  "/visakh": "/solutions/retail-ai-visakhapatnam",
  "/delhi": "/solutions/retail-ai-delhi",
  "/case-s": "/case-studies",
  "/siligur": "/solutions/retail-ai-siliguri",
  "/kota": "/solutions/retail-ai-kota",
  "/jhansi": "/solutions/retail-ai-jhansi",
  "/mysor": "/solutions/retail-ai-mysore",
  "/p/mun": "/p/munim-ai",
};

export const NotFound: React.FC = () => {
  const location = useLocation();
  const normalizedPath = location.pathname.toLowerCase().replace(/\/$/, "");

  // Check direct matches
  if (REDIRECT_MAP[normalizedPath]) {
    return <Navigate to={REDIRECT_MAP[normalizedPath]} replace />;
  }

  // Check prefix matches (e.g. if Ahrefs crawled with extra URL segments)
  for (const [prefix, target] of Object.entries(REDIRECT_MAP)) {
    if (normalizedPath.startsWith(prefix)) {
      return <Navigate to={target} replace />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <Helmet>
        <title>404 - Page Not Found | DukaanMitra</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 max-w-2xl w-full">
        <h1 className="text-8xl font-black text-indigo-600 italic tracking-tighter uppercase mb-6">
          404
        </h1>
        <h2 className="text-3xl font-black text-slate-900 italic uppercase mb-6">
          Page Not Found
        </h2>
        <p className="text-slate-500 font-bold mb-10 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="bg-slate-900 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-indigo-600 transition-colors inline-block italic uppercase tracking-widest"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};
