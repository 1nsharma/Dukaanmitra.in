import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const StaticPage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Determine page content based on pathname
  let title = "Page";
  let subtitle = "This section is being updated for DukaanMitra AI v2.0.";
  let content = null;

  if (path === "/docs") {
    title = "Merchant & AI Documentation";
    subtitle = "Complete guide to setting up and running your shop with DukaanMitra AI.";
    content = (
      <div className="space-y-12 text-left max-w-4xl mx-auto">
        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">1. Quick Onboarding</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            DukaanMitra works instantly without requiring your customers to download any application. All communications occur natively via WhatsApp. As a merchant, you manage everything from your web-based AI Dashboard or directly inside WhatsApp.
          </p>
          <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-sm space-y-2 border-2 border-slate-800">
            <p className="text-indigo-400 font-bold"># Step 1: Send message to active line</p>
            <p>Message: <span className="text-emerald-400 font-bold">"START"</span> to +91 63937 41171</p>
            <p className="text-indigo-400 font-bold mt-4"># Step 2: The AI will initialize your ledger automatically</p>
            <p>Output: "Welcome to DukaanMitra! Your digital ledger is ready."</p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">2. WhatsApp Billing Commands</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Our AI NLP parses natural language (English, Hindi, and Hinglish) to instantly extract sales, customer names, item quantities, and udhaar balances.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-2">Example: Log a Cash Sale</h3>
              <p className="font-mono text-indigo-600 bg-slate-50 p-2 rounded-lg text-sm">"2kg sugar sold for 120 cash"</p>
              <p className="text-xs text-slate-500 mt-2">Registers inventory deduction and updates cash-in-hand.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
              <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs mb-2">Example: Log Udhaar (Credit)</h3>
              <p className="font-mono text-rose-600 bg-slate-50 p-2 rounded-lg text-sm">"Ramesh 500 udhaar for cooking oil"</p>
              <p className="text-xs text-slate-500 mt-2">Updates Ramesh's ledger balance and schedules a payment alert.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 uppercase italic">3. Bulk Catalog Management</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Upload your inventory using our pre-formatted Excel template. Simply navigate to the <Link to="/dashboard" className="text-indigo-600 font-bold underline">Merchant Dashboard</Link>, click "Inventory", and upload your spreadsheet. Our AI syncs it instantly.
          </p>
        </section>
      </div>
    );
  } else if (path === "/changelog") {
    title = "System Changelog";
    subtitle = "Track active development, major updates, and bug fixes for DukaanMitra.";
    content = (
      <div className="space-y-8 text-left max-w-3xl mx-auto">
        <div className="border-l-4 border-indigo-600 pl-6 space-y-2">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">v2.0.0 — Stable</span>
          <h3 className="text-xl font-black text-slate-900">The Gemini 2.5 Flash Upgrade</h3>
          <p className="text-slate-600 text-sm">
            Implemented a completely redesigned routing engine powered by Google's Gemini-3.5-Flash. Transaction extraction accuracy increased to 98.4%. Added Brotli/Gzip compression, canonical host routing, and static asset cache controls.
          </p>
        </div>
        <div className="border-l-4 border-slate-300 pl-6 space-y-2">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">v1.8.2</span>
          <h3 className="text-xl font-black text-slate-800">Razorpay Native Gateway & Subscriptions</h3>
          <p className="text-slate-600 text-sm">
            Integrated Razorpay Checkout buttons with strict telemetry logging and secure webhooks to handle merchant premium subscriptions seamlessly.
          </p>
        </div>
        <div className="border-l-4 border-slate-300 pl-6 space-y-2">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">v1.5.0</span>
          <h3 className="text-xl font-black text-slate-800">Multi-Store Dashboards</h3>
          <p className="text-slate-600 text-sm">
            Enabled single-merchant accounts to manage multiple retail outlets or distinct ledger systems from a consolidated analytics screen.
          </p>
        </div>
      </div>
    );
  } else if (path === "/roadmap") {
    title = "Product Roadmap";
    subtitle = "Our vision for the future of Indian retail automation.";
    content = (
      <div className="space-y-12 text-left max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-black">1</div>
            <h3 className="font-black text-slate-900 uppercase">Q3 2026: Voice-to-Bill</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Accepting audio-notes directly inside WhatsApp. Speak "Raju ko ek packet doodh dia" and watch the ledger update itself via voice models.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-black">2</div>
            <h3 className="font-black text-slate-900 uppercase">Q4 2026: AI Supply Chain</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Predicting stockout events before they happen. Connect with local B2B distributors automatically based on past sales velocity.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-black">3</div>
            <h3 className="font-black text-slate-900 uppercase">Q1 2027: ONDC Integration</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Synchronize your WhatsApp inventory catalog directly to the Open Network for Digital Commerce (ONDC) to receive orders from global networks.
            </p>
          </div>
        </div>
      </div>
    );
  } else if (path === "/founder") {
    title = "Founder's Vision";
    subtitle = "A personal letter from the creator of DukaanMitra.";
    content = (
      <div className="space-y-6 text-left max-w-2xl mx-auto text-slate-700 leading-relaxed font-medium">
        <p>
          Growing up watching local shopkeepers manage thousands of handwritten credit ledgers, crumpled cash bills, and manual stockbooks, I realized that true digital transformation isn't about making merchants learn complex enterprise software. It's about meeting them where they already are.
        </p>
        <p>
          With over <span className="text-indigo-600 font-black">400 million active users in India</span>, WhatsApp is the default communication layer of the nation. By adding a context-aware, highly optimized AI layer directly on top of WhatsApp, DukaanMitra empowers any small business owner to automate billing, ledger accounting, and digital payment tracking in seconds.
        </p>
        <p>
          Our mission is to bring 10 million Indian Kirana shops and retail stores into the digital-first economy by eliminating operational friction.
        </p>
        <div className="pt-6 border-t-2 border-slate-100">
          <p className="font-black text-slate-900 uppercase tracking-widest italic">Amit Sharma</p>
          <p className="text-xs text-slate-400 font-bold uppercase">Founder & CEO, DukaanMitra</p>
        </div>
      </div>
    );
  } else if (path === "/security") {
    title = "Security & Compliance";
    subtitle = "Your business records are safe, private, and fully secure.";
    content = (
      <div className="space-y-8 text-left max-w-3xl mx-auto text-slate-600">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-black text-slate-900 uppercase text-sm">🔐 End-to-End Encryption</h3>
            <p className="text-sm">
              All communications between your smartphone and our cloud-servers occur via HTTPS and enterprise-grade end-to-end encrypted tunnels.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-900 uppercase text-sm">📦 Durable Cloud Backup</h3>
            <p className="text-sm">
              We leverage Google Cloud Firestore with real-time automatic replication and hourly backups to guarantee zero data loss.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-900 uppercase text-sm">🛡️ No Shared Customer Data</h3>
            <p className="text-sm">
              We strictly comply with the Indian Digital Personal Data Protection (DPDP) Act. Your customer list is never sold or used for marketing.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-black text-slate-900 uppercase text-sm">⚡ Safe Payment Gateways</h3>
            <p className="text-sm">
              All subscription charges and invoices are processed through Razorpay's PCI-DSS compliant secure portal.
            </p>
          </div>
        </div>
      </div>
    );
  } else if (path === "/support") {
    title = "24/7 Merchant Support";
    subtitle = "We are here to assist you whenever you need help.";
    content = (
      <div className="space-y-8 text-center max-w-2xl mx-auto">
        <p className="text-slate-600 font-bold max-w-md mx-auto">
          Need help setting up your store catalog, connecting your WhatsApp Business account, or recovering a suspended Google Listing?
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl transition shadow-lg shadow-emerald-500/20"
          >
            💬 Support Chat on WhatsApp
          </a>
          <Link
            to="/contact"
            className="inline-block bg-slate-950 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs py-4 px-8 rounded-2xl transition shadow-lg"
          >
            📩 Submit Support Ticket
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-24 px-6 lg:px-20">
      <Helmet>
        <title>{title} | DukaanMitra AI OS</title>
        <meta name="description" content={subtitle} />
        <link rel="canonical" href={`https://dukaanmitra.in${path}`} />
      </Helmet>
      
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            DukaanMitra AI OS
          </div>
          <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-bold leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="bg-slate-50/50 rounded-[2.5rem] p-8 md:p-12 border-2 border-slate-100 shadow-sm relative overflow-hidden">
          {content}
        </div>
      </div>
    </div>
  );
};

export default StaticPage;

