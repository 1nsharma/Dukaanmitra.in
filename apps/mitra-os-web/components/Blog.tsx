import { BlogThumbnail } from "./ui/Mockups";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const Blog: React.FC = () => {
  const posts = [
    {
      title:
        "WhatsApp se Khata Kaise Likhe — Zero Install AI Business Accounting (2026)",
      slug: "whatsapp-se-khata-kaise-likhe-guide",
      excerpt:
        "Notebook khone ka darr rehta hai, aur calculations me galti hone par nuksan aapka hi hota hai. Learn how to manage your dukaan easily from WhatsApp.",
      date: "May 30, 2026",
      tag: "Guide",
    },
    {
      title: "The Future of Retail in India's Tier 2 Cities",
      slug: "future-of-retail-tier-2-india",
      excerpt:
        "How cities like Kanpur, Indore, and Jaipur are leading the digital retail revolution using WhatsApp AI and smart credit tracking.",
      date: "May 28, 2026",
      tag: "Industry Deep Dive",
    },
    {
      title: "Bahi Khata AI se Kaise Manage Karein - Complete Explainer",
      slug: "bahi-khata-ai-se-kaise-manage-karein",
      excerpt:
        "Samajhiye Artificial Intelligence (AI) kaise aapke WhatsApp message ('Aman ne 200 pay kiye') ko automatically digital ledger me badalta hai.",
      date: "May 27, 2026",
      tag: "AI Explainer",
    },
    {
      title: "WhatsApp Munim vs Human Munim: Cost & Efficiency Comparison",
      slug: "whatsapp-munim-vs-human-munim",
      excerpt:
        "Ek human accountant aapko mahine ka ₹10,000 cost karta hai. Dekhiye kaise AI Munim aapko ₹0 me 100x speed se accuracy deta hai.",
      date: "May 26, 2026",
      tag: "Comparison",
    },
    {
      title: "Kanpur me shop ko online kaise laaye - The Ultimate Guide",
      slug: "kanpur-me-shop-ko-online-kaise-laaye",
      excerpt:
        "Step by step process to get your Kanpur-based physical shop online using Google Business and WhatsApp. No apps needed.",
      date: "April 18, 2026",
      tag: "Local SEO",
    },
    {
      title: "How DukaanMitra Uses AI Sandboxing to Secure Your Shop Data",
      slug: "ai-sandboxing-secure-shop-data",
      excerpt:
        "Technical deep-dive into how we use Vercel Sandbox technology to ensure your private bahi-khata data never leaks. Engineering excellence for Bharat.",
      date: "April 18, 2026",
      tag: "Security",
    },
    {
      title: "Udhaar ka hisaab kaise rakhe? (Manual vs Digital Guide 2026)",
      slug: "udhaar-ka-hisaab-kaise-rakhe",
      excerpt:
        "Stop losing money in pending payments. Learn the best way to manage your 'Khaata' and get paid 24% faster using WhatsApp automation.",
      date: "April 18, 2026",
      tag: "Operations",
    },
    {
      title: "inventory business Daily Sales System - How to track profit?",
      slug: "Business-shop-daily-sales-system",
      excerpt:
        "A simple guide to tracking your daily sales and calculating net profit without a calculator. Use AI to automate your bookkeeping.",
      date: "April 17, 2026",
      tag: "Growth",
    },
    {
      title: "Best Billing Software for Small Shop (Less than 10k budget)",
      slug: "best-billing-software-for-small-shop",
      excerpt:
        "Comparing top POS systems vs WhatsApp-based AI billing. Find the right balance between cost and speed for your dukaan.",
      date: "April 17, 2026",
      tag: "Tech",
    },
    {
      title: "Google Business Profile Kaise Banaye (2026 Tutorial)",
      slug: "google-business-profile-kaise-banaye",
      excerpt:
        "Learn how to list your business on Google Maps correctly to rank number 1 in your city.",
      date: "April 18, 2026",
      tag: "Google Service",
    },
    {
      title: "GBP Suspend Kyun Hota Hai Aur Ise Kaise Fix Karein?",
      slug: "gbp-suspend-kyun-hota-hai",
      excerpt:
        "Is your Google Business Profile suspended due to deceptive content or address mismatch? Learn the root causes and recovery steps.",
      date: "April 18, 2026",
      tag: "Recovery",
    },
    {
      title: "WhatsApp Se Order Kaise Le - Small Business Guide",
      slug: "whatsapp-se-order-kaise-le",
      excerpt:
        "Stop paying high commissions. Setup WhatsApp Business catalogue and start taking direct deliveries from local customers.",
      date: "April 17, 2026",
      tag: "Growth",
    },
    {
      title: "Local Business Ko Customer Kaise Mile - Top 5 Strategies",
      slug: "local-business-ko-customer-kaise-mile",
      excerpt:
        "Increase footfall at your physical shop by implementing these 5 digital and offline trust strategies.",
      date: "April 17, 2026",
      tag: "Strategy",
    },
    {
      title: "How to Manage Inventory Business Digitally in India (2026 Guide)",
      slug: "manage-Business-store-digitally-india-2026",
      excerpt:
        "A complete step-by-step guide to transforming your traditional inventory business into a digital powerhouse using AI and WhatsApp.",
      date: "April 11, 2026",
      tag: "Guide",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <Helmet>
        <title>DukaanMitra Blog | Retail Tips & Business Growth</title>
        <meta
          name="description"
          content="Learn how to grow your business with AI tools, retail tips, and digital solutions. Insights for every Indian दुकानदार."
        />
        <link rel="canonical" href="https://dukaanmitra.in/blog" />
      </Helmet>

      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase">
          Insights Hub
        </h1>
        <p className="text-xl text-indigo-600 font-bold tracking-widest uppercase">
          Retail Tips & Business Growth
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {posts.map((post, i) => (
          <div
            key={i}
            className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col hover:shadow-2xl transition-all group"
          >
            <div className="h-48 bg-slate-200 relative overflow-hidden">
              <BlogThumbnail slug={post.slug} />
              <div className="absolute inset-0 bg-indigo-600 opacity-20 group-hover:opacity-10 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 bg-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
                {post.tag}
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                {post.date}
              </p>
              <h2 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-500 font-medium mb-8 flex-1 italic">
                {post.excerpt}
              </p>
              <Link
                to={`/blog/${post.slug}`}
                className="text-indigo-600 font-black text-sm uppercase tracking-widest border-b-2 border-indigo-600 pb-1 self-start hover:opacity-70 transition-all"
              >
                Read Article ➔
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 p-12 bg-slate-900 rounded-[4rem] text-center space-y-8">
        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">
          Subscribe to Insights
        </h2>
        <p className="text-indigo-300 font-bold italic max-w-xl mx-auto">
          Get the latest retail tips and AI updates delivered directly to your
          WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Enter WhatsApp Number"
            className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all"
          />
          <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all">
            Join Now
          </button>
        </div>
      </div>

      <div className="mt-24 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
            Content Calendar
          </h2>
          <p className="text-slate-500 font-bold italic">
            Our 30-day roadmap to retail domination.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { day: "Week 1", topic: "Digital Basics", status: "Completed" },
            { day: "Week 2", topic: "AI Automation", status: "In Progress" },
            { day: "Week 3", topic: "Customer Growth", status: "Upcoming" },
            { day: "Week 4", topic: "Scaling Up", status: "Upcoming" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-lg space-y-4"
            >
              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                {item.day}
              </p>
              <h4 className="text-xl font-black italic text-slate-900 uppercase">
                {item.topic}
              </h4>
              <span
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  item.status === "Completed"
                    ? "bg-emerald-100 text-emerald-600"
                    : item.status === "In Progress"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 bg-slate-50 border border-slate-200 rounded-[3rem] p-12 lg:p-16 text-center space-y-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">
            Explore Our Tools
          </h2>
          <p className="text-slate-500 font-bold italic max-w-2xl mx-auto">
            Ready to apply what you've learned? Check out our key solutions
            below.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/whatsapp-shop-management"
            className="px-6 py-3 bg-white border border-indigo-100 text-indigo-700 font-black text-xs uppercase tracking-widest rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
          >
            WhatsApp Munim
          </Link>
          <Link
            to="/udhaar-management-app"
            className="px-6 py-3 bg-white border border-indigo-100 text-indigo-700 font-black text-xs uppercase tracking-widest rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Udhaar Tracking App
          </Link>
          <Link
            to="/get-more-google-reviews-for-shop"
            className="px-6 py-3 bg-white border border-indigo-100 text-indigo-700 font-black text-xs uppercase tracking-widest rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Review Automator
          </Link>
          <Link
            to="/compare/khatabook"
            className="px-6 py-3 bg-white border border-indigo-100 text-indigo-700 font-black text-xs uppercase tracking-widest rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
          >
            vs KhataBook
          </Link>
          <Link
            to="/compare/okcredit"
            className="px-6 py-3 bg-white border border-indigo-100 text-indigo-700 font-black text-xs uppercase tracking-widest rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
          >
            vs OkCredit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;
