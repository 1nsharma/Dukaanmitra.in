import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const CaseStudies: React.FC = () => {
  const stories = [
    {
      shop: "Gupta General Store",
      location: "Kanpur, UP",
      achievement: "24% Udhaar Recovery Increase",
      owner: "Suresh Gupta",
      story:
        "Suresh used to spend 2 hours every Sunday calling customers for pending dues. After switching to DukaanMitra, our AI sends polite WhatsApp reminders. In just 3 months, his capital flow improved by 24%.",
      tags: ["Udhaar Recovery", "WhatsApp Automation"],
    },
    {
      shop: "Krishna Sweets & Bakers",
      location: "Lucknow, UP",
      achievement: "2x Online Orders via WhatsApp",
      owner: "Rajesh Kumar",
      story:
        "Rajesh was losing customers to Zomato's 25% commission. We helped him set up a WhatsApp catalogue linked to DukaanMitra. He now takes 40+ direct orders daily with zero commission.",
      tags: ["Direct Sales", "Catalogue Management"],
    },
    {
      shop: "Jain Provision Store",
      location: "New Delhi",
      achievement: "Zero Manual Errors",
      owner: "Mohit Jain",
      story:
        "Managing 1500+ SKUs manually was a nightmare. Mohit now uses our voice-to-text stock tracking. His inventory accuracy is now 99.9%, saving him 15k INR monthly in losses.",
      tags: ["Inventory AI", "Voice-to-Text"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>
          Case Studies | DukaanMitra - Real Success Stories of Indian Retailers
        </title>
        <meta
          name="description"
          content="See how Inventory Businesss and small retail shops in India are growing with DukaanMitra. Real results, real growth, real trust."
        />
      </Helmet>

      {/* Hero */}
      <section className="py-24 px-6 lg:px-20 bg-emerald-500 text-white rounded-b-[4rem]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
              Real Growth <br />
              <span className="text-slate-900">Real Proof</span>
            </h1>
            <p className="text-2xl font-bold italic opacity-90">
              How traditional shop owners are beating the competition using
              DukaanMitra AI.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Recovery", value: "24%+" },
              { label: "Efficiency", value: "3x" },
              { label: "Commission", value: "0%" },
              { label: "Accuracy", value: "99.9%" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20"
              >
                <p className="text-4xl font-black italic mb-1">{stat.value}</p>
                <p className="text-xs uppercase font-black tracking-widest">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 flex flex-col md:flex-row gap-12 items-start"
            >
              <div className="md:w-1/3 space-y-4">
                <h3 className="text-3xl font-black italic text-slate-900 uppercase leading-none">
                  {story.shop}
                </h3>
                <p className="text-emerald-600 font-bold uppercase tracking-wider text-sm">
                  {story.location}
                </p>
                <div className="text-indigo-600 font-black text-2xl italic tracking-tight bg-white p-6 rounded-3xl border border-slate-100">
                  {story.achievement}
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                  {story.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="bg-slate-200 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="md:w-2/3 space-y-8">
                <div className="text-6xl text-slate-200 font-black italic">
                  "
                </div>
                <p className="text-2xl font-black italic text-slate-700 leading-relaxed">
                  {story.story}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white font-black">
                    {story.owner.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black italic text-slate-900">
                      {story.owner}
                    </p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      Shop Owner
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-24 px-6 lg:px-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
            Become our next success story
          </h2>
          <Link
            to="/services"
            className="bg-emerald-500 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all italic tracking-tighter inline-block"
          >
            Check Services ➔
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
