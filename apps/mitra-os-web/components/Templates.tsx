import React from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { FileText, Download, Copy, Share2, Check } from "lucide-react";

const Templates: React.FC = () => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const templateGroups = [
    {
      title: "WhatsApp Customer Reply Templates",
      description: "Ready-to-use responses for common customer queries.",
      items: [
        {
          id: "t1",
          name: "Payment Reminder (Udhaar)",
          text: "Namaste! Ye Rakesh (Gupta Store) se reminder hai. Aapke ₹340 pending hain. Kripya time pe pay karein taaki udhaar facility chalu rahe. Shukriya!",
          btnLabel: "Copy Message",
        },
        {
          id: "t2",
          name: "Welcome Message (New Shop)",
          text: "Ab hamari dukan digital ho gayi hai! Sabhi products aur price WhatsApp par check karein. Pehle order par 5% discount. Link: [Your Link]",
          btnLabel: "Copy Message",
        },
      ],
    },
    {
      title: "Printable Shop Posters",
      description: "Visual posters for your storefront (A4 size).",
      items: [
        {
          id: "p1",
          name: "Digital Payment Accept Banner",
          format: "PDF (Printable)",
          btnLabel: "Download Poster",
        },
        {
          id: "p2",
          name: "Order on WhatsApp Signage",
          format: "PNG (Design)",
          btnLabel: "Download Design",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Free Downloadable Templates for Shop Owners | DukaanMitra</title>
        <meta
          name="description"
          content="Download free shop posters, WhatsApp message templates, and digital signage for your Indian Inventory Business. Professional designs for local retailers."
        />
      </Helmet>

      {/* Hero */}
      <section className="py-24 px-6 lg:px-20 bg-emerald-500 text-white text-center rounded-b-[4rem]">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
            Ready-to-Use <br />
            <span className="text-slate-900">Templates</span>
          </h1>
          <p className="text-xl font-bold italic opacity-90">
            Professional tools to help your shop look and talk like a big brand.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto space-y-16">
          {templateGroups.map((group, i) => (
            <div key={i} className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
                    {group.title}
                  </h2>
                  <p className="text-xl text-slate-500 font-bold italic">
                    {group.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {group.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 space-y-8 flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <h4 className="text-2xl font-black italic text-slate-900 uppercase leading-none">
                          {item.name}
                        </h4>
                        <FileText className="w-6 h-6 text-slate-300" />
                      </div>
                      {item.text && (
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                          <p className="text-slate-600 font-bold italic leading-relaxed">
                            "{item.text}"
                          </p>
                        </div>
                      )}
                      {item.format && (
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {item.format}
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        item.text ? handleCopy(item.text, item.id) : null
                      }
                      className={`w-full py-5 rounded-2xl font-black italic tracking-tight uppercase flex items-center justify-center gap-3 transition-all ${
                        copied === item.id
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-900 text-white hover:bg-emerald-500"
                      }`}
                    >
                      {copied === item.id ? (
                        <Check className="w-5 h-5" />
                      ) : item.text ? (
                        <Copy className="w-5 h-5" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                      {copied === item.id ? "Copied!" : item.btnLabel}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Share Section */}
      <section className="py-24 px-6 lg:px-20 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-8 bg-slate-900 text-white p-16 rounded-[4rem]">
          <Share2 className="w-16 h-16 mx-auto text-emerald-400" />
          <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
            Help other shop owners grow
          </h2>
          <p className="text-xl font-bold italic opacity-70">
            Share these free templates with your merchant community on WhatsApp.
          </p>
          <button className="bg-emerald-500 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl hover:scale-105 transition-all italic tracking-tighter">
            Share on WhatsApp ➔
          </button>
        </div>
      </section>
    </div>
  );
};

export default Templates;
