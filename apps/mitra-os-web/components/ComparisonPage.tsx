import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { NotFound } from "./NotFound";

interface ComparisonData {
  title: string;
  description: string;
  keywords: string;
  competitorName: string;
  verdict: string;
  bulletPoints: {
    feature: string;
    competitor: string;
    us: string;
  }[];
}

const comparisonLibrary: Record<string, ComparisonData> = {
  busy: {
    title: "DukaanMitra vs Busy | Modern WhatsApp Billing Alternative",
    description:
      "Compare DukaanMitra vs Busy Accounting. See why DukaanMitra's AI-first mobile approach is better for Retailers, Shopkeepers and MSMEs.",
    keywords:
      "dukaanmitra vs busy, busy alternative, accounting software for small shop",
    pros: [
      "Zero setup time",
      "Works via WhatsApp",
      "No desktop required",
      "Free for basics",
    ],
    cons: ["Not for large enterprises", "Mobile-first only"],
  },
  "marg-erp": {
    title: "DukaanMitra vs Marg ERP | Simple AI Billing vs Legacy ERP",
    description:
      "Compare DukaanMitra vs Marg ERP. Find out why modern retailers prefer WhatsApp billing over traditional complex ERPs.",
    keywords:
      "dukaanmitra vs marg erp, marg erp alternative, billing software india",
    pros: [
      "AI automation",
      "Instant WhatsApp bills",
      "No training needed",
      "Zero hardware cost",
    ],
    cons: ["Focuses on small/medium shops", "No complex manufacturing modules"],
  },
  tally: {
    title: "DukaanMitra vs Tally | AI Cloud Munim vs Desktop Tally",
    description:
      "DukaanMitra vs Tally Prime. Discover the easiest way to manage shop accounts on WhatsApp without hiring a full-time accountant.",
    keywords:
      "dukaanmitra vs tally, tally alternative, tally on mobile, gst billing",
    pros: [
      "Cloud-native AI",
      "No accountant required",
      "WhatsApp integrated",
      "Auto-reminders",
    ],
    cons: ["Not for CA audit purposes", "Simpler reporting structure"],
  },

  okcredit: {
    title:
      "DukaanMitra vs OkCredit | Which is better for Inventory Businesss? (2026)",
    description:
      "Thinking of using OkCredit? See why modern Indian inventory business owners are choosing DukaanMitra's WhatsApp-only udhaar & inventory management system instead.",
    keywords:
      "dukaanmitra vs okcredit, okcredit alternative, okcredit app, best udhaar app india",
    competitorName: "OkCredit",
    verdict:
      "OkCredit is a great app for basic udhaar, but DukaanMitra runs entirely on WhatsApp and also helps you capture Google Reviews automatically to grow your shop.",
    bulletPoints: [
      {
        feature: "App Required",
        competitor: "Yes (Mandatory Download)",
        us: "No (Works 100% on WhatsApp)",
      },
      {
        feature: "AI Voice / Text Input",
        competitor: "No",
        us: "Yes (Just type 'Rahul 500 Chini')",
      },
      {
        feature: "Automated Google Reviews",
        competitor: "No",
        us: "Yes (Grows your shop rating)",
      },
      {
        feature: "Learning Curve",
        competitor: "Medium",
        us: "Zero (Everyone knows WhatsApp)",
      },
    ],
  },
  khatabook: {
    title: "DukaanMitra vs KhataBook | The Better Bahi Khata Alternative",
    description:
      "Compare DukaanMitra vs KhataBook. Learn how DukaanMitra's WhatsApp-first AI ledger replaces complex apps with simple text messages.",
    keywords:
      "dukaanmitra vs khatabook, bahi khata app, khatabook alternative, udhaar ledger app india",
    competitorName: "KhataBook",
    verdict:
      "KhataBook is popular, but requires training staff to use their UI. DukaanMitra lets your staff simply send a WhatsApp message to log entries automatically.",
    bulletPoints: [
      {
        feature: "Interface",
        competitor: "Mobile App UI",
        us: "WhatsApp Chat Interface",
      },
      { feature: "Staff Training Required", competitor: "Yes", us: "No" },
      {
        feature: "Phone Storage Used",
        competitor: "High (App Updates)",
        us: "Zero",
      },
      {
        feature: "AI Smart Insights",
        competitor: "Basic",
        us: "Advanced Daily Summaries",
      },
    ],
  },
  vyapar: {
    title: "DukaanMitra vs Vyapar | Simplest Billing Alternative 2026",
    description:
      "Vyapar vs DukaanMitra. Choose the fastest billing and inventory solution. See why small shops prefer our AI Munim over heavy desktop software.",
    keywords:
      "dukaanmitra vs vyapar, vyapar alternative, billing software for small shop india, gst billing software",
    competitorName: "Vyapar",
    verdict:
      "Vyapar is powerful for large distributors, but often too complex for small retailers. DukaanMitra offers instant billing right from WhatsApp.",
    bulletPoints: [
      {
        feature: "Primary Use Case",
        competitor: "Large Distributors & GST",
        us: "Micro-retail & Inventory Businesss",
      },
      {
        feature: "Device",
        competitor: "Desktop / Heavy Mobile App",
        us: "Any phone with WhatsApp",
      },
      {
        feature: "Speed of Entry",
        competitor: "Form filling required",
        us: "< 5 seconds (AI Parsing)",
      },
      {
        feature: "Pricing",
        competitor: "Expensive Yearly Fees",
        us: "Affordable / Free Tier",
      },
    ],
  },
  mybillbook: {
    title: "DukaanMitra vs MyBillBook | Desktop vs WhatsApp Billing",
    description:
      "Compare DukaanMitra and MyBillBook. Find out which app offers the easiest Khata and Billing features for an Indian Inventory Business without needing a computer.",
    keywords:
      "dukaanmitra vs mybillbook, mybillbook alternative, free billing app india",
    competitorName: "MyBillBook",
    verdict:
      "MyBillBook has great thermal printer integrations, but DukaanMitra goes further by giving you a digital AI Munim right inside WhatsApp, perfect for solo shop owners who don't have time to use a desktop.",
    bulletPoints: [
      {
        feature: "App/Desktop Requirement",
        competitor: "High (App heavily relied on)",
        us: "None (We run securely on WhatsApp)",
      },
      {
        feature: "Natural Language Support",
        competitor: "No (Buttons and Menus)",
        us: "Yes (Just speak or type in Hinglish)",
      },
      {
        feature: "Local SEO Automation",
        competitor: "No",
        us: "Yes (Automatically boosts Google rank)",
      },
      { feature: "Learning Curve", competitor: "High", us: "Zero" },
    ],
  },
};

