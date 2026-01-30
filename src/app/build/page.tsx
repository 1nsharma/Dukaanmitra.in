'use client';

import React, { useState } from 'react';

export default function BuildPage() {
  const [activeDay, setActiveDay] = useState<2 | 3>(3);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="container py-16 md:py-24">
      <div className="space-y-8 pb-24 animate-in fade-in duration-700">
        <header className="border-b border-slate-200 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${activeDay === 2 ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                Day {activeDay} Protocol
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 font-medium italic underline decoration-slate-300 underline-offset-4">Solo Founder Edition</span>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setActiveDay(2)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeDay === 2 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Day 2
              </button>
              <button 
                onClick={() => setActiveDay(3)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeDay === 3 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Day 3
              </button>
            </div>
          </div>
          
          {activeDay === 2 ? (
            <>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none italic">The Brain Router</h2>
              <p className="text-xl text-slate-500 mt-4 max-w-3xl leading-relaxed">
                Stop polluting your database with "Hi" and "Hello". This guide transforms your Day 1 pipeline into an intelligent, 3-lane classification engine.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none italic text-emerald-600">The Retention Hook</h2>
              <p className="text-xl text-slate-500 mt-4 max-w-3xl leading-relaxed">
                Build daily stickiness and trust. Automate "Dukaan Band" reports and clean up media noise with a dedicated trap.
              </p>
            </>
          )}
        </header>

        {activeDay === 2 && (
          <div className="space-y-12">
            {/* TASK 1: ROUTER INSERTION */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl shadow-xl">⚙️</div>
                <h3 className="text-2xl font-bold text-slate-900">Task 1: Router Insertion</h3>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900">Make.com Modification Steps</h4>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex items-start space-x-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">1</span>
                        <span>Open your <strong>Day 1 Scenario</strong>. UNLINK the connection between <code>AI Parse</code> and <code>Google Sheets (Add Row)</code>.</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">2</span>
                        <span>Right-click on the canvas → <strong>Add Router</strong>. Place it immediately AFTER the AI Parse module.</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex flex-col justify-center">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">AI</div>
                      <div className="w-8 h-0.5 bg-slate-700"></div>
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 text-xl shadow-lg shadow-indigo-500/20">🔀</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TASK 2: BILLING LANE */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-xl">💰</div>
                <h3 className="text-2xl font-bold text-slate-900">Task 2: Route 1 — Billing Lane</h3>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] space-y-4">
                <h4 className="font-bold text-emerald-900 uppercase text-xs tracking-widest">Filter: Entry Guard</h4>
                <div className="bg-white p-5 rounded-2xl border border-emerald-200">
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Condition</p>
                  <div className="flex items-center space-x-2 text-sm font-mono text-emerald-700">
                    <span>{"{{AI.amount}}"}</span>
                    <span className="text-slate-400">Numeric: Greater than</span>
                    <span>0</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeDay === 3 && (
          <div className="space-y-12">
            {/* DAY 3 TASK 1 & 2 */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white text-2xl shadow-xl">🌙</div>
                <h3 className="text-2xl font-bold text-slate-900">Task 1 & 2: Nightly Report Logic</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                  <h4 className="font-bold text-slate-900">Scenario: Daily_Dukaan_Band_Report</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Trigger</p>
                      <p className="text-sm font-bold text-slate-900 leading-tight">Scheduler @ 21:30 IST</p>
                      <p className="text-[10px] text-slate-500 mt-1 italic">Verify timezone: Asia/Kolkata</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Search Module</p>
                      <p className="text-sm font-bold text-slate-900 leading-tight">GSheets: Search Transactions</p>
                      <p className="text-[10px] text-slate-500 mt-1 italic">Filter: Date EQUALS Today</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] flex flex-col justify-center space-y-4">
                  <h4 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">Why 9:30 PM?</h4>
                  <p className="text-sm opacity-80 leading-relaxed italic">
                    "Night-time delivery creates a dopamine loop. The owner sees their earnings just before sleeping. It builds the strongest retention habit."
                  </p>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-mono">
                    Tip: Use helper column 'DateOnly' in Sheets for O(1) matching.
                  </div>
                </div>
              </div>
            </section>

            {/* DAY 3 TASK 3 & 4 */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-xl">📊</div>
                <h3 className="text-2xl font-bold text-slate-900">Task 3 & 4: Aggregation & Delivery</h3>
              </div>
              
              <div className="bg-blue-50 border border-blue-100 p-8 rounded-[3rem] flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-4">
                  <h4 className="font-bold text-blue-900 underline decoration-blue-300">Numeric Aggregator Setup</h4>
                  <p className="text-sm text-blue-700">Source: Sheets Search Results. Aggregate: SUM(Amount) & COUNT(Rows).</p>
                  <div className="bg-white p-5 rounded-2xl border border-blue-200 space-y-3 shadow-sm">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp Template (dm_daily_report_v1)</p>
                    <p className="text-sm italic text-slate-700 leading-relaxed">
                      "Namaste! 🌙<br/>
                      Aaj ka dukaan report:<br/>
                      Total Bills: <span className="text-blue-600 font-bold">{"{{bundles_count}}"}</span><br/>
                      Total Kamaai: <span className="text-blue-600 font-bold">₹{"{{result_value}}"}</span><br/>
                      Kal milte hain! 🚀"
                    </p>
                    <button onClick={() => copyToClipboard('Namaste! 🌙\nAaj ka dukaan report:\nTotal Bills: {{bundles_count}}\nTotal Kamaai: ₹{{result_value}}\nKal milte hain! 🚀')} className="text-[10px] font-bold text-blue-500 uppercase hover:underline">Copy Template</button>
                  </div>
                </div>
                <div className="w-full lg:w-72 flex flex-col justify-center">
                  <div className="p-6 bg-slate-900 rounded-3xl border-4 border-slate-800 shadow-2xl rotate-2 transform">
                      <p className="text-[10px] text-emerald-400 font-bold mb-2">FOUNDER TIP</p>
                      <p className="text-xs text-white opacity-80 italic">"Hardcode your own number as the recipient for the first 3 days to verify the report quality before owners see it."</p>
                  </div>
                </div>
              </div>
            </section>

            {/* DAY 3 TASK 5: MEDIA TRAP */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white text-2xl shadow-xl">📷</div>
                <h3 className="text-2xl font-bold text-slate-900">Task 5: The Media Trap</h3>
              </div>

              <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex-1 space-y-4">
                    <h4 className="font-bold text-slate-900">Handling Photos/Videos</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Owners often send pictures of bills. In Phase 2, this causes an error. We add a dedicated route to catch media and educate the user.
                    </p>
                    <div className="bg-rose-50 p-4 rounded-2xl border border-rose-100 text-[10px] font-mono">
                      Router Filter: <br/>
                      Message type EQUALS 'image' OR 'video'
                    </div>
                  </div>
                  <div className="w-full md:w-80 bg-slate-900 text-white p-6 rounded-[2rem] border-4 border-slate-800 space-y-4">
                    <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Reply Script</p>
                    <p className="text-sm leading-relaxed italic">
                      "Sir ji, abhi main photos ya video nahi samajh sakta. <br/><br/>
                      Kripya type karke bhejein:<br/>
                      <strong>'Aata 200'</strong>. <br/><br/>
                      Camera wala feature jald aa raha hai 🙂"
                    </p>
                    <button onClick={() => copyToClipboard("Sir ji, abhi main photos ya video nahi samajh sakta.\nKripya type karke bhejein:\n'Aata 200'.\nCamera wala feature jald aa raha hai 🙂")} className="text-[10px] text-white/40 hover:text-white uppercase font-bold">Copy Script</button>
                  </div>
                </div>
              </div>
            </section>

            {/* DAY 3 TESTING */}
            <section className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
                <span className="text-indigo-600">🧪</span>
                <span>Day 3 Testing Checklist</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2">
                    <p className="font-bold text-sm">1. Manual Report Test</p>
                    <p className="text-xs text-slate-500">Run the 'Daily_Dukaan_Band_Report' scenario manually. Confirm WhatsApp notification arrives.</p>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2">
                    <p className="font-bold text-sm">2. Media Trap Test</p>
                    <p className="text-xs text-slate-500">Send an image to the bot via the Simulator. Confirm the "Media Trap" response triggers.</p>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2">
                    <p className="font-bold text-sm">3. Integrity Check</p>
                    <p className="text-xs text-slate-500">Confirm no blank rows are created in GSheets when an image is sent.</p>
                </div>
                <div className="p-5 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2">
                    <p className="font-bold text-sm">4. Timezone Check</p>
                    <p className="text-xs text-slate-500">Double check Make.com Organization settings to ensure 'Asia/Kolkata'.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        <footer className="text-center pt-10 pb-20 border-t border-slate-200">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-full text-sm font-bold shadow-xl cursor-default group">
              <span className="group-hover:animate-bounce">🚀</span>
              <span>{activeDay === 3 ? "DAY 3 DEPLOYMENT: RETENTION ACTIVE" : "DAY 2 PROTOCOL LOADED"}</span>
          </div>
          <p className="text-slate-400 text-[10px] mt-4 uppercase font-black tracking-widest">DukaanMitra Blueprint | Dec 2025 Edition</p>
        </footer>
      </div>
    </div>
  );
}
