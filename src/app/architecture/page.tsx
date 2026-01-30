'use client';

import React, { useState, useRef } from 'react';
import anime from 'animejs';

export default function ArchitectureGuidePage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      id: 1,
      title: "Strategic Ingress",
      icon: "📱",
      desc: "Merchant or Customer initiates a transaction packet via WhatsApp.",
      tech: "WABA Protocol 2.5",
      detail: "Protocol 1: Analyzes strategic intent before processing logic."
    },
    {
      id: 2,
      title: "Shard Routing",
      icon: "🔌",
      desc: "Gupshup relays binary payload to a regional regional shard.",
      tech: "Regional Sharding",
      detail: "Protocol 5: Automated load balancing prevents node-lock."
    },
    {
      id: 3,
      title: "Logic Decomposition",
      icon: "⚙️",
      desc: "System breaks query into sub-problems: Extraction, Validation, Search.",
      tech: "Sub-Problem Threading",
      detail: "Protocol 2: Complex computational task splitting."
    },
    {
      id: 4,
      title: "Munim Reasoning",
      icon: "🧠",
      desc: "Gemini 3 Pro applies Bayesian inference to solve ambiguities.",
      tech: "LLM Reasoning Engine",
      detail: "Protocol 7: Hypothesizes multiple interpretations if Hinglish is vague."
    },
    {
      id: 5,
      title: "Self-Healing Settlement",
      icon: "📑",
      desc: "Data lands in Sheet/SQL. Auto-reconciliation repairs missing links.",
      tech: "Reliability Layer",
      detail: "Protocol 3: Self-healing mechanisms detect and fix row-locks."
    }
  ];

  const triggerFlow = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Cast anime to any to fix timeline access error
    const tl = (anime as any).timeline({
      easing: 'easeInOutQuad',
      complete: () => setIsAnimating(false)
    });

    steps.forEach((_, i) => {
      tl.add({
        targets: `.step-card-${i}`,
        scale: [1, 1.05, 1],
        backgroundColor: ['rgba(79, 70, 229, 0)', 'rgba(79, 70, 229, 0.1)', 'rgba(79, 70, 229, 0)'],
        borderColor: ['rgba(255,255,255,0.05)', 'rgba(99, 102, 241, 0.5)', 'rgba(255,255,255,0.05)'],
        duration: 800,
      });
    });
  };

  return (
    <div className="bg-[#02040a] text-white font-mono animate-in fade-in duration-700">
      <div className="container py-16 md:py-24">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-12">
            <div className="space-y-4">
            <div className="flex items-center gap-4 mb-2">
                <span className="bg-emerald-600 text-white px-3 py-1 rounded font-black text-[10px] uppercase tracking-[0.2em] italic shadow-lg shadow-emerald-900/40">Section 1</span>
                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em]">Full Capacity Mode Active</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">Munim AI Core</h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed italic border-l-4 border-indigo-600 pl-6">
                "Every data packet is a financial heartbeat. Every reasoning loop is a strategic advantage."
            </p>
            </div>
            <button 
            onClick={triggerFlow}
            disabled={isAnimating}
            className="bg-white text-black px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-105 transition active:scale-95 disabled:opacity-50"
            >
            {isAnimating ? 'TRACING...' : 'EXECUTE DATA TRACE'}
            </button>
        </header>

        {/* Visual Map */}
        <section className="mt-12 bg-slate-900/50 backdrop-blur-3xl p-6 md:p-12 rounded-[4rem] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col space-y-8" ref={stepsContainerRef}>
            {steps.map((step, index) => (
                <div 
                key={step.id} 
                className={`step-card-${index} flex flex-col md:flex-row items-start gap-6 md:gap-12 p-6 md:p-10 rounded-[3rem] border border-transparent transition-all duration-300 opacity-80 hover:opacity-100`}
                >
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center text-4xl md:text-5xl shrink-0 shadow-2xl bg-slate-800`}>
                    {step.icon}
                </div>
                <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h4 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">{step.title}</h4>
                    <span className="text-nowrap text-[10px] font-black px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-indigo-400 uppercase tracking-[0.2em]">{step.tech}</span>
                    </div>
                    <p className="text-base md:text-lg text-slate-400 leading-relaxed italic">"{step.desc}"</p>
                    <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">Internal Protocol: {step.detail}</p>
                    </div>
                </div>
                </div>
            ))}
            </div>
            <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(to_bottom,transparent,rgba(79,70,229,0.02))] pointer-events-none"></div>
        </section>

        {/* Specs */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-slate-900 border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl space-y-10 relative overflow-hidden group">
                <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter text-indigo-400 uppercase leading-none">Computational Load</h3>
                <div className="space-y-8">
                {[
                    { label: "Bayesian Inference Cycles", val: "10,240 / msg", p: 85 },
                    { label: "Strategic Intent Depth", val: "L5 Matrix", p: 92 },
                    { label: "Self-Healing Latency", val: "40ms (Detect/Repair)", p: 70 },
                ].map((item, i) => (
                    <div key={i} className="space-y-3">
                        <div className="flex justify-between items-end">
                        <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">{item.label}</span>
                        <span className="text-xs font-mono text-indigo-300 font-bold">{item.val}</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-indigo-600 group-hover:bg-emerald-500 transition-all duration-1000" style={{ width: `${item.p}%` }}></div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="bg-slate-900 border border-white/5 p-8 md:p-12 rounded-[3.5rem] space-y-8 shadow-2xl text-center flex flex-col justify-center">
                <h3 className="text-3xl font-black italic tracking-tight text-white uppercase mb-4">Munim Compliance</h3>
                <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5">
                <p className="text-5xl font-black text-emerald-400 tracking-tighter">AES-256</p>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] mt-3">Quantum-Ready Encryption</p>
                </div>
                <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
                "Data is not just stored; it is defended. Every financial record is encapsulated in a protocol-bound security packet."
                </p>
            </div>
        </section>
      </div>
    </div>
  );
};
