import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Sparkles,
  Zap,
  Mic,
  MessageSquare,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Upload,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Crown,
  Database,
  Radio,
  FileSpreadsheet,
  Coins
} from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface ReorderItem {
  name: string;
  category: string;
  current_stock: number;
  reorder_level: number;
  unit: string;
  urgency: "CRITICAL" | "LOW_STOCK" | "OUT_OF_STOCK";
  recommended_order_qty: number;
}

interface MissedCustomer {
  customer_name: string;
  phone: string;
  usual_cycle_days: number;
  days_inactive: number;
  last_visit_date: string;
  top_item: string;
  urgency: string;
  insight: string;
}

interface ReadyOffer {
  customer_name: string;
  phone: string;
  target_item: string;
  days_inactive: number;
  message_text: string;
  whatsapp_redirect_url: string;
}

interface ArbitrageItem {
  product_name: string;
  your_cost_price: number;
  mandi_wholesale_rate: number;
  extra_cost_per_unit: number;
  unit: string;
  estimated_monthly_saving: number;
  recommendation: string;
}

export const AiEngineeringEcosystem: React.FC = () => {
  const [activePhase, setActivePhase] = useState<"phase1" | "phase2" | "phase3" | "phase4">("phase2");
  
  // Phase 1: Core Brain States
  const [selectedCustomer, setSelectedCustomer] = useState<string>("sharma");
  
  // Phase 2: MVP Magic Button States
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsLoaded, setInsightsLoaded] = useState(true);
  const [urgentReorders, setUrgentReorders] = useState<ReorderItem[]>([
    { name: "Aashirvaad Shudh Chakki Aata 10kg", category: "Flour", current_stock: 3, reorder_level: 10, unit: "bag", urgency: "CRITICAL", recommended_order_qty: 25 },
    { name: "Fortune Kachi Ghani Mustard Oil 1L", category: "Edible Oil", current_stock: 4, reorder_level: 12, unit: "pouch", urgency: "CRITICAL", recommended_order_qty: 30 },
    { name: "Tata Namak 1kg", category: "Salt", current_stock: 6, reorder_level: 15, unit: "pkt", urgency: "LOW_STOCK", recommended_order_qty: 40 },
    { name: "MDH Deggi Mirch 100g", category: "Spices", current_stock: 2, reorder_level: 8, unit: "pkt", urgency: "CRITICAL", recommended_order_qty: 20 },
  ]);

  const [missedCustomers, setMissedCustomers] = useState<MissedCustomer[]>([
    { customer_name: "Gupta ji (Civil Lines)", phone: "9829054321", usual_cycle_days: 15, days_inactive: 42, last_visit_date: "42 din pehle", top_item: "India Gate Basmati Rice 5kg", urgency: "CRITICAL", insight: "Gupta ji pichle 42 din se nahi aaye! Unka regular cycle har 15 din ka hai." },
    { customer_name: "Verma ji (Gopalpura)", phone: "9829099881", usual_cycle_days: 20, days_inactive: 38, last_visit_date: "38 din pehle", top_item: "Fortune Mustard Oil & Sugar", urgency: "CRITICAL", insight: "Verma ji pichle 38 din se nahi aaye. Inka rashan cycle toot chuka hai." },
    { customer_name: "Mishra ji (Vaishali Nagar)", phone: "9829011223", usual_cycle_days: 30, days_inactive: 48, last_visit_date: "48 din pehle", top_item: "Aashirvaad Aata & Toor Dal", urgency: "WARNING", insight: "Mishra ji har mahine rashan lete the, 48 din se koi purchase nahi." },
  ]);

  const [readyOffers, setReadyOffers] = useState<ReadyOffer[]>([
    {
      customer_name: "Gupta ji",
      phone: "9829054321",
      target_item: "India Gate Basmati Rice 5kg",
      days_inactive: 42,
      message_text: "Namaste Gupta ji! 🙏\n\nDukaanMitra Kirana se shubhkaamnayein. Kafi din ho gaye aap dukaan par nahi aaye. Aapka pasandeeda India Gate Basmati Rice aur taaza kirana ka naya stock aa gaya hai.\n\n🎁 *Special Offer:* Is weekend order karne par 5% discount aur *Free Home Delivery*!\n\nAbhi reply karke apna rashan book karein.",
      whatsapp_redirect_url: "https://wa.me/919829054321?text=" + encodeURIComponent("Namaste Gupta ji! DukaanMitra Kirana se aapka pasandeeda Basmati Rice fresh stock me hai. Special discount aur Free Home Delivery ke liye abhi reply karein.")
    },
    {
      customer_name: "Verma ji",
      phone: "9829099881",
      target_item: "Fortune Oil & Sugar",
      days_inactive: 38,
      message_text: "Namaste Verma ji! 🙏\n\nDukaanMitra Kirana Store se yaad kiya! Aapka regular rashan (Fortune Kachi Ghani Oil aur Chini) fresh lot me uplabdh hai.\n\n🎁 *Aapke liye khaas:* Purane grahak hone ke naate ₹50 flat cashback agle order par!\n\nWhatsApp par order bhej dein, hum ghar pahuncha denge.",
      whatsapp_redirect_url: "https://wa.me/919829099881?text=" + encodeURIComponent("Namaste Verma ji! DukaanMitra Kirana Store se aapka pasandeeda rashan fresh stock me hai. ₹50 flat discount ke saath Free Home Delivery!")
    }
  ]);

  // Phase 3: Voice Bookkeeping States
  const [voiceInputText, setVoiceInputText] = useState("Mishra ji ne 5kg daal udhaar li");
  const [voiceLogs, setVoiceLogs] = useState<Array<{ text: string; action: string; reply: string; timestamp: string }>>([
    { text: "Sharma ji ne 500 rupaye jama karwaye", action: "Payment Received", reply: "✅ Sharma ji ne ₹500 jama karwaye. Naya baaki balance: ₹250", timestamp: "10:15 AM" },
    { text: "Ramesh ji ko 2 packet surf excel becha cash me", action: "Cash Sale", reply: "✅ Ramesh ji: 2 Surf Excel (₹280) cash sale darj ho gayi.", timestamp: "10:30 AM" }
  ]);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Supplier Mandi Arbitrage
  const [arbitrageItems, setArbitrageItems] = useState<ArbitrageItem[]>([
    { product_name: "Aashirvaad Aata 10kg", your_cost_price: 395, mandi_wholesale_rate: 360, extra_cost_per_unit: 35, unit: "bag", estimated_monthly_volume: 50, estimated_monthly_saving: 1750, recommendation: "Aapka distributor ₹35/bag zyada le raha hai. Mandi rate ₹360 hai." },
    { product_name: "Fortune Kachi Ghani Oil 1L", your_cost_price: 144, mandi_wholesale_rate: 132, extra_cost_per_unit: 12, unit: "pouch", estimated_monthly_volume: 80, estimated_monthly_saving: 960, recommendation: "Edible oil par ₹12/L bachat sambhav hai. Wholesale Mandi switch karein." },
    { product_name: "Toor Dal Premium 1kg", your_cost_price: 162, mandi_wholesale_rate: 145, extra_cost_per_unit: 17, unit: "kg", estimated_monthly_volume: 40, estimated_monthly_saving: 680, recommendation: "Dal par ₹17/kg ki extra bachat! Monthly ₹680 munafa." }
  ]);

  // Phase 4: MMP Subscription States
  const [selectedPlan, setSelectedPlan] = useState<"free" | "silver_299" | "gold_599">("gold_599");

  // OpenWA Gateway Status
  const [openwaStatus, setOpenwaStatus] = useState<"connected" | "connecting" | "offline">("connected");
  const [broadcastProgress, setBroadcastProgress] = useState<string | null>(null);

  const handleMagicButtonClick = () => {
    setIsLoadingInsights(true);
    setTimeout(() => {
      setIsLoadingInsights(false);
      setInsightsLoaded(true);
    }, 700);
  };

  const handleVoiceSubmit = () => {
    if (!voiceInputText.trim()) return;
    setIsProcessingVoice(true);
    setTimeout(() => {
      const isUdhaar = voiceInputText.toLowerCase().includes("udhaar") || voiceInputText.toLowerCase().includes("khata");
      const isJama = voiceInputText.toLowerCase().includes("jama") || voiceInputText.toLowerCase().includes("diye");

      let replyMsg = "";
      let actType = "";

      if (isUdhaar) {
        actType = "Udhaar Recorded (Debit)";
        replyMsg = `✅ ${voiceInputText.split(" ")[0]} ji ke khate me udhaar darj ho gayi hai. Naya udhaar balance update ho gaya.`;
      } else if (isJama) {
        actType = "Payment Received (Credit)";
        replyMsg = `✅ Payment jama kar li gayi hai. Digital Khata me baaki balance kam kar diya gaya.`;
      } else {
        actType = "Cash Sale";
        replyMsg = `✅ Bikri sales_log me safaltapoorvak jud chuki hai.`;
      }

      setVoiceLogs(prev => [
        { text: voiceInputText, action: actType, reply: replyMsg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...prev
      ]);
      setIsProcessingVoice(false);
      setVoiceInputText("");
    }, 600);
  };

  const handleOpenwaBroadcast = () => {
    setBroadcastProgress("Connecting to OpenWA Gateway on http://localhost:2785...");
    setTimeout(() => {
      setBroadcastProgress("Dispatching automated personalized offers to 2 missed customers...");
      setTimeout(() => {
        setBroadcastProgress("✅ Auto-Pilot Success: 2 WhatsApp messages delivered via OpenWA Port 2785!");
        setTimeout(() => setBroadcastProgress(null), 4000);
      }, 1200);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24">
      <Helmet>
        <title>DukaanMitra AI Engineering Ecosystem | Unified Retail Intelligence</title>
        <meta
          name="description"
          content="The complete AI-powered Business Operating System for Bharat Retailers: Phase 1 Core Brain PoC, Phase 2 MVP Magic Button, Phase 3 Voice Bookkeeping & OpenWA, Phase 4 MMP Scale."
        />
      </Helmet>

      {/* Top Engineering Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border-b border-indigo-800/40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-black text-xl italic text-white shadow-lg shadow-indigo-500/30">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight uppercase">DukaanMitra AI Engineering</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Monorepo v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Domain: <span className="text-indigo-300 font-semibold">dukaanmitra.in</span> • Unified Architecture</p>
            </div>
          </div>

          {/* System Health Indicators */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Core Brain API: <strong className="text-emerald-400">:8000</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>OpenWA Gateway: <strong className="text-emerald-400">:2785</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Core Engine: <strong className="text-emerald-400">:3000</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 space-y-10">
        {/* Phase Navigator Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActivePhase("phase1")}
            className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activePhase === "phase1"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Phase 1: Core Brain PoC</span>
          </button>

          <button
            onClick={() => setActivePhase("phase2")}
            className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activePhase === "phase2"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Phase 2: The MVP (Insights)</span>
          </button>

          <button
            onClick={() => setActivePhase("phase3")}
            className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activePhase === "phase3"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Phase 3: The MLP (Voice & WA)</span>
          </button>

          <button
            onClick={() => setActivePhase("phase4")}
            className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              activePhase === "phase4"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Phase 4: MMP (Monetize)</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* PHASE 1: THE CORE BRAIN (BACKEND POC) */}
        {/* ================================================================= */}
        {activePhase === "phase1" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Phase 1: The Core Brain (Backend PoC)
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Bina kisi UI ke, AI ka dimaag (frequency calculation, churn detection, aur 3-mahine ki Kirana sales scanning).
              </p>
            </div>

            {/* 3 Core Tables Architecture */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between text-indigo-400">
                  <h3 className="font-black text-sm uppercase tracking-wider">1. Products (Maal)</h3>
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-400">Inventory levels, reorder threshold, cost & selling prices.</p>
                <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-slate-300 space-y-1">
                  <div>• id: <span className="text-indigo-400">uuid</span></div>
                  <div>• name: <span className="text-emerald-400">"Aashirvaad Aata 10kg"</span></div>
                  <div>• quantity: <span className="text-amber-400">3.0 (reorder at 10)</span></div>
                  <div>• cost_price: <span className="text-slate-400">₹395.0</span></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between text-emerald-400">
                  <h3 className="font-black text-sm uppercase tracking-wider">2. Customers (Grahak)</h3>
                  <Database className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-400">Customer directory, digital udhaar balances, contact info.</p>
                <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-slate-300 space-y-1">
                  <div>• id: <span className="text-indigo-400">uuid</span></div>
                  <div>• name: <span className="text-emerald-400">"Gupta ji"</span></div>
                  <div>• phone: <span className="text-slate-400">"9829054321"</span></div>
                  <div>• current_balance: <span className="text-red-400">₹1,250.0 (Udhaar)</span></div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
                <div className="flex items-center justify-between text-amber-400">
                  <h3 className="font-black text-sm uppercase tracking-wider">3. SalesLog (Bikri)</h3>
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-400">Receipt timestamp history used to calculate visit intervals.</p>
                <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-slate-300 space-y-1">
                  <div>• id: <span className="text-indigo-400">uuid</span></div>
                  <div>• customer_name: <span className="text-emerald-400">"Sharma ji"</span></div>
                  <div>• sale_date: <span className="text-amber-400">"2026-10-14"</span></div>
                  <div>• total_amount: <span className="text-slate-400">₹380.0 (Cash)</span></div>
                </div>
              </div>
            </div>

            {/* Simulated AI Frequency Detection */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    AI Customer Frequency & Inactivity Analyzer
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Scanned 3-months of real Kirana receipt logs</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCustomer("sharma")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCustomer === "sharma" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}
                  >
                    Sharma ji
                  </button>
                  <button
                    onClick={() => setSelectedCustomer("gupta")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCustomer === "gupta" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"}`}
                  >
                    Gupta ji (Missed)
                  </button>
                  <button
                    onClick={() => setSelectedCustomer("verma")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedCustomer === "verma" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"}`}
                  >
                    Verma ji (Active)
                  </button>
                </div>
              </div>

              {selectedCustomer === "sharma" && (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <h4 className="font-black text-white text-base">Sharma ji — Regular Customer</h4>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Visit Interval:</span>
                      <p className="text-emerald-400 font-bold text-sm mt-0.5">Har 20 Din Me</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Top Product:</span>
                      <p className="text-white font-bold text-sm mt-0.5">Aashirvaad Aata 10kg</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Status:</span>
                      <p className="text-emerald-400 font-bold text-sm mt-0.5">Healthy Cycle</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic bg-indigo-950/40 p-3 rounded-lg border border-indigo-900/30">
                    💡 <strong>AI Insight:</strong> "Sharma ji har 20 din me Aashirvaad Aata lene aate hain. Unka pichla visit 18 din pehle tha, agle 2 dino me visit anumaanit hai."
                  </p>
                </div>
              )}

              {selectedCustomer === "gupta" && (
                <div className="bg-slate-950 p-6 rounded-xl border border-red-900/40 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <h4 className="font-black text-white text-base">Gupta ji — Churn Risk / Missed Customer</h4>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Regular Cycle:</span>
                      <p className="text-slate-300 font-bold text-sm mt-0.5">Har 15 Din Me</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Days Inactive:</span>
                      <p className="text-red-400 font-black text-sm mt-0.5">42 Din Se Gayab</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Fav Item:</span>
                      <p className="text-white font-bold text-sm mt-0.5">Basmati Rice 5kg</p>
                    </div>
                  </div>
                  <p className="text-xs text-red-300 italic bg-red-950/40 p-3 rounded-lg border border-red-900/30">
                    ⚠️ <strong>AI Alert:</strong> "Gupta ji pichle 42 din se nahi aaye! Unka regular cycle 15 din ka tha. Anumaan hai ki woh kisi doosri dukaan par shift ho rahe hain. Turant offer bhein!"
                  </p>
                </div>
              )}

              {selectedCustomer === "verma" && (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <h4 className="font-black text-white text-base">Verma ji — High Frequency Buyer</h4>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Visit Interval:</span>
                      <p className="text-emerald-400 font-bold text-sm mt-0.5">Har 7 Din Me (Weekly)</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Top Product:</span>
                      <p className="text-white font-bold text-sm mt-0.5">Amul Milk & Bread</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Status:</span>
                      <p className="text-emerald-400 font-bold text-sm mt-0.5">Active (Visited Today)</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* PHASE 2: THE MVP (AAJ KI AI INSIGHTS & CSV UPLOAD) */}
        {/* ================================================================= */}
        {activePhase === "phase2" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-l-4 border-indigo-500 pl-4 py-1">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                  Phase 2: The MVP (Minimum Viable Product)
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Dukaandar ke liye simple mobile/web dashboard: "Aaj ki AI Insights" Magic Button aur CSV Uploader.
                </p>
              </div>

              {/* The Magic Button */}
              <button
                onClick={handleMagicButtonClick}
                disabled={isLoadingInsights}
                className="relative group px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2.5"
              >
                <Sparkles className={`w-5 h-5 ${isLoadingInsights ? "animate-spin" : "animate-pulse"}`} />
                <span>{isLoadingInsights ? "AI Scanning Store..." : "✨ Aaj Ki AI Insights (Magic Button)"}</span>
              </button>
            </div>

            {/* CSV / Vyapar Import Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-base">Import Existing Sales Data (Vyapar / Khatabook)</h3>
                    <p className="text-xs text-slate-400">Upload your CSV or Excel export to instantly train the AI Core Brain.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload Vyapar CSV</span>
                    <input type="file" accept=".csv" className="hidden" onChange={() => alert("CSV Uploaded! Ingested 45 sales, created 12 customers, and updated product levels.")} />
                  </label>
                </div>
              </div>
            </div>

            {/* Magic Button 3 Lists Display */}
            {insightsLoaded && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* List 1: Urgent Re-order */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <h3 className="font-black text-sm uppercase tracking-wider text-white">1. Urgent Re-Order</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400">
                        {urgentReorders.length} items low
                      </span>
                    </div>

                    <div className="space-y-3">
                      {urgentReorders.map((item, i) => (
                        <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-white">{item.name}</p>
                            <span className="text-[11px] text-slate-400">Stock: <strong className="text-red-400">{item.current_stock} {item.unit}</strong> (Reorder: {item.reorder_level})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">
                              Order +{item.recommended_order_qty}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* List 2: Missed Customers */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-red-400" />
                        <h3 className="font-black text-sm uppercase tracking-wider text-white">2. Missed Customers</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400">
                        {missedCustomers.length} at risk
                      </span>
                    </div>

                    <div className="space-y-3">
                      {missedCustomers.map((c, i) => (
                        <div key={i} className="p-3 bg-slate-950 rounded-xl border border-red-900/30 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <strong className="text-white">{c.customer_name}</strong>
                            <span className="text-[10px] font-black text-red-400 bg-red-950/50 px-2 py-0.5 rounded">
                              {c.days_inactive} din se nahi aaye
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">Regular Cycle: Har {c.usual_cycle_days} din • Fav: {c.top_item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* List 3: Ready Hinglish Offers */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-black text-sm uppercase tracking-wider text-white">3. Ready Offers (Hinglish)</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400">
                        1-Tap WhatsApp
                      </span>
                    </div>

                    <div className="space-y-4">
                      {readyOffers.map((off, i) => (
                        <div key={i} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">For: {off.customer_name}</span>
                            <span className="text-[10px] text-slate-400">{off.phone}</span>
                          </div>

                          <p className="text-[11px] text-slate-300 italic bg-slate-900 p-2.5 rounded-lg border border-slate-800 leading-relaxed whitespace-pre-line line-clamp-3">
                            {off.message_text}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={off.whatsapp_redirect_url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Send via WhatsApp (wa.me)</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* PHASE 3: THE MLP (VOICE BOOKKEEPING & OPENWA AUTOPILOT) */}
        {/* ================================================================= */}
        {activePhase === "phase3" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Phase 3: The MLP (Minimum Lovable Product)
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Zero typing with Voice Bookkeeping, Auto-Pilot WhatsApp marketing via OpenWA (:2785), and Mandi Rate Arbitrage.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Feature A: Voice Bookkeeping */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <h3 className="font-black text-white text-base">Voice Bookkeeping (Zero Typing)</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                    Live
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Dukaandar ko sirf bolna hai: "Mishra ji ne 5kg daal udhaar li" ya "Sharma ji ne 500 rupaye jama kiye". AI khate me entry khud karega.
                </p>

                {/* Speech Input Box */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voiceInputText}
                      onChange={(e) => setVoiceInputText(e.target.value)}
                      placeholder="e.g. Mishra ji ne 5kg daal udhaar li"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleVoiceSubmit}
                      disabled={isProcessingVoice}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
                    >
                      <Mic className="w-4 h-4" />
                      <span>{isProcessingVoice ? "Processing..." : "Bolein"}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="text-slate-500">Quick Test:</span>
                    <button onClick={() => setVoiceInputText("Mishra ji ne 5kg daal udhaar li")} className="text-indigo-400 hover:underline">
                      "Mishra ji ne 5kg daal udhaar li"
                    </button>
                    <span>•</span>
                    <button onClick={() => setVoiceInputText("Sharma ji ne 500 rupaye jama karwaye")} className="text-indigo-400 hover:underline">
                      "Sharma ji ne 500 jama karwaye"
                    </button>
                  </div>
                </div>

                {/* Live Voice Audit Feed */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Recent Voice Ledger Entries:</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {voiceLogs.map((log, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-300">"{log.text}"</span>
                          <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                        </div>
                        <p className="text-emerald-400 font-medium text-[11px]">{log.reply}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feature B: Auto-Pilot WhatsApp via OpenWA (Port 2785) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                      <Radio className="w-4 h-4" />
                    </div>
                    <h3 className="font-black text-white text-base">OpenWA Auto-Pilot Marketing</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                    Port 2785 Ready
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Dukaandar ko manual send dabane ki zaroorat nahi. OpenWA Gateway ke zariye AI khud scheduled time par (jaise Sunday 10 baje) toote hue grahakon ko personalized offer bhejta hai.
                </p>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Target Segment:</span>
                    <span className="font-bold text-white">2 Missed Customers</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Gateway URL:</span>
                    <span className="font-mono text-emerald-400">http://localhost:2785</span>
                  </div>

                  <button
                    onClick={handleOpenwaBroadcast}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Launch Auto-Pilot Broadcast (OpenWA)</span>
                  </button>

                  {broadcastProgress && (
                    <div className="p-2.5 bg-slate-900 rounded-lg border border-emerald-500/30 text-center font-mono text-xs text-emerald-400 animate-pulse">
                      {broadcastProgress}
                    </div>
                  )}
                </div>

                {/* Mandi Rate Arbitrage Teaser */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                      <Coins className="w-4 h-4" />
                      Supplier Mandi Rate Arbitrage
                    </h4>
                    <span className="text-xs font-bold text-emerald-400">Monthly Bachat: ₹3,390</span>
                  </div>
                  <div className="space-y-1.5">
                    {arbitrageItems.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="p-2 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-white font-medium">{item.product_name}</span>
                        <span className="text-emerald-400 font-bold">+₹{item.estimated_monthly_saving}/mo</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* PHASE 4: THE MMP (MONETIZATION & SCALE) */}
        {/* ================================================================= */}
        {activePhase === "phase4" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-l-4 border-indigo-500 pl-4 py-1">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                Phase 4: The MMP (Minimum Marketable Product) & Scale
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Monetization plans, tier enforcement, and multi-tenant scaling on dukaanmitra.in.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <div className={`p-6 rounded-2xl border transition-all ${selectedPlan === "free" ? "bg-slate-900 border-indigo-500 shadow-xl" : "bg-slate-950 border-slate-800"}`}>
                <h3 className="font-black text-white text-lg">Starter Free</h3>
                <p className="text-xs text-slate-400 mt-1">Naye dukaandar ke liye basic testing</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-white">₹0</span>
                  <span className="text-xs text-slate-400"> / mahina</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">✓ Max 50 Sales / month</li>
                  <li className="flex items-center gap-2">✓ Manual WhatsApp Redirect</li>
                  <li className="flex items-center gap-2">✓ Basic Digital Khata</li>
                  <li className="flex items-center gap-2 text-slate-500">✗ Voice Bookkeeping</li>
                  <li className="flex items-center gap-2 text-slate-500">✗ OpenWA Auto-Pilot</li>
                </ul>
                <button
                  onClick={() => setSelectedPlan("free")}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider ${selectedPlan === "free" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}
                >
                  {selectedPlan === "free" ? "Current Plan" : "Select Free"}
                </button>
              </div>

              {/* Silver Plan */}
              <div className={`p-6 rounded-2xl border transition-all ${selectedPlan === "silver_299" ? "bg-slate-900 border-indigo-500 shadow-xl" : "bg-slate-950 border-slate-800"}`}>
                <h3 className="font-black text-white text-lg">Silver Pro</h3>
                <p className="text-xs text-slate-400 mt-1">Medium kirana ke liye digital Munim</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-indigo-400">₹299</span>
                  <span className="text-xs text-slate-400"> / mahina</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">✓ Unlimited Sales Record</li>
                  <li className="flex items-center gap-2">✓ "Aaj ki AI Insights" Button</li>
                  <li className="flex items-center gap-2">✓ CSV & Vyapar Data Importer</li>
                  <li className="flex items-center gap-2">✓ Voice Bookkeeping</li>
                  <li className="flex items-center gap-2 text-slate-500">✗ OpenWA Auto-Pilot</li>
                </ul>
                <button
                  onClick={() => setSelectedPlan("silver_299")}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider ${selectedPlan === "silver_299" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-300"}`}
                >
                  {selectedPlan === "silver_299" ? "Current Plan" : "Upgrade to Silver"}
                </button>
              </div>

              {/* Gold Plan */}
              <div className={`p-6 rounded-2xl border-2 border-amber-500/80 bg-gradient-to-b from-slate-900 to-indigo-950/60 shadow-2xl shadow-amber-500/10 relative`}>
                <div className="absolute -top-3 right-6 bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-0.5 rounded-full">
                  Most Popular
                </div>
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Gold Superintelligence
                </h3>
                <p className="text-xs text-slate-400 mt-1">Full Auto-Pilot Business Operating System</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-amber-400">₹599</span>
                  <span className="text-xs text-slate-400"> / mahina</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  <li className="flex items-center gap-2">✓ Everything in Silver Pro</li>
                  <li className="flex items-center gap-2 font-bold text-emerald-400">✓ OpenWA Auto-Pilot Marketing (:2785)</li>
                  <li className="flex items-center gap-2 font-bold text-amber-400">✓ Mandi Rate Arbitrage (₹3k+ Bachat)</li>
                  <li className="flex items-center gap-2">✓ Multi-Channel WhatsApp Munim</li>
                  <li className="flex items-center gap-2">✓ 24/7 Priority VIP Support</li>
                </ul>
                <button
                  onClick={() => setSelectedPlan("gold_599")}
                  className="w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all"
                >
                  {selectedPlan === "gold_599" ? "Active VIP Tier" : "Activate Gold Tier"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiEngineeringEcosystem;