export const ComparisonPage: React.FC = () => {
  const { competitor } = useParams<{ competitor: string }>();
  const data = competitor ? comparisonLibrary[competitor.toLowerCase()] : null;

  if (!data) {
    return <NotFound />;
  }

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.description} />
        <meta name="keywords" content={data.keywords} />
        <link
          rel="canonical"
          href={`https://dukaanmitra.in/compare/${competitor}`}
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 lg:py-32 px-6 lg:px-20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 font-bold uppercase tracking-widest text-xs mb-4">
            Comparisons & Alternatives
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-tight drop-shadow-lg">
            DukaanMitra vs {data.competitorName}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium">
            Find out why Indian shopkeepers are upgrading to the{" "}
            <span className="text-white font-bold pb-1 border-b-2 border-emerald-500">
              WhatsApp-first
            </span>{" "}
            approach.
          </p>
        </div>
      </section>

      {/* Why DukaanMitra? */}
      <section className="py-20 px-6 lg:px-20 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center text-center space-y-6">
            <span className="text-5xl">🏆</span>
            <h2 className="text-3xl font-black italic tracking-tight text-slate-900 uppercase">
              The Honest Verdict
            </h2>
            <p className="text-xl text-slate-600 font-medium max-w-3xl leading-relaxed">
              "{data.verdict}"
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl shadow-2xl border border-slate-200 bg-white">
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-900 text-white uppercase font-black tracking-widest text-sm">
                  <tr>
                    <th className="p-6">Feature Focus</th>
                    <th className="p-6 opacity-60 line-through decoration-red-500 decoration-4">
                      {data.competitorName}
                    </th>
                    <th className="p-6 bg-emerald-600 text-white">
                      DukaanMitra
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-lg">
                  {data.bulletPoints.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-6 font-bold text-slate-900">
                        {row.feature}
                      </td>
                      <td className="p-6 text-slate-500 font-medium">
                        {row.competitor}
                      </td>
                      <td className="p-6 text-emerald-700 font-black italic tracking-tight">
                        {row.us}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Layer */}
      <section className="py-32 px-6 bg-slate-900 text-center relative overflow-hidden">
        <div className="absolute inset-0  opacity-10 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-indigo-600/30 italic">
            Join the 10,000+ Shop Revolution
          </div>
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
            Ditch The Heavy Apps. <br />
            <span className="text-emerald-400">Join the Future.</span>
          </h2>
          <p className="text-xl md:text-2xl font-bold text-slate-400 italic max-w-2xl mx-auto">
            Experience the "JanSunwai 2.0" codenamed Munim AI. Simply WhatsApp
            to log, or join our early access list for elite features.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => {
                // Navigate to landing page waitlist
                window.location.href = "/#waitlist";
              }}
              className="w-full sm:w-auto px-12 py-6 bg-white text-indigo-900 rounded-[2rem] font-black tracking-widest uppercase hover:bg-emerald-400 hover:text-slate-900 transition-all shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] active:shadow-none active:translate-x-1 active:translate-y-1 italic"
            >
              Get Early Access ➔
            </button>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden"
                >
                  <img
                    loading="lazy"
                    src={`/assets/avatars/user${(i % 3) + 1}.svg`}
                    alt="User"
                  />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black italic">
                +12k
              </div>
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Trusted by Bharat's Retailers since 2024
          </p>
        </div>
      </section>
    </div>
  );
};
