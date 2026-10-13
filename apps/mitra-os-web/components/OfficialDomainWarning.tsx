import React from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "./ui/Card";

export const OfficialDomainWarning: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[70vh] bg-slate-50 items-center justify-center p-6">
      <Helmet>
        <title>Official Domain Statement | DukaanMitra</title>
        <meta
          name="description"
          content="DukaanMitra ki official website sirf dukaanmitra.in hai. Beware of .com frauds."
        />
      </Helmet>

      <Card className="w-full max-w-3xl p-12 text-center space-y-8 border-t-8 border-red-500 shadow-2xl bg-white">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center text-5xl shadow-inner">
          ⚠️
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-tight">
          Official Domain Statement
        </h1>

        <div className="space-y-6 text-xl text-slate-600 font-medium leading-relaxed">
          <p>
            Dear Merchants and Customers,
            <br />
            <br />
            We want to officially clarify that the{" "}
            <strong>only authentic and official website</strong> for our AI
            WhatsApp Munim software is{" "}
            <span className="font-black text-indigo-600">dukaanmitra.in</span>.
          </p>

          <div className="bg-red-50 text-red-800 p-6 rounded-3xl border border-red-200">
            <p className="font-bold italic">
              "DukaanMitra ki official website sirf <strong>.in</strong> hai.
              Kisi bhi <strong>.com</strong> ya dusre domain se savdhan rahein.
              Woh fraud ya nakli ho sakte hain."
            </p>
          </div>

          <p className="text-lg">
            If anyone contacts you demanding payment or downloading sketchy
            applications claiming to be DukaanMitra from a{" "}
            <code className="text-red-500 bg-red-50 px-2 rounded">.com</code> or
            other domains, please report them immediately. We operate strictly
            on WhatsApp and our verified <strong>.in</strong> website.
          </p>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            — Amit Sharma, Founder DukaanMitra
          </p>
        </div>
      </Card>
    </div>
  );
};
