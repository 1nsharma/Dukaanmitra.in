import React, { useEffect, useRef } from "react";
import { RazorpayCheckoutButton } from "./RazorpayCheckoutButton";
import { Link, useNavigate } from "react-router-dom";
import anime from "animejs";
import { Helmet } from "react-helmet-async";
import { WhatsAppSimulation } from "./WhatsAppSimulation";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";
import { HybridMovieWrapper } from "./HybridMovieWrapper";

const LandingPage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tl = (anime as any).timeline({
      easing: "easeOutExpo",
      duration: 1200,
    });

    tl.add({
      targets: ".hero-text",
      translateY: [50, 0],
      opacity: [0, 1],
      delay: anime.stagger(150),
    }).add(
      {
        targets: mockupRef.current,
        scale: [0.9, 1],
        rotate: [5, 2],
        opacity: [0, 1],
        duration: 1500,
      },
      "-=800",
    );
  }, []);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "DukaanMitra AI OS",
    description:
      "India's AI WhatsApp Business Operating System for Retail Businesses",
    url: "https://dukaanmitra.in",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://dukaanmitra.in/logo.svg",
    },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DukaanMitra",
    image: "https://dukaanmitra.in/logo.svg",
    "@id": "https://dukaanmitra.in/#localbusiness",
    url: "https://dukaanmitra.in",
    priceRange: "₹",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  };

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "DukaanMitra AI Demo",
    description:
      "Watch how DukaanMitra automates billing and udhaar recovery via WhatsApp.",
    thumbnailUrl: "https://dukaanmitra.in/logo.svg",
    uploadDate: "2024-01-01T08:00:00+08:00",
    contentUrl: "https://www.youtube.com/watch?v=AgjXUeejXDk",
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://dukaanmitra.in/#organization",
    name: "DukaanMitra",
    url: "https://dukaanmitra.in",
    logo: "https://dukaanmitra.in/logo.svg",
    description: "The AI Commerce Operating System for Indian Retail.",
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://dukaanmitra.in/#website",
    url: "https://dukaanmitra.in/",
    name: "DukaanMitra",
    description: "AI Commerce Operating System for Indian Retail",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://dukaanmitra.in/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://dukaanmitra.in/",
      },
    ],
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://dukaanmitra.in/#software",
    name: "DukaanMitra",
    operatingSystem: "Any",
    applicationCategory: "BusinessApplication",
    description:
      "India's AI Business Operating System for inventory businesses. Manage udhaar, sales, and inventory via WhatsApp.",
    softwareVersion: "2.0.0",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    author: {
      "@type": "Person",
      name: "Amit Sharma",
    },
    featureList: [
      "WhatsApp Billing",
      "Inventory Management",
      "Udhaar Tracking",
      "Customer CRM",
      "AI Accounting",
      "GST Reports",
      "Analytics",
      "System Optimization",
      "Immersive Analytics",
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://dukaanmitra.in/#faq",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I start using DukaanMitra?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply send 'START' to our WhatsApp number +91 63937 41171. No app download is required.",
        },
      },
      {
        "@type": "Question",
        name: "Is my data safe?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, we use enterprise-grade encryption and secure cloud storage (Firebase) to ensure your shop's data is always protected.",
        },
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": "https://dukaanmitra.in/#howto",
    name: "How to manage your inventory business with DukaanMitra",
    description:
      "A simple 3-step guide to digitizing your shop using WhatsApp.",
    step: [
      {
        "@type": "HowToStep",
        name: "Send START to WhatsApp",
        text: "Message 'START' to +91 63937 41171 to activate your digital Munim.",
        url: "https://dukaanmitra.in/#start",
      },
      {
        "@type": "HowToStep",
        name: "Log your first transaction",
        text: "Type a simple message like 'Rahul 500 Sugar' to record a sale or udhaar.",
        url: "https://dukaanmitra.in/#log",
      },
      {
        "@type": "HowToStep",
        name: "View your EOD report",
        text: "Receive an automated summary of your daily sales and pending udhaar every evening.",
        url: "https://dukaanmitra.in/#report",
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": "https://dukaanmitra.in/#product",
    name: "DukaanMitra AI Business OS",
    image: "https://dukaanmitra.in/logo.svg",
    description:
      "AI-powered WhatsApp Business OS for Indian inventory businesses.",
    brand: {
      "@type": "Brand",
      name: "DukaanMitra",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1250",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Rajesh Traders",
        },
      },
    ],
    offers: {
      "@type": "AggregateOffer",
      offerCount: "3",
      lowPrice: "0",
      highPrice: "499",
      priceCurrency: "INR",
    },
  };

  const faqs = [
    {
      q: "What is DukaanMitra?",
      a: "DukaanMitra is an AI-powered WhatsApp Business Operating System designed specifically for Indian Retailers, Shopkeepers and MSMEs to manage billing, inventory, and udhaar automatically.",
    },
    {
      q: "How does WhatsApp Billing work?",
      a: "You simply type a message like 'Ramesh 500 Sugar' and our AI Munim automatically generates a professional GST or non-GST bill and sends it to the customer's WhatsApp instantly.",
    },
    {
      q: "Can I manage inventory with it?",
      a: "Yes, every time you log a sale, the AI automatically deducts the items from your inventory and alerts you when stock is low, preventing stockouts.",
    },
    {
      q: "Can AI read Hindi or Hinglish?",
      a: "Absolutely. DukaanMitra's AI is trained on Indian local dialects and perfectly understands Hinglish (e.g., '2 kilo aalu udhaar') and updates the ledger accurately.",
    },
    {
      q: "How is DukaanMitra different from traditional POS?",
      a: "Traditional POS requires expensive hardware and training. DukaanMitra works 100% inside WhatsApp using natural chat, saving you hardware costs and daily effort.",
    },
    {
      q: "How do I start using DukaanMitra?",
      a: "Simply send 'START' to our official WhatsApp number. No app download is required to begin managing your shop.",
    },
    {
      q: "Is my business data safe?",
      a: "Yes, we use enterprise-grade encryption and secure cloud storage (Firebase) to ensure your shop's data is always protected and backed up.",
    },
    {
      q: "Do I need to download an app?",
      a: "No! As a merchant, you can do everything from WhatsApp. We do offer a web dashboard for detailed analytics if you want deeper insights.",
    },
    {
      q: "Do my customers need to download an app?",
      a: "Not at all. Customers receive their bills, receipts, and udhaar reminders directly on their own WhatsApp.",
    },
    {
      q: "Can it handle Udhaar (credit) recovery?",
      a: "Yes. Simply log the udhaar in WhatsApp. The AI tracks it and can send polite automated reminders to customers to pay their dues.",
    },
    {
      q: "Does it support GST billing?",
      a: "Yes, you can configure your GSTIN and generate compliant GST invoices instantly via WhatsApp.",
    },
    {
      q: "Can I use it for multiple shops?",
      a: "Yes, DukaanMitra supports multi-store management. You can link multiple WhatsApp numbers or separate branches under one dashboard.",
    },
    {
      q: "What happens if I lose my phone?",
      a: "Your data is safely backed up in the cloud. Just log in from a new device, and your entire ledger and inventory will be restored instantly.",
    },
    {
      q: "Does it work offline?",
      a: "Since it relies on WhatsApp, you need an internet connection to send commands. However, pending messages will automatically sync once you're back online.",
    },
    {
      q: "Can I import my existing items?",
      a: "Yes! You can bulk upload your existing inventory from an Excel sheet or CSV directly via the web dashboard.",
    },
    {
      q: "Who is this software built for?",
      a: "It is built for Retailers, MSMEs, Wholesalers, Pharmacy Shops, Hardware Stores, and Electronics shops looking to digitize without complexity.",
    },
    {
      q: "How does the AI know my items?",
      a: "The AI matches your Hinglish text against your inventory database. If you type 'Chini', it knows you mean 'Sugar' based on your catalog.",
    },
    {
      q: "Can I track my daily sales?",
      a: "Yes, at the end of the day, Munim AI sends you a complete day-end report on WhatsApp showing total sales, udhaar given, and top-selling items.",
    },
    {
      q: "Is customer support available?",
      a: "We provide 24/7 dedicated support via WhatsApp and phone to help you with any issues.",
    },
    {
      q: "Can I manage staff access?",
      a: "Yes, you can add your staff members. They can log sales, but they won't have access to your core business analytics and profit margins.",
    },
    {
      q: "What is the pricing?",
      a: "We offer a 14-day free trial. After that, it is available on an affordable monthly or yearly subscription tailored for Indian MSMEs.",
    },
    {
      q: "Are there any hidden charges?",
      a: "No, there are no hidden charges. Our pricing is completely transparent.",
    },
    {
      q: "Can I cancel my subscription?",
      a: "Yes, you can cancel at any time. Your data can be exported to Excel before cancellation.",
    },
    {
      q: "Do you provide hardware?",
      a: "No, DukaanMitra is a 100% software solution that runs on your existing smartphone or PC.",
    },
    {
      q: "How fast is the onboarding?",
      a: "You can set up your store and start billing within 2 minutes. No technical knowledge required.",
    },
  ];

  const features = [
    {
      title: "WhatsApp-First",
      desc: "Manage your entire shop via WhatsApp—no app needed.",
      benefit: "Zero learning curve, high adoption.",
      icon: "📱",
      link: "/whatsapp-ai",
    },
    {
      title: "AI-Powered Munim",
      desc: "Type 'Rahul 500 Chini' and let AI extract customer, amount, and item.",
      benefit: "Saves time, reduces errors.",
      icon: "🧠",
      link: "/billing",
    },
    {
      title: "Auto Ledger",
      desc: "Every transaction updates Google Sheets/SQL in real time.",
      benefit: "Always accurate books, no manual entry.",
      icon: "📑",
      link: "/inventory",
    },
    {
      title: "Udhaar Tracking",
      desc: "Instant udhaar statements for customers.",
      benefit: "Reduces defaults, builds trust.",
      icon: "📄",
      link: "/udhaar",
    },
    {
      title: "Daily Reports",
      desc: "End-of-day sales, udhaar, and inventory summaries sent via WhatsApp.",
      benefit: "Stay informed without effort.",
      icon: "📊",
      link: "/analytics",
    },
    {
      title: "Retail Intel",
      desc: "AI-driven insights on stock trends and customer behavior.",
      benefit: "Make data-backed decisions.",
      icon: "💡",
      link: "/crm",
    },
  ];

  const dukaanFlow = [
    {
      title: "Smart Ingress",
      desc: "Customer buys an item. Shopkeeper types 'Rahul 500 Chini' in WhatsApp.",
      icon: "📱",
      color: "indigo",
      tech: "WhatsApp API + NLP",
      detail: "99.9% extraction accuracy for Indian names and items.",
    },
    {
      title: "AI Reasoning",
      desc: "Munim AI parses the message: Customer, Amount, and Item extraction.",
      icon: "🧠",
      color: "emerald",
      tech: "Gemini / BERT",
      detail: "Context-aware parsing handles slang and local dialects.",
    },
    {
      title: "Ledger Update",
      desc: "Transaction is logged in Google Sheets or SQL DB automatically.",
      icon: "📑",
      color: "blue",
      tech: "Firebase + Sheets API",
      detail: "Real-time sync with 0.5s latency across all devices.",
    },
    {
      title: "Auto Statement",
      desc: "Customer gets receipt. Shopkeeper gets EOD report with sales & udhaar.",
      icon: "📄",
      color: "amber",
      tech: "Automated Triggers",
      detail: "Reduces manual calculation time by 95% daily.",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh",
      shop: "Wholesale Trader, Kanpur",
      quote:
        "DukaanMitra ne mere 4 ghante ka kaam 10 minute ka kar diya. Ab WhatsApp pe hi sab ho jaata hai!",
      icon: "👨‍🌾",
    },
    {
      name: "Suresh",
      shop: "Hardware Store, Lucknow",
      quote:
        "Udhaar mangne mein sharam aati thi, ab AI OS apne aap reminder bhej deta hai. Paisa time pe mil raha hai.",
      icon: "🏪",
    },
    {
      name: "Meena",
      shop: "Electronics Retail, Delhi",
      quote:
        "Inventory management ab bahut asaan hai. WhatsApp pe hi pata chal jata hai kya khatam ho raha hai.",
      icon: "💻",
    },
  ];

  const pricing = [
    {
      name: "Khata Basic",
      price: "Free Forever",
      features: [
        "100 transactions/mo",
        "Basic udhaar tracking",
        "WhatsApp reports",
      ],
      bestFor: "New shops adopting digital.",
    },
    {
      name: "Merchant Pro",
      price: "₹299/mo",
      features: [
        "Unlimited transactions",
        "Inventory alerts",
        "Google Business Setup",
        "GST-Ready Billing",
      ],
      bestFor: "Growing businesses aiming for more footfall.",
    },
    {
      name: "Growth + Supply",
      price: "₹899/mo",
      features: [
        "Advanced Analytics",
        "B2B Supply chain leads",
        "Google Cloud Backup",
        "Distributor Referrals",
      ],
      bestFor: "Established businesses wanting to optimize procurement.",
    },
  ];

  return (
    <HybridMovieWrapper>
      <div className="flex flex-col min-h-screen bg-white">
        <Helmet>
          <title>
            DukaanMitra — India's AI Business Operating System | Zero Install
          </title>
          <meta
            name="description"
            content="Transform your business with DukaanMitra - India's AI Business Operating System. Manage udhaar, sales, and inventory via WhatsApp. Zero app install needed."
          />
          <meta
            name="keywords"
            content="WhatsApp OS, AI Business OS, Inventory Management, dukaan management app, AI Business software, India business OS"
          />
          <meta
            property="og:title"
            content="DukaanMitra — India's AI Business Operating System"
          />
          <meta
            property="og:description"
            content="India's AI Business Operating System for inventory businesses. Manage udhaar, sales, and inventory via WhatsApp."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://dukaanmitra.in/" />
          <meta property="og:image" content="https://dukaanmitra.in/logo.svg" />
          <meta
            name="twitter:image"
            content="https://dukaanmitra.in/logo.svg"
          />
          <meta property="og:site_name" content="DukaanMitra" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="DukaanMitra — India's AI Business Operating System"
          />
          <meta
            name="twitter:description"
            content="Manage your inventory business via WhatsApp with AI."
          />

          <script type="application/ld+json">
            {JSON.stringify(organizationSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(webSiteSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(webPageSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(localBusinessSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(productSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(videoSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(softwareSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(howToSchema)}
          </script>
        </Helmet>

        {/* Hero Section */}
        <section className="px-6 lg:px-20 py-24 lg:py-48 gradient-bg text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400 rounded-full blur-[120px]"></div>
          </div>
          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-12 hero-text-container" ref={heroRef}>
              <div className="hero-text inline-flex items-center space-x-3 bg-white/20 px-5 py-2 rounded-full border border-white/10 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                  System Core Online
                </span>
              </div>
              <h1 className="hero-text text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] font-black text-white leading-[0.9] tracking-tighter italic break-words">
                India's AI WhatsApp Business <br />
                <span className="text-emerald-400">Operating System</span>{" "}
                <br />
                for Retail Businesses
              </h1>
              <p className="hero-text text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-xl font-bold tracking-tight">
                Manage Billing, Inventory, Udhaar, CRM, Orders and Business
                Operations through WhatsApp AI.
              </p>
              <div className="hero-text flex flex-col sm:flex-row flex-wrap gap-6">
                <Button
                  onClick={() => {
                    const el = document.getElementById("waitlist");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  size="xl"
                  className="bg-white text-indigo-900 border-none shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-24"
                >
                  Start Free ➔
                </Button>
              </div>
            </div>
            <div className="relative" ref={mockupRef}>
              <div className="sm:p-4 rounded-[2rem] sm:rounded-[3rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.5)] border-[8px] sm:border-[12px] border-slate-800 rotate-2 transform hover:rotate-0 transition-transform duration-1000 group max-w-[420px] mx-auto bg-slate-800 overflow-hidden relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-20 flex items-center justify-center">
                  <div className="w-14 h-1 bg-slate-800 rounded-full"></div>
                </div>
                <div className="bg-[#efe7de] w-full h-[600px] flex flex-col relative z-10 pointer-events-auto">
                  <WhatsAppSimulation storeId="demo-mode" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Demo Video Section */}
        <section className="py-24 px-6 lg:px-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-5xl mx-auto space-y-12 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
                See How It Works
              </h2>
              <p className="text-xl font-bold text-slate-500">
                Watch the product demo of DukaanMitra AI.
              </p>
            </div>
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-900 aspect-video bg-slate-900">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/AgjXUeejXDk?autoplay=1&mute=1&loop=1&playlist=AgjXUeejXDk&controls=1&rel=0"
                title="DukaanMitra AI Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* Semantic Content Expansion Section */}
        <section className="py-24 px-6 lg:px-20 bg-slate-50 border-b border-slate-200">
          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="col-span-1 lg:col-span-2">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 mb-4">
                  Why DukaanMitra?
                </h2>
                <p className="text-xl text-slate-500 font-medium">
                  From chaos to clarity in 4 simple steps.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-rose-100 transition-colors shadow-lg">
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-black text-xl mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-slate-900 mb-3">
                    The Problem
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm">
                    Messy paper ledgers, lost udhaar entries, complicated
                    billing software, and no time to learn complex POS machines.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-indigo-100 transition-colors shadow-lg">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-slate-900 mb-3">
                    The Solution
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm">
                    A smart AI Munim that lives directly inside your WhatsApp.
                    No new apps to download, no hardware to buy.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-emerald-100 transition-colors shadow-lg">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-slate-900 mb-3">
                    How AI Works
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm">
                    Just type naturally: "Ramesh 40 Chini". AI automatically
                    deducts inventory, adds ₹40 to Ramesh's Udhaar, and sends
                    him a WhatsApp receipt.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border-4 border-slate-100 hover:border-amber-100 transition-colors shadow-lg">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-black text-xl mb-6">
                    4
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-slate-900 mb-3">
                    The Benefits
                  </h3>
                  <p className="text-slate-600 font-medium leading-relaxed text-sm">
                    Zero onboarding time, 100% udhaar recovery, real-time
                    analytics, and professional receipts that build customer
                    trust.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-32 px-6 lg:px-20 bg-white">
          <div className="max-w-[1600px] mx-auto space-y-24">
            <div className="text-center space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic tracking-tighter uppercase leading-none text-slate-900 break-words">
                🌟 Key Features
              </h2>
              <p className="text-xl text-indigo-600 font-bold tracking-widest uppercase">
                Designed for the Bharat Retail Ecosystem
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((f, i) => (
                <Link to={f.link} key={i} className="block">
                  <Card className="p-12 space-y-8 group hover:bg-indigo-600 transition-all duration-500 border-b-8 border-slate-900 hover:border-indigo-900 relative h-full">
                    <div className="w-20 h-20 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform group-hover:bg-white/20">
                      {f.icon}
                    </div>
                    <div className="space-y-4">
                      <Card.Title className="text-4xl group-hover:text-white leading-none tracking-tighter">
                        {f.title}
                      </Card.Title>
                      <Card.Description className="text-lg group-hover:text-indigo-50 font-bold italic opacity-70">
                        "{f.desc}"
                      </Card.Description>
                      <div className="pt-6 border-t border-slate-100 group-hover:border-indigo-400">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 group-hover:text-white mb-2">
                          Bharat Advantage
                        </p>
                        <p className="text-sm font-black italic text-slate-800 group-hover:text-white underline decoration-emerald-400 decoration-4 underline-offset-4">
                          {f.benefit}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-10 right-10 text-slate-100/10 group-hover:text-white/10 text-9xl font-black italic pointer-events-none uppercase tracking-tighter leading-none select-none italic">
                      {i + 1}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Problem-First intent section */}
        <section className="py-32 px-6 lg:px-20 bg-slate-50 border-y border-slate-200">
          <div className="max-w-[1600px] mx-auto space-y-24">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
                What problem can I solve for you today?
              </h2>
              <p className="text-xl text-slate-500 font-bold italic">
                Stop searching for features, start finding solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  problem: "Udhaar ka hisaab kaise rakhe?",
                  icon: "📉",
                  link: "/blog/udhaar-ka-hisaab-kaise-rakhe",
                  cta: "Manage Khaata",
                },
                {
                  problem: "Daily Sales record nahi ho rahi?",
                  icon: "📊",
                  link: "/blog/Business-shop-daily-sales-system",
                  cta: "Setup Sales Tracker",
                },
                {
                  problem: "WhatsApp se order kaise le?",
                  icon: "📱",
                  link: "/blog/whatsapp-se-order-kaise-le",
                  cta: "Start WhatsApp Shop",
                },
              ].map((p, i) => (
                <Card
                  key={i}
                  className="p-12 flex flex-col items-center text-center space-y-8 border-b-8 border-indigo-600 hover:translate-y-[-8px] transition-all duration-500 bg-white group shadow-[12px_12px_0px_0px_rgba(0,0,0,0.05)]"
                >
                  <div className="text-8xl group-hover:scale-110 transition-transform duration-500">
                    {p.icon}
                  </div>
                  <Card.Title className="text-3xl leading-tight italic tracking-tighter uppercase">
                    {p.problem}
                  </Card.Title>
                  <Button
                    onClick={() => navigate(p.link)}
                    className="w-full h-14 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    {p.cta} ➔
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="py-32 px-6 lg:px-20 bg-indigo-50">
          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] italic border-2 border-indigo-200">
                Phase 3: Beta Scale-Up
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic tracking-tighter uppercase leading-none text-slate-900 break-words">
                Join the Future of <br />
                <span className="text-indigo-600">Business Tech</span>
              </h2>
              <p className="text-2xl text-slate-500 font-bold italic leading-relaxed">
                We are onboarding shops in batches to ensure every merchant gets
                personalized support. Join our 10,000+ strong waitlist to get
                your business digitised.
              </p>
              <div className="flex items-center gap-4 py-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center font-black italic text-xs overflow-hidden"
                    >
                      <img
                        loading="lazy"
                        src={`/assets/avatars/user${(i % 3) + 1}.svg`}
                        alt="User"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                  <span className="text-indigo-600">842 shops</span> joined
                  today
                </p>
              </div>
            </div>
            <Card className="p-12 space-y-10 border-4 border-slate-900 shadow-[24px_24px_0px_0px_rgba(79,70,229,1)] bg-white relative">
              <div className="absolute top-[-10px] right-[-10px] bg-emerald-500 text-white px-6 py-2 font-black italic uppercase text-xs rotate-3 shadow-lg">
                limited spots left
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold italic focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    WhatsApp Number
                  </label>
                  <div className="flex gap-4">
                    <span className="h-16 px-6 bg-slate-100 flex items-center justify-center rounded-3xl font-black italic border-2 border-slate-100">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98XXXXXX00"
                      className="flex-1 h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold italic focus:border-indigo-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Krishna Enterprises"
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-bold italic focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>
              <Button
                size="xl"
                className="w-full h-20 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                CLAIM MY SPOT IN LINE ➔
              </Button>
              <p className="text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                By joining, you agree to receive a WhatsApp invite for Early
                Access.
              </p>
            </Card>
          </div>
        </section>

        {/* Munim Flow Section */}
        <section
          id="flow"
          className="py-32 px-6 lg:px-20 bg-slate-900 text-white overflow-hidden"
        >
          <div className="max-w-[1600px] mx-auto space-y-24">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic tracking-tighter uppercase leading-none break-words">
                The Munim Flow
              </h2>
              <p className="text-xl text-indigo-400 font-bold tracking-widest uppercase">
                End-to-End Digital Transformation
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-12 relative">
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 -translate-y-1/2"></div>

              {dukaanFlow.map((step, i) => (
                <div
                  key={i}
                  className="flow-step relative z-10 flex flex-col items-center text-center space-y-8"
                >
                  <div
                    className={`w-24 h-24 rounded-[2.5rem] bg-${step.color}-600 shadow-2xl shadow-${step.color}-900/50 flex items-center justify-center text-4xl transform hover:scale-110 hover:rotate-6 transition-all duration-500`}
                  >
                    {step.icon}
                  </div>
                  <div className="space-y-3 px-6">
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed italic mb-2">
                      "{step.desc}"
                    </p>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">
                      {step.detail}
                    </p>
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-300">
                      {step.tech}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-12">
              <div className="bg-white/5 border border-white/10 p-8 rounded-[3rem] max-w-3xl w-full text-center">
                <p className="text-sm font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">
                  Visual Flow
                </p>
                <p className="text-2xl font-black italic tracking-tight text-white">
                  Customer → WhatsApp Message → AI Parsing → Ledger Update →
                  Auto-Receipt → EOD Report
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-6 lg:px-20 bg-white">
          <div className="max-w-[1600px] mx-auto space-y-24">
            <div className="text-center space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic tracking-tighter uppercase leading-none text-slate-900 break-words">
                💰 Simple Pricing
              </h2>
              <p className="text-xl text-indigo-600 font-bold tracking-widest uppercase">
                Transparent & Scalable Plans
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pricing.map((p, i) => (
                <Card
                  key={i}
                  className={cn(
                    "p-10 flex flex-col border-b-8 transition-all duration-500 relative overflow-hidden h-full",
                    p.name === "Growth + Supply"
                      ? "bg-slate-900 text-white border-indigo-500 scale-105 shadow-2xl z-10"
                      : "bg-white text-slate-900 border-slate-200 shadow-xl",
                  )}
                >
                  <div className="mb-8">
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-4 opacity-70 leading-none">
                      {p.name}
                    </h3>
                    <div className="flex flex-col">
                      <span className="text-5xl font-black italic tracking-tighter">
                        {p.price}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1 italic">
                        per shop / month
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-5 mb-10">
                    {p.features.map((feat, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center text-[10px] font-black italic">
                          ✓
                        </div>
                        <span className="text-sm font-bold opacity-80 italic tracking-tight">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-6">
                    <div
                      className={cn(
                        "p-5 rounded-3xl border-2 italic",
                        p.name === "Growth + Supply"
                          ? "bg-white/5 border-white/10"
                          : "bg-slate-50 border-slate-100",
                      )}
                    >
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">
                        Mission Fit
                      </p>
                      <p className="text-xs font-black tracking-tight leading-relaxed">
                        {p.bestFor}
                      </p>
                    </div>
                    {p.price === "Free Forever" ? (
                      <a
                        href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "flex items-center justify-center w-full py-6 h-14 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none transition-all italic tracking-tighter font-black text-sm uppercase",
                          p.name === "Growth + Supply"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 text-slate-900",
                        )}
                      >
                        CHOOSE THIS PLAN ➔
                      </a>
                    ) : (
                      <RazorpayCheckoutButton
                        amount={parseInt(p.price.replace(/[^0-9]/g, ""), 10)}
                        planName={p.name}
                        className={cn(
                          "w-full py-6 h-14 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none transition-all italic tracking-tighter font-black text-sm uppercase",
                          p.name === "Growth + Supply"
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 text-slate-900",
                        )}
                      />
                    )}
                  </div>
                  <div className="absolute -top-4 -right-4 text-9xl font-black italic opacity-[0.03] select-none pointer-events-none italic uppercase">
                    {p.name[0]}
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-center text-slate-400 font-bold italic">
              Note: All plans include free onboarding and 24/7 WhatsApp support.
            </p>
          </div>
        </section>

        {/* Why MitraOS Section */}
        <section className="py-32 px-6 lg:px-20 bg-indigo-600 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-12">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic tracking-tighter uppercase leading-none break-words">
                🚀 Why Spatial Web?
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    ⏰
                  </div>
                  <div>
                    <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
                      Zero Interface Friction
                    </h4>
                    <p className="text-indigo-100 font-bold opacity-80">
                      Navigate complex information spaces without physically
                      interacting with a screen.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    🧠
                  </div>
                  <div>
                    <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
                      AI-Assisted Processing
                    </h4>
                    <p className="text-indigo-100 font-bold opacity-80">
                      Our internal AI automatically clusters and coordinates
                      your data based on contextual intent.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-12 rounded-[4rem] border border-white/20 space-y-8">
              <div className="inline-flex items-center space-x-3 bg-white text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Architectural Standard
              </div>
              <h3 className="text-4xl font-black italic tracking-tighter uppercase">
                Improving Our Core Systems
              </h3>
              <p className="text-xl font-bold italic text-indigo-50 leading-relaxed">
                We developed this infrastructure to enhance our own internal
                capabilities. This isn't a retail product; it's the baseline
                engine we inject into every high-end computing experience we
                create.
              </p>
              <ul className="space-y-4 text-sm font-black uppercase tracking-widest text-indigo-200">
                <li className="flex items-center gap-3">
                  <span>➔</span> Edge-Processed Inference
                </li>
                <li className="flex items-center gap-3">
                  <span>➔</span> Sub-millisecond DOM manipulation
                </li>
                <li className="flex items-center gap-3">
                  <span>➔</span> 3D Rendering Integration
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-32 px-6 lg:px-20 bg-slate-50">
          <div className="max-w-[1600px] mx-auto space-y-24">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
                🗣️ Shopkeeper Stories
              </h2>
              <p className="text-xl text-indigo-600 font-bold tracking-widest uppercase">
                Trusted by 10,000+ Businesses
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {testimonials.map((t, i) => (
                <Card
                  key={i}
                  className="p-12 border-b-8 border-indigo-100 hover:border-indigo-600 space-y-8 relative group hover:scale-105 transition-all duration-500 bg-white shadow-xl"
                >
                  <div className="text-8xl text-indigo-100 absolute top-4 left-4 opacity-30 group-hover:opacity-60 transition-opacity italic font-black">
                    “
                  </div>
                  <p className="text-2xl font-black italic tracking-tight text-slate-900 leading-tight relative z-10 pt-8">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-5 pt-8 border-t-2 border-slate-50">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg italic">
                      {t.icon}
                    </div>
                    <div>
                      <p className="text-xl font-black italic tracking-tight text-slate-900 leading-none mb-1">
                        {t.name}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 italic">
                        {t.shop}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Founder Section */}
        

        {/* Insights Section */}
        <section className="py-32 px-6 lg:px-20 bg-slate-50">
          <div className="max-w-[1600px] mx-auto space-y-20">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-slate-200 pb-12">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-3 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  Retail Intelligence
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter italic">
                  The Bharat Retail Feed
                </h2>
              </div>
              <Link
                to="/blog"
                className="text-indigo-600 font-black text-xl uppercase tracking-tighter italic hover:underline"
              >
                Explore Daily Insights ➔
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[
                {
                  title: "UPI Lite: The Game Changer for Fast Checkout",
                  tag: "Tech",
                  excerpt:
                    "How low-latency payments are reducing queue times in Delhi's busy wholesale markets.",
                },
                {
                  title: "Managing Winter Stocks in Northern India",
                  tag: "Inventory",
                  excerpt:
                    "Strategic stock management for Tier-2 cities during the coldest months.",
                },
                {
                  title: "Building Trust with Digital Udhaar Reminders",
                  tag: "Retention",
                  excerpt:
                    "Data shows 40% faster recovery when reminders are sent via WhatsApp.",
                },
              ].map(
                (b, i) =>
                  b && (
                    <Card
                      key={i}
                      className="p-10 border-b-8 border-slate-100 hover:border-indigo-600 hover:scale-105 transition-all duration-500 group bg-white"
                    >
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] group-hover:text-indigo-600 transition-colors italic">
                        {b.tag}
                      </span>
                      <Card.Title className="text-3xl mt-4 mb-6 leading-none italic">
                        {b.title}
                      </Card.Title>
                      <Card.Description className="mb-8 opacity-80 italic font-bold">
                        "{b.excerpt}"
                      </Card.Description>
                      <Button
                        onClick={() => navigate("/blog")}
                        variant="ghost"
                        className="text-[11px] font-black uppercase tracking-widest text-slate-900 p-0 h-auto hover:bg-transparent underline decoration-emerald-400 decoration-4 underline-offset-8 hover:decoration-indigo-600"
                      >
                        READ ANALYSIS ➔
                      </Button>
                    </Card>
                  ),
              )}
            </div>
          </div>
        </section>

        {/* Detailed SEO Content Section */}
        <section className="py-32 px-6 lg:px-20 bg-slate-50">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900 leading-tight">
                DukaanMitra – India's AI Business Operating System
              </h2>
              <div className="prose prose-lg text-slate-600 font-bold italic leading-relaxed space-y-6">
                <p>
                  In the rapidly evolving landscape of Indian commerce, managing
                  an inventory-driven business requires more than just a basic
                  software.
                  <strong> DukaanMitra</strong> is designed to be your ultimate{" "}
                  <strong>AI Business Operating System (BOS)</strong>,
                  specifically built for the unique needs of retailers,
                  distributors, wholesalers, and manufacturers. Whether you are
                  in a bustling metro or a Tier 2 city, our platform empowers
                  you to
                  <strong> automate business operations</strong> and transition
                  into the digital age without the complexity of traditional ERP
                  systems.
                </p>
                <p>
                  Why is DukaanMitra considered the{" "}
                  <strong>best AI Business OS</strong>? It's because we
                  understand that your time is valuable. Instead of spending
                  hours on manual entries, our{" "}
                  <strong>WhatsApp-first architecture</strong> allows you to log
                  sales, track inventory, and manage udhaar by simply sending a
                  message. This <strong>inventory management software</strong>{" "}
                  is not just an app; it's a comprehensive{" "}
                  <strong>AI Commerce OS</strong> that lives where you already
                  are—on WhatsApp.
                </p>
                <h3 className="text-2xl font-black italic text-slate-900 uppercase">
                  How to Manage Your Business Digitally with AI
                </h3>
                <p>
                  Many owners ask,{" "}
                  <em>"Inventory aur business ka hisaab kaise rakhe?"</em> The
                  answer lies in simplicity and intelligence. DukaanMitra uses
                  advanced Natural Language Processing (NLP) to understand your
                  business language. When you type "Rahul 500 Chini", our AI
                  automatically identifies the customer, amount, and item. It
                  then updates your digital ledger in real-time, providing you
                  with an accurate{" "}
                  <strong>inventory management platform</strong>
                  experience without the data entry fatigue.
                </p>
                <p>
                  Our <strong>business automation in India</strong> initiative
                  aims to bridge the digital divide. By providing
                  <strong>an AI Business Operating System</strong> that requires
                  zero training, we ensure that every merchant can benefit from
                  <strong>AI retail analytics</strong>. You get daily reports on
                  your sales, pending udhaar, and stock alerts, helping you make
                  data-backed decisions to grow your business.
                </p>
                <h3 className="text-2xl font-black italic text-slate-900 uppercase">
                  The Future of Business Operating Systems
                </h3>
                <p>
                  The future of business is smart, connected, and automated.
                  DukaanMitra is leading this change by offering
                  <strong>a comprehensive AI platform</strong> that scales with
                  your business. From automated udhaar reminders that help you
                  recover payments 40% faster to AI-driven marketing tools that
                  help you engage with your local customers, we provide
                  everything you need to thrive in a competitive market.
                </p>
                <p>
                  Stop struggling with manual calculations and lost records.
                  Join the thousands of smart business owners who have chosen
                  DukaanMitra as their trusted{" "}
                  <strong>AI Operating System</strong>. Start your journey today
                  and see how easy it is to{" "}
                  <strong>manage your business digitally</strong>. Bas WhatsApp
                  chalana hai, baaki kaam DukaanMitra sambhal lega!
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-12">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-4">
                <h4 className="text-xl font-black italic text-indigo-600 uppercase">
                  AI CRM for Retail
                </h4>
                <p className="text-sm font-bold text-slate-500 italic">
                  Manage customer relationships and loyalty automatically via
                  WhatsApp interactions.
                </p>
              </div>
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-4">
                <h4 className="text-xl font-black italic text-indigo-600 uppercase">
                  Smart Inventory
                </h4>
                <p className="text-sm font-bold text-slate-500 italic">
                  Real-time stock tracking and low-inventory alerts sent
                  directly to your phone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Internal Navigation for Discovery Crawl */}
        <section className="py-32 px-6 lg:px-20 bg-white border-y border-slate-100">
          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-2 gap-20">
            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-tight">
                Top Growth Guides
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Manage Udhaar Safely",
                    link: "/p/bahi-khata-alternative",
                  },
                  {
                    title: "Increase Shop GMV",
                    link: "/p/Business-store-ko-grow-kaise-kare",
                  },
                  {
                    title: "WhatsApp Billing Setup",
                    link: "/p/Business-store-software",
                  },
                  {
                    title: "Inventory Masterclass",
                    link: "/p/inventory-management-Business",
                  },
                  {
                    title: "Automate Reviews",
                    link: "/get-more-google-reviews-for-shop",
                  },
                  {
                    title: "Zero Cost Shop Launch",
                    link: "/p/dukaan-online-kaise-laye",
                  },
                ].map((guide, i) => (
                  <Link
                    key={i}
                    to={guide.link}
                    className="p-6 bg-slate-50 hover:bg-slate-100 rounded-3xl border border-slate-100 transition-colors flex justify-between items-center group"
                  >
                    <span className="font-bold text-slate-700 italic group-hover:text-indigo-600 transition-colors">
                      {guide.title}
                    </span>
                    <span className="text-slate-400 group-hover:text-indigo-600 transition-colors">
                      ➔
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="space-y-12">
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-tight">
                Areas We Serve
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  "Lucknow",
                  "Kanpur",
                  "Delhi",
                  "Mumbai",
                  "Bangalore",
                  "Pune",
                  "Ahmedabad",
                  "Hyderabad",
                  "Chennai",
                  "Kolkata",
                  "Jaipur",
                  "Surat",
                ].map((city, i) => (
                  <Link
                    key={i}
                    to={`/${city.toLowerCase()}`}
                    className="p-6 bg-indigo-50 hover:bg-indigo-600 rounded-3xl border border-indigo-100 transition-colors flex justify-between items-center group"
                  >
                    <span className="font-black tracking-tight text-indigo-900 group-hover:text-white transition-colors">
                      {city}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Android Studio Companion App Promotion Section */}
        <section className="py-24 px-6 lg:px-20 bg-indigo-900 text-white border-y-8 border-slate-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
            <div className="lg:col-span-8 space-y-8">
              <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-emerald-500/30">
                📱 Native Wrapper Technology
              </span>
              <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                RUN DUKAANMITRA AS A <br />
                <span className="text-emerald-400">NATIVE SYSTEM</span> APP
              </h2>
              <p className="text-xl text-slate-300 font-bold max-w-3xl leading-relaxed">
                Want a fully integrated APK working on your Android smartphone?
                We provide step-by-step instructions to compile your own package
                using Android Studio. If you prefer to get a completed compile
                right away, you can also contact our Admin on WhatsApp to
                deliver your real working app tool!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/android-app"
                  className="px-8 py-4 bg-white text-indigo-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-transform hover:scale-[1.02] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
                >
                  Access App compiler manual 🛠️
                </Link>
                <Link
                  to="/android-app#whatsapp-admin"
                  className="px-8 py-4 bg-emerald-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl transition-transform hover:scale-[1.02] shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
                >
                  Contact Admin for pre-compiled APK ➔
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-96 bg-slate-950 rounded-[2.5rem] border-4 border-slate-800 p-3 shadow-2xl flex flex-col justify-between select-none">
                <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                  <span>DukaanMitra Companion</span>
                  <span className="text-emerald-400">● 100% Active</span>
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-center text-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <span className="text-white text-xl font-black italic">
                      D
                    </span>
                  </div>
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">
                    Sync status
                  </h4>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden w-2/3 mx-auto">
                    <div className="h-full bg-emerald-500 w-full animate-pulse" />
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold italic">
                    "Connected with secure WhatsApp ledger engine"
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded-2xl text-[9px] text-center text-indigo-400 font-black uppercase tracking-wider">
                  Android Build Live Tool
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 px-6 lg:px-20 bg-white">
          <div className="max-w-4xl mx-auto space-y-20">
            <div className="text-center space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none text-slate-900">
                🤔 Common Questions
              </h2>
              <p className="text-xl text-indigo-600 font-bold tracking-widest uppercase">
                Everything you need to know
              </p>
            </div>
            <div className="space-y-8">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-4"
                >
                  <h4 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
                    Q: {faq.q}
                  </h4>
                  <p className="text-slate-600 font-bold leading-relaxed italic">
                    A: {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="contact"
          className="py-32 px-6 lg:px-20 bg-slate-900 text-white rounded-[3rem] lg:rounded-[6rem] mx-4 lg:mx-10 my-20 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
        >
          <div className="max-w-5xl mx-auto text-center space-y-16 relative z-10">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black italic tracking-tighter leading-none break-words">
                Jahan Inventory, Wahan DukaanMitra.
              </h2>
              <p className="text-2xl font-bold italic text-indigo-400">
                Aapka Business, Ab Digital. Bas WhatsApp Chalana Hai!
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-12">
              <div className="grid sm:grid-cols-2 gap-8 w-full max-w-3xl">
                <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Step 1
                  </p>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase">
                    Start Free Trial
                  </h4>
                  <p className="text-sm font-bold opacity-60">
                    Join our WhatsApp Channel to activate your Munim.
                  </p>
                </div>
                <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    Step 2
                  </p>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase">
                    Try Live Demo
                  </h4>
                  <p className="text-sm font-bold opacity-60">
                    Experience the Dashboard instantly.
                  </p>
                  <button
                    onClick={() => navigate("/demo")}
                    className="mt-4 px-6 py-2 bg-indigo-600 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 transition-colors"
                  >
                    Open Demo
                  </button>
                </div>
              </div>
              <a
                href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full md:w-auto px-16 py-8 bg-emerald-500 text-slate-900 rounded-[3rem] font-black text-3xl hover:bg-emerald-400 transition-all shadow-2xl active:scale-95 italic tracking-tighter text-center"
              >
                Join WhatsApp Channel
              </a>
            </div>
          </div>
        </section>
      </div>
    </HybridMovieWrapper>
  );
};

export default LandingPage;
