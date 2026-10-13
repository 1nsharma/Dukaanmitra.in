import React from "react";
import { Helmet } from "react-helmet-async";

const Features: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <Helmet>
        <title>
          Features | Best Inventory Management App India | DukaanMitra
        </title>
        <meta
          name="description"
          content="Explore powerful features like AI retail analytics, sales management tools, and the best inventory software for small shops in India. Designed for Indian दुकानदार."
        />
        <meta
          name="keywords"
          content="inventory management app india, AI retail analytics, sales management tool, best inventory software for small shops india"
        />
        <link rel="canonical" href="https://dukaanmitra.in/features" />
      </Helmet>
      <h1 className="text-4xl font-black text-slate-900 mb-8 italic tracking-tighter uppercase">
        AI Retail Features
      </h1>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "WhatsApp Billing",
            desc: "Send bills directly via WhatsApp message.",
            icon: "💬",
          },
          {
            title: "Inventory Tracking",
            desc: "Real-time stock alerts and management.",
            icon: "📦",
          },
          {
            title: "Sales Analytics",
            desc: "Deep insights into your shop's performance.",
            icon: "📊",
          },
          {
            title: "Udhaar Recovery",
            desc: "Automated reminders for pending payments.",
            icon: "💰",
          },
          {
            title: "Customer Loyalty",
            desc: "Run rewards programs effortlessly.",
            icon: "✨",
          },
          {
            title: "Multi-User Access",
            desc: "Manage your shop with your staff.",
            icon: "👥",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all"
          >
            <div className="text-4xl mb-4">{f.icon}</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              {f.title}
            </h3>
            <p className="text-slate-500 font-medium">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
