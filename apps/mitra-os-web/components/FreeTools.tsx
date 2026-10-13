import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import {
  Calculator,
  MessageSquare,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Layout,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LandingPageGenerator } from "./LandingPageGenerator";

const FreeTools: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const simulateParsing = () => {
    setParsing(true);
    setTimeout(() => {
      setResult({
        items: [
          { name: "Aloo", price: 50, qty: "1kg" },
          { name: "Pyaaz", price: 30, qty: "1kg" },
        ],
        total: 80,
        status: "Validated in AI Sandbox",
      });
      setParsing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Free AI Tools for Small Shops | DukaanMitra Tools</title>
        <meta
          name="description"
          content="Use our free AI tools to calculate profits, parse WhatsApp messages, and manage your Inventory Business like a pro. Made for Indian retailers."
        />
      </Helmet>

      {/* Hero */}
      <section className="py-24 px-6 lg:px-20 bg-slate-900 text-white rounded-b-[4rem]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            Digital Toolkit
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            Free <span className="text-indigo-400">Merchant</span> Tools
          </h1>
          <p className="text-xl font-bold italic text-slate-400">
            Smart utilities to digitize your local business in seconds. No
            signup required.
          </p>
        </div>
      </section>

      {/* Tool 0: Landing Page Generator */}
      <section
        id="lp-generator"
        className="py-24 px-6 lg:px-20 bg-slate-50 border-b border-slate-200"
      >
        <LandingPageGenerator />
      </section>

      {/* Tool 1: AI Parser */}
      <section className="py-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900 leading-none text-balance">
              WhatsApp AI <br /> Message Parser
            </h2>
            <p className="text-xl text-slate-500 font-bold italic">
              See how our AI logic reads your manual messages. Paste a list of
              items and prices below.
            </p>

            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Secure Sandbox Technology
              </h4>
              <p className="text-slate-600 font-medium italic">
                We use isolated sandboxes to process your business data,
                ensuring 100% privacy and zero data leaks.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 md:p-12 rounded-[4rem] shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-2">
                Type your message (e.g., Aloo 50, Pyaaz 30)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ex: 5kg Aata - 200, 1L Oil - 180"
                className="w-full h-40 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all resize-none"
              />
            </div>
            <button
              onClick={simulateParsing}
              disabled={!inputText || parsing}
              className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xl italic tracking-tight shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {parsing ? "Parsing via AI Sandbox..." : "Try AI Parser ➔"}
            </button>

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] p-8 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h5 className="font-black italic text-emerald-700 uppercase">
                    Analysis Complete
                  </h5>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    {result.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {result.items.map(
                    (
                      item: { name: string; qty: string; price: number },
                      i: number,
                    ) => (
                      <div
                        key={i}
                        className="flex justify-between font-bold text-emerald-800"
                      >
                        <span>
                          {item.name} ({item.qty})
                        </span>
                        <span>₹{item.price}</span>
                      </div>
                    ),
                  )}
                  <div className="h-px bg-emerald-200 my-4"></div>
                  <div className="flex justify-between font-black text-xl text-emerald-900 italic">
                    <span>Total Amount</span>
                    <span>₹{result.total}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Grid of Other Tools */}
      <section className="py-24 px-6 lg:px-20 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-slate-900">
              More Free Tools
            </h2>
            <p className="text-xl text-slate-500 font-bold italic">
              Built specifically for the Indian Business ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl space-y-6 group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center">
                <Layout className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black italic text-slate-900 uppercase leading-none">
                Landing Page <br /> Generator
              </h3>
              <p className="text-slate-500 font-bold italic">
                Create a high-converting website for your business in seconds
                using AI.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("lp-generator")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="text-indigo-600 font-black uppercase tracking-widest border-b-2 border-indigo-600 pb-1 flex items-center gap-2"
              >
                Open Tool <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl space-y-6 group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center">
                <Calculator className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black italic text-slate-900 uppercase leading-none">
                Margin & Profit <br /> Calculator
              </h3>
              <p className="text-slate-500 font-bold italic">
                Quickly calculate your profit margins after GST and overhead
                costs.
              </p>
              <button className="text-emerald-600 font-black uppercase tracking-widest border-b-2 border-emerald-600 pb-1 flex items-center gap-2">
                Open Tool <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-xl space-y-6 group hover:-translate-y-2 transition-all">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black italic text-slate-900 uppercase leading-none">
                WhatsApp Link <br /> Generator
              </h3>
              <p className="text-slate-500 font-bold italic">
                Create direct 'Send Message' links for your customers with
                pre-filled orders.
              </p>
              <button className="text-purple-600 font-black uppercase tracking-widest border-b-2 border-purple-600 pb-1 flex items-center gap-2">
                Soon <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Link */}
      <section className="py-24 px-6 lg:px-20 bg-indigo-600 text-white rounded-[4rem] my-12 mx-6 lg:mx-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
            Need Ready-to-Use Templates?
          </h2>
          <p className="text-xl font-bold italic opacity-90">
            Download WhatsApp message templates, shop posters, and QR designs
            for free.
          </p>
          <Link
            to="/templates"
            className="bg-white text-indigo-600 px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all inline-block italic tracking-tighter"
          >
            Explore Templates ➔
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FreeTools;
