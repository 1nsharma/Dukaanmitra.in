import React from "react";
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  Package,
  Printer,
  Clock,
  PieChart,
  Users,
  Megaphone,
  Brain
} from "lucide-react";

export const WhatsAppMockup = () => (
  <div className="bg-[#efe7de] rounded-[2rem] flex flex-col h-full min-h-[400px] overflow-hidden w-full text-sm shadow-xl border-4 border-slate-800">
    <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 relative z-10 shadow-md">
      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-lg border-2 border-white/20">
        M
      </div>
      <div>
        <div className="font-bold text-base">Munim AI</div>
        <div className="text-xs text-white/80">online</div>
      </div>
    </div>
    <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-[url('https://i.ibb.co/3s1f9b3/whatsapp-bg.png')] bg-cover">
      <div className="self-end bg-[#dcf8c6] text-slate-800 p-3 rounded-xl rounded-tr-none max-w-[85%] shadow-sm font-medium">
        Ramesh 40 Chini udhaar
        <div className="text-[10px] text-right text-slate-500 mt-1">
          10:42 AM
        </div>
      </div>
      <div className="self-start bg-white text-slate-800 p-3 rounded-xl rounded-tl-none max-w-[85%] shadow-sm leading-relaxed">
        <span className="text-emerald-600 font-bold">✓ Customer Detected:</span>{" "}
        Ramesh
        <br />
        <span className="text-emerald-600 font-bold">✓ Item:</span> Sugar
        (Chini)
        <br />
        <span className="text-emerald-600 font-bold">✓ Action:</span> ₹40 Udhaar
        Added
        <br />
        <span className="text-slate-500 text-xs mt-2 block border-t pt-2">
          WhatsApp Receipt sent to customer securely.
        </span>
        <div className="text-[10px] text-right text-slate-500 mt-1">
          10:42 AM
        </div>
      </div>
    </div>
    <div className="bg-[#f0f0f0] p-3 flex items-center gap-2">
      <div className="flex-1 bg-white rounded-full px-4 py-2 text-slate-400 text-sm">
        Message
      </div>
      <div className="w-10 h-10 bg-[#00897b] rounded-full flex items-center justify-center text-white">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
        </svg>
      </div>
    </div>
  </div>
);

