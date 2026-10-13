import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAnalyticsEvent } from "../hooks/useAnalyticsEvent";

const Contact: React.FC = () => {
  const { trackEvent } = useAnalyticsEvent();
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DukaanMitra Technologies",
    image: "https://dukaanmitra.in/logo.svg",
    "@id": "https://dukaanmitra.in",
    url: "https://dukaanmitra.in",
    telephone: "+91 63937 41171",
    email: "amitsharma99976@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Swaroop Nagar",
      addressLocality: "Kanpur",
      addressRegion: "UP",
      postalCode: "208005",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 26.4837,
      longitude: 80.3168,
    },
    founder: {
      "@type": "Person",
      name: "Amit Sharma",
    },
  };

  const handleWhatsAppClick = () => {
    trackEvent("whatsapp_contact", { source: "contact_page" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("form_submission", {
      form_id: "contact_form",
      shop_or_name: formData.name,
      has_message: !!formData.message,
    });
    setSubmitted(true);
    setFormData({ name: "", phone: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10">
      <Helmet>
        <title>Contact Us | DukaanMitra Support Kanpur</title>
        <meta
          name="description"
          content="Contact DukaanMitra for merchant support, WhatsApp business setup, and Google Business Profile consulting in Kanpur and across India."
        />
        <link rel="canonical" href="https://dukaanmitra.in/contact" />
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      </Helmet>

      <div className="text-center mb-16 space-y-6">
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase relative inline-block">
          Get in Touch
          <div className="absolute -bottom-4 left-0 w-full h-2 bg-indigo-600 rounded-full"></div>
        </h1>
        <p className="text-xl text-slate-600 font-bold max-w-2xl mx-auto">
          Need help digitizing your retail shop or setting up your WhatsApp
          Munim? We are here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact info */}
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col space-y-8">
          <h2 className="text-3xl font-black text-slate-900 italic uppercase">
            Reach Out
          </h2>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl shrink-0">
              📱
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                WhatsApp Support
              </h3>
              <p className="text-slate-500 font-medium mb-2">
                Fastest way to reach us for app set up or business queries.
              </p>
              <a
                href="https://whatsapp.com/channel/0029VbBxi9eJZg4DGvYpBx0U"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="text-green-600 font-black uppercase tracking-widest text-sm hover:underline"
              >
                Chat with DukaanMitra ➔
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl shrink-0">
              ✉️
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">Email Us</h3>
              <p className="text-slate-500 font-medium mb-2">
                For business partnerships or detailed SEO consultation.
              </p>
              <a
                href="mailto:amitsharma99976@gmail.com"
                className="text-indigo-600 font-black uppercase tracking-widest text-sm hover:underline"
              >
                amitsharma99976@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-2xl shrink-0">
              📍
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">Our Offices</h3>
              <p className="text-slate-500 font-medium space-y-4">
                <strong>HQ (Kanpur)</strong>
                <br />
                Swaroop Nagar, Kanpur <br />
                Uttar Pradesh 208005 <br />
                <br />
                <strong>Delhi Office</strong>
                <br />
                New Delhi <br />
                Delhi, 110001
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-2xl shrink-0">
              📞
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">Call Us</h3>
              <p className="text-slate-500 font-medium mb-2">
                Direct Founder Contact
              </p>
              <a
                href="tel:+916393741171"
                className="text-indigo-600 font-black uppercase tracking-widest text-sm hover:underline"
              >
                +91 63937 41171
              </a>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-black text-white italic uppercase">
              Drop a Message
            </h2>
            {submitted ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl text-center">
                <p className="font-black uppercase tracking-wider mb-2">Thank You!</p>
                <p className="text-sm font-medium">We received your request. We'll connect with you on WhatsApp shortly.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name or Shop Name"
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 text-white font-medium border border-white/20 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="WhatsApp Number"
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 text-white font-medium border border-white/20 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you grow?"
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl bg-white/10 text-white font-medium border border-white/20 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-500 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-indigo-500/30 hover:bg-indigo-400 transition-all active:scale-95"
                >
                  Send Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
