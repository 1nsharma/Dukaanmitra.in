import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import {
  MessageSquare,
  Scan,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Scan className="w-8 h-8" />,
      title: "1. Scan & Track",
      description:
        "Simply scan your inventory or send a text message to your DukaanMitra AI number on WhatsApp. It reads your manual notes instantly.",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "2. WhatsApp Ledger",
      description:
        "Every sale, purchase, and udhaar is automatically recorded in a smart digital ledger. No complicated apps, just your favorite chat screen.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "3. Smart Reminders",
      description:
        "DukaanMitra identifies pending payments and sends polite, automated reminders to your customers, helping you recover 24% more udhaar.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "4. Business Growth",
      description:
        "Get weekly insights on your top-selling products and loyal customers. Use our AI to run WhatsApp marketing campaigns for free.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>How it Works | DukaanMitra - AI WhatsApp Shop Management</title>
        <meta
          name="description"
          content="Learn how DukaanMitra transforms your traditional Inventory Business into a digital shop using just WhatsApp and AI. 4 simple steps to growth."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-24 px-6 lg:px-20 bg-slate-900 text-white text-center rounded-b-[4rem]">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none"
          >
            Digital Dukaan in <br />
            <span className="text-indigo-400">4 Simple Steps</span>
          </motion.h1>
          <p className="text-xl font-bold italic text-slate-400">
            Traditional bahi-khata to modern AI shop management. Zero training
            required.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center text-center space-y-6 relative group hover:-translate-y-2 transition-transform"
            >
              <div className="absolute -top-6 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                {step.icon}
              </div>
              <h3 className="text-2xl font-black italic text-slate-900 uppercase pt-6">
                {step.title}
              </h3>
              <p className="text-slate-500 font-bold italic leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-6 lg:px-20 bg-white">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900">
              Old Way vs. Smart Way
            </h2>
            <p className="text-xl text-slate-500 font-bold italic">
              Why 2000+ Indian merchants switched to DukaanMitra
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 space-y-8 opacity-50">
              <h3 className="text-3xl font-black italic text-slate-400 uppercase">
                Traditional Way
              </h3>
              <ul className="space-y-4 text-slate-500 font-bold italic">
                <li>❌ Manual Bahi-Khata entry (1 hour daily)</li>
                <li>❌ Calling customers for udhaar (Awkward)</li>
                <li>❌ No backup if register gets lost</li>
                <li>❌ High commission on Swiggy/Zomato</li>
              </ul>
            </div>
            <div className="bg-indigo-600 p-12 rounded-[4rem] text-white shadow-2xl shadow-indigo-200 space-y-8">
              <h3 className="text-3xl font-black italic uppercase">
                The DukaanMitra Way
              </h3>
              <ul className="space-y-4 font-bold italic text-indigo-100">
                <li>✅ 5-second WhatsApp tracking</li>
                <li>✅ Automated polite payment alerts</li>
                <li>✅ 100% Secure cloud cloud cloud backup</li>
                <li>✅ Direct WhatsApp orders (0% Commission)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
            Ready to Start?
          </h2>
          <p className="text-xl font-bold italic opacity-70">
            Join the digital retail revolution in India. Setup takes 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/pricing"
              className="bg-indigo-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all italic tracking-tighter"
            >
              See Plans ➔
            </Link>
            <Link
              to="/contact"
              className="bg-white text-slate-900 px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all italic tracking-tighter"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