export const DashboardMockup = () => (
  <div className="bg-slate-900 rounded-[2rem] flex flex-col h-full min-h-[400px] overflow-hidden w-full text-sm shadow-xl border-4 border-slate-800 p-6 text-white font-sans">
    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="text-xl font-black italic tracking-tighter">
          Business Overview
        </div>
        <div className="text-slate-400 text-xs mt-1">
          Real-time Retail Analytics
        </div>
      </div>
      <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
        Live
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-slate-800 p-4 rounded-2xl border border-white/5">
        <div className="text-slate-400 text-xs mb-1 flex justify-between items-center">
          Today's Sales <DollarSign size={14} className="text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-white">₹12,450</div>
        <div className="text-emerald-400 text-[10px] mt-1 flex items-center gap-1">
          <TrendingUp size={10} /> +14% vs yesterday
        </div>
      </div>
      <div className="bg-slate-800 p-4 rounded-2xl border border-white/5">
        <div className="text-slate-400 text-xs mb-1 flex justify-between items-center">
          Pending Udhaar <BarChart2 size={14} className="text-rose-400" />
        </div>
        <div className="text-2xl font-bold text-white">₹3,200</div>
        <div className="text-rose-400 text-[10px] mt-1">From 12 customers</div>
      </div>
    </div>
    <div className="flex-1 bg-slate-800 rounded-2xl border border-white/5 p-4 flex flex-col justify-end relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10" />
      <div className="text-xs text-slate-400 mb-2 relative z-20">
        Recent Transactions
      </div>
      <div className="space-y-2 relative z-20">
        {[
          {
            name: "Ramesh",
            amt: "₹40",
            type: "Udhaar",
            color: "text-rose-400",
            bg: "bg-rose-500/10",
          },
          {
            name: "Suresh",
            amt: "₹150",
            type: "Paid",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            name: "Unknown",
            amt: "₹420",
            type: "Paid",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
        ].map((t, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-2 rounded-xl bg-slate-900 border border-white/5"
          >
            <div className="font-medium text-sm">{t.name}</div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${t.bg} ${t.color}`}
              >
                {t.type}
              </span>
              <span className="font-bold text-sm">{t.amt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const InventoryMockup = () => (
  <div className="bg-slate-900 rounded-[2rem] flex flex-col h-full min-h-[400px] overflow-hidden w-full text-sm shadow-xl border-4 border-slate-800 p-6 text-white font-sans">
    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
          <Package size={20} className="text-amber-400" /> Inventory Engine
        </div>
        <div className="text-slate-400 text-xs mt-1">
          Auto Stock Sync & Prediction
        </div>
      </div>
      <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
        AI Managed
      </div>
    </div>
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-slate-800 p-3 rounded-xl border border-white/5 text-center">
        <div className="text-slate-400 text-[10px] uppercase font-black">Total Items</div>
        <div className="text-lg font-bold mt-1">1,240</div>
      </div>
      <div className="bg-[#f43f5e]/10 p-3 rounded-xl border border-rose-500/20 text-center">
        <div className="text-rose-400 text-[10px] uppercase font-black">Low Stock</div>
        <div className="text-lg font-bold text-rose-400 mt-1">5 Items</div>
      </div>
      <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-center">
        <div className="text-emerald-400 text-[10px] uppercase font-black">Velocity</div>
        <div className="text-lg font-bold text-emerald-400 mt-1">+24%</div>
      </div>
    </div>
    <div className="flex-1 bg-slate-800/60 rounded-2xl p-4 border border-white/5">
      <p className="text-xs font-black uppercase text-slate-400 mb-3 tracking-widest">Active Stock Alert Stack</p>
      <div className="space-y-2">
        {[
          { name: "Aashirvaad Atta 10kg", stock: "2 Left", status: "Critical Out-of-Stock Risk", color: "text-rose-400", bg: "bg-rose-500/10" },
          { name: "Amul Butter 500g", stock: "4 Left", status: "Low Stock Triggered", color: "text-amber-400", bg: "bg-amber-500/10" },
          { name: "Tata Salt 1kg", stock: "10 Left", status: "Optimal level", color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-900 border border-white/5">
            <div>
              <div className="font-bold text-xs">{item.name}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.status}</div>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.bg} ${item.color}`}>
              {item.stock}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const BillingMockup = () => (
  <div className="bg-slate-900 rounded-[2rem] flex flex-col h-full min-h-[400px] overflow-hidden w-full text-sm shadow-xl border-4 border-slate-800 p-6 text-white font-sans">
    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
          <Printer size={20} className="text-indigo-400" /> GST Billing Module
        </div>
        <div className="text-slate-400 text-xs mt-1">
          Instant Invoice generation
        </div>
      </div>
      <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
        Ready
      </div>
    </div>
    <div className="bg-slate-800 p-4 rounded-2xl border border-white/5 space-y-3 mb-4">
      <div className="flex justify-between text-xs border-b border-white/5 pb-2">
        <span className="text-slate-400">Invoice No: <strong className="text-white">#DM-2026-904</strong></span>
        <span className="text-slate-400">Customer: <strong className="text-white">Ramesh Singh</strong></span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between font-medium">
          <span>1. Basmati Rice (5kg)</span>
          <span>₹450.00</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>2. Fortune Mustard Oil (1L)</span>
          <span>₹180.00</span>
        </div>
        <div className="flex justify-between font-medium text-slate-400">
          <span>CGST (2.5%) + SGST (2.5%)</span>
          <span>₹31.50</span>
        </div>
      </div>
      <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-black">
        <span>GRAND TOTAL</span>
        <span className="text-emerald-400">₹661.50</span>
      </div>
    </div>
    <div className="bg-indigo-600/10 border border-indigo-500/20 p-3 rounded-xl flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white shrink-0">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12.012 2.25c-5.385 0-9.75 4.365-9.75 9.75 0 1.725.447 3.345 1.233 4.757l-.984 3.593 3.682-.966c1.365.744 2.922 1.173 4.582 1.173 5.385 0 9.762-4.363 9.762-9.75s-4.377-9.75-9.762-9.75z" />
        </svg>
      </div>
      <div className="text-[11px] text-slate-300">
        PDF Invoice sent automatically to Ramesh's WhatsApp (+91 98765 43210).
      </div>
    </div>
  </div>
);

export const UdhaarMockup = () => (
  <div className="bg-slate-900 rounded-[2rem] flex flex-col h-full min-h-[400px] overflow-hidden w-full text-sm shadow-xl border-4 border-slate-800 p-6 text-white font-sans">
    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
          <Clock size={20} className="text-rose-400" /> Udhaar Recovery Ledger
        </div>
        <div className="text-slate-400 text-xs mt-1">
          Automated friendly UPI reminders
        </div>
      </div>
      <div className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 animate-pulse">
        Action Needed
      </div>
    </div>
    <div className="space-y-3 mb-4">
      {[
        { name: "Suresh Kumar", amount: "₹2,500", days: "18 Days Overdue", alert: "Sending Reminders" },
        { name: "Amit Verma", amount: "₹1,200", days: "5 Days Overdue", alert: "Scheduled Tomorrow" },
      ].map((customer, i) => (
        <div key={i} className="bg-slate-800 p-4 rounded-xl border border-white/5 flex justify-between items-center">
          <div>
            <div className="font-bold text-sm">{customer.name}</div>
            <div className="text-xs text-rose-400 font-semibold mt-0.5">{customer.days}</div>
          </div>
          <div className="text-right">
            <div className="font-black text-sm text-white">{customer.amount}</div>
            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full mt-1 inline-block font-black uppercase">UPI Remind</span>
          </div>
        </div>
      ))}
    </div>
    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
      <div className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Reminder Preview Message:</div>
      <p className="text-slate-300 leading-normal italic">
        "Namaste Suresh ji, your pending balance at Sharma Groceries is ₹2,500. Click here to clear instantly using any UPI app: <span className="text-indigo-400 underline">paytm.me/sharma/2500</span>"
      </p>
    </div>
  </div>
);

export const AnalyticsMockup = () => (
  <div className="bg-slate-900 rounded-[2rem] flex flex-col h-full min-h-[400px] overflow-hidden w-full text-sm shadow-xl border-4 border-slate-800 p-6 text-white font-sans">
    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
          <PieChart size={20} className="text-emerald-400" /> Business Intelligence
        </div>
        <div className="text-slate-400 text-xs mt-1">
          EOD Analytical Insights
        </div>
      </div>
      <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
        Live Logs
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="bg-slate-800 p-3 rounded-xl border border-white/5">
        <div className="text-slate-500 text-[9px] font-black uppercase">Top Category</div>
        <div className="text-base font-bold text-white mt-1">Groceries</div>
        <span className="text-emerald-400 text-[9px] font-bold">52% of sales</span>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-white/5">
        <div className="text-slate-500 text-[9px] font-black uppercase">Repeat Customers</div>
        <div className="text-base font-bold text-white mt-1">78%</div>
        <span className="text-emerald-400 text-[9px] font-bold">LTV Outstanding</span>
      </div>
    </div>
    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl space-y-2">
      <div className="flex items-center gap-2 text-emerald-400">
        <Brain size={16} />
        <span className="text-xs font-black uppercase tracking-wider">AI Recommendation</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed font-semibold italic">
        "Your highest velocity item is Mother Dairy Milk (500ml). Sales surge between 7 AM to 9 AM. Stock is predicted to run out tomorrow at 8 AM. Raise reorder draft?"
      </p>
    </div>
  </div>
);

export const CRMMockup = () => (
  <div className="bg-slate-900 rounded-[2rem] flex flex-col h-full min-h-[400px] overflow-hidden w-full text-sm shadow-xl border-4 border-slate-800 p-6 text-white font-sans">
    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
          <Users size={20} className="text-purple-400" /> WhatsApp CRM
        </div>
        <div className="text-slate-400 text-xs mt-1">
          Segmented Customer Retention
        </div>
      </div>
      <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
        Automated
      </div>
    </div>
    <div className="space-y-3 mb-4">
      {[
        { segment: "Inactive Customers (>30 days)", count: "24 Customers", promo: "Send 10% Off Nudge" },
        { segment: "Premium Loyalty Tier", count: "48 Customers", promo: "Send Diwali Gift Pass" },
      ].map((seg, i) => (
        <div key={i} className="bg-slate-800 p-4 rounded-xl border border-white/5 flex justify-between items-center">
          <div>
            <div className="font-bold text-xs">{seg.segment}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{seg.count}</div>
          </div>
          <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors">
            {seg.promo.split(" ")[1]}
          </button>
        </div>
      ))}
    </div>
    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0 text-emerald-400">
        <Megaphone size={18} />
      </div>
      <div className="text-[10px] text-slate-400 font-medium">
        Feedback rating is 4.8★. Automated WhatsApp campaigns have triggered 142 Google reviews this month!
      </div>
    </div>
  </div>
);

export const RetailAiMockup = () => (
  <div className="bg-slate-900 rounded-[2rem] flex flex-col h-full min-h-[400px] overflow-hidden w-full text-sm shadow-xl border-4 border-slate-800 p-6 text-white font-sans">
    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="text-xl font-black italic tracking-tighter flex items-center gap-2">
          <Brain size={20} className="text-indigo-400" /> DukaanMitra AI OS
        </div>
        <div className="text-slate-400 text-xs mt-1">
          Coordinated Agent Orchestrator
        </div>
      </div>
      <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
        v2.0 Active
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-slate-800 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <div className="text-xs font-bold">Billing Agent</div>
          <span className="text-[9px] text-slate-500">Auto Invoice Active</span>
        </div>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <div>
          <div className="text-xs font-bold">Inventory Agent</div>
          <span className="text-[9px] text-slate-500">Stock Alerts Syncing</span>
        </div>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <div>
          <div className="text-xs font-bold">CRM Nudge Agent</div>
          <span className="text-[9px] text-slate-500">Google Review Engine</span>
        </div>
      </div>
      <div className="bg-slate-800 p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <div>
          <div className="text-xs font-bold">Finance Agent</div>
          <span className="text-[9px] text-slate-500">Ledger Compliance Audit</span>
        </div>
      </div>
    </div>
    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
      <div className="text-indigo-400 text-[10px] font-black uppercase">Live Multi-Agent Orchestrator Feed:</div>
      <p className="text-slate-400 text-[11px] leading-normal font-mono">
        [SYSTEM] WhatsApp purchase event parsing... Completed in 14ms.<br />
        [BILLING_AGENT] Extracted Atta ₹450, calculated taxes. Invoice PDF created.<br />
        [INVENTORY_AGENT] Reduced stock level. Nudge sent to CRM segment list.
      </p>
    </div>
  </div>
);

export const BlogThumbnail = ({ slug: _slug }: { slug?: string }) => (
  <div className="bg-indigo-900 w-full h-full min-h-[200px] flex items-center justify-center p-8 relative overflow-hidden rounded-[2rem]">
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
    <div className="relative z-10 text-white flex flex-col items-center text-center space-y-4">
      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
        <span className="text-3xl font-black italic">D</span>
      </div>
      <p className="font-black italic tracking-widest uppercase opacity-50 text-[10px]">
        DukaanMitra OS
      </p>
    </div>
  </div>
);
