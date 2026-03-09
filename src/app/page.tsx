
'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { 
  Smartphone, 
  MessageCircle, 
  Zap, 
  Bot, 
  LayoutGrid, 
  MousePointer2, 
  Move,
  ArrowRight
} from 'lucide-react';

/**
 * DukaanMitra - Senior Engineer Implementation
 * Anime.js v4 Modular API Integration
 */

export default function LandingPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX: Using (0, eval) to hide the dynamic import from Next.js bundler
    // which prevents the "target environment doesn't support dynamic import" build error.
    const initAnime = async () => {
      try {
        const anime = await (0, eval)('import("https://cdn.jsdelivr.net/npm/animejs/+esm")');
        const { 
          animate, 
          waapi, 
          stagger, 
          splitText, 
          onScroll, 
          createLayout, 
          createDraggable, 
          createAnimatable, 
          utils, 
          cubicBezier, 
          spring, 
          createScope 
        } = anime;

        // --- 1. RESPONSIVE SCOPE ---
        const responsiveScope = createScope({
          mediaQueries: {
            isSmall: '(max-width: 768px)',
            reduceMotion: '(prefers-reduced-motion)',
          }
        });

        // --- 2. HERO CHARACTER ANIMATION (WAAPI) ---
        // Using character-level split text for the high-energy headline
        const { chars } = splitText('.hero-headline', { words: false, chars: true });
        
        waapi.animate(chars, {
          y: [0, -25, 0],
          rotate: [0, 10, 0],
          delay: stagger(50),
          duration: 1000,
          loop: true,
          ease: 'inOut(3)',
        });

        // --- 3. SCROLL-TRIGGERED SECTIONS ---
        // Feature Cards Entry
        onScroll('.feature-card', {
          enter: (el: HTMLElement) => {
            animate(el, {
              y: [60, 0],
              opacity: [0, 1],
              scale: [0.9, 1],
              duration: 800,
              delay: stagger(100),
              ease: cubicBezier(.7, .1, .5, .9)
            });
          }
        });

        // Dashboard Cards Entry
        onScroll('.dashboard-card', {
          enter: (el: HTMLElement) => {
            animate(el, {
              y: [100, 0],
              opacity: [0, 1],
              duration: 1200,
              ease: spring({ bounce: 0.4 })
            });
          }
        });

        // --- 4. LAYOUT TRANSFORMATION (createLayout) ---
        const layout = createLayout('.layout-demo-container');
        let currentGrid = 0;
        
        const morphLayout = () => {
          currentGrid = (currentGrid + 1) % 4;
          layout.update(({ root }: any) => {
            root.dataset.grid = currentGrid + 1;
          }, {
            duration: 1200,
            delay: stagger(80),
            ease: 'out(4)'
          });
        };

        const layoutInterval = setInterval(morphLayout, 3000);

        // --- 5. DRAGGABLE (createDraggable) ---
        createDraggable('.draggable-square', {
          bounds: '.draggable-container'
        });

        // --- 6. MOUSE FOLLOW (createAnimatable) ---
        const animatableFollower = createAnimatable('.mouse-follower', {
          x: 0,
          y: 0,
          ease: 'out(3)'
        });

        const handleMouseMove = (e: MouseEvent) => {
          const container = document.querySelector('.interactive-container');
          if (!container) return;
          const rect = container.getBoundingClientRect();
          // Clamping movement within the container
          const x = utils.clamp(e.clientX - rect.left - 25, 0, rect.width - 50);
          const y = utils.clamp(e.clientY - rect.top - 25, 0, rect.height - 50);
          animatableFollower.x(x);
          animatableFollower.y(y);
        };

        window.addEventListener('mousemove', handleMouseMove);

        // --- 7. EASING COMPARISON ---
        onScroll('.easing-demo', {
          enter: () => {
            animate('.ease-square-1', { x: ['0%', '85%'], duration: 2000, loop: true, alternate: true, ease: 'out(3)' });
            animate('.ease-square-2', { x: ['0%', '85%'], duration: 2000, loop: true, alternate: true, ease: cubicBezier(.7, .1, .5, .9) });
            animate('.ease-square-3', { x: ['0%', '85%'], duration: 2000, loop: true, alternate: true, ease: spring({ bounce: 0.6 }) });
          }
        });

        return () => {
          clearInterval(layoutInterval);
          window.removeEventListener('mousemove', handleMouseMove);
        };
      } catch (err) {
        console.error("Failed to load Anime.js v4 modular API:", err);
      }
    };

    initAnime();
  }, []);

  return (
    <div className="bg-[#0f0f0f] text-white selection:bg-[#25D366]/30 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 border border-[#25D366]/20">
          <Zap size={14} className="text-[#25D366]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#25D366]">Anime.js v4 Modular Engine</span>
        </div>
        <h1 className="hero-headline font-headline text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.85] uppercase mb-8">
          BILLBOOK FEKO<br/>
          <span className="text-[#25D366]">WHATSAPP CHALAO</span>
        </h1>
        <p className="max-w-xl text-lg md:text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
          AI-powered WhatsApp Munim for Kirana stores. <br/>
          Built with high-fidelity deterministic animation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="h-16 px-10 rounded-full bg-[#25D366] hover:bg-[#20ba56] text-black font-black uppercase text-lg" asChild>
            <Link href="/login">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" className="h-16 px-10 rounded-full border-white/10 hover:bg-white/5 font-black uppercase text-lg">
            View Live Demo
          </Button>
        </div>
      </section>

      {/* 2. FEATURES SECTION (onScroll) */}
      <section className="min-h-screen py-32 container">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-20 text-center">
          CORE <span className="text-[#25D366]">MODULES</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "WhatsApp Entry", icon: <MessageCircle />, desc: "Pure text-to-ledger extraction with 99% accuracy." },
            { title: "AI Munim", icon: <Bot />, desc: "Context-aware processing for local Hinglish slang." },
            { title: "Digital Ledger", icon: <LayoutGrid />, desc: "Real-time state updates with deterministic math." },
            { title: "Smart Reports", icon: <Zap />, desc: "Automated end-of-day analytics via WhatsApp." }
          ].map((f, i) => (
            <Card key={i} className="feature-card p-10 bg-[#1b1b1b] border-none rounded-[2.5rem] hover:bg-[#222] transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-black uppercase mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. DASHBOARD SECTION (spring / cubicBezier) */}
      <section className="min-h-screen py-32 bg-[#0a0a0a]">
        <div className="container">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-20">
            MERCHANT <span className="text-[#25D366]">DASHBOARD</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Today's Revenue", val: "₹12,500", sub: "+12% from yesterday" },
              { label: "Total Udhaar", val: "₹84,350", sub: "14 Pending collections" },
              { label: "Low Stock", val: "5 Items", sub: "Parle-G, Amul Milk" },
              { label: "Top Grahak", val: "Sunita ji", sub: "VIP Segment" }
            ].map((card, i) => (
              <div key={i} className="dashboard-card p-8 bg-[#1b1b1b] rounded-[2rem] border border-white/5 space-y-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#25D366]">{card.label}</div>
                <div className="text-4xl font-black tracking-tighter">{card.val}</div>
                <div className="text-xs text-muted-foreground">{card.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LAYOUT TRANSFORMATION (createLayout) */}
      <section className="min-h-screen py-32 container flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
              DYNAMIC <br/> <span className="text-[#25D366]">PROCESSING</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-md font-medium">
              Our layout engine adapts to your scale. Watch as Mitra OS morphs data points into intelligence.
            </p>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-[#25D366]">
              <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              Live State Reconfiguration
            </div>
          </div>
          
          <div className="layout-demo-container grid-layout h-[500px] w-full" data-grid="1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="item bg-[#1b1b1b] border border-white/5 rounded-3xl p-6 flex flex-col justify-end group overflow-hidden relative">
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <Zap size={16} className="text-[#25D366]" />
                </div>
                <div className="font-black text-2xl tracking-tighter">DATA_{i+1}</div>
                <div className="text-[10px] uppercase font-bold text-muted-foreground">Processed Segment</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DRAGGABLE & 6. MOUSE FOLLOW */}
      <section className="min-h-screen py-32 container">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="p-8 bg-[#1b1b1b] rounded-[3rem] space-y-6">
            <h3 className="text-2xl font-black uppercase flex items-center gap-2">
              <Move className="text-[#25D366]" />
              Draggable UI
            </h3>
            <p className="text-sm text-muted-foreground">Customize your command center by moving modules around.</p>
            <div className="draggable-container h-64 bg-black/40 rounded-2xl border border-white/5 relative flex items-center justify-center p-4">
              <div className="draggable-square w-24 h-24 bg-[#25D366] rounded-2xl shadow-xl shadow-[#25D366]/20 flex items-center justify-center cursor-grab active:cursor-grabbing">
                <Smartphone className="text-black" />
              </div>
            </div>
          </div>

          <div className="interactive-container p-8 bg-[#1b1b1b] rounded-[3rem] space-y-6 relative overflow-hidden h-full">
            <h3 className="text-2xl font-black uppercase flex items-center gap-2">
              <MousePointer2 className="text-[#25D366]" />
              Low Latency
            </h3>
            <p className="text-sm text-muted-foreground">The UI follows your intent with zero input lag. Powered by animatable offsets.</p>
            <div className="mouse-follower w-12 h-12 rounded-full border-2 border-[#25D366] flex items-center justify-center absolute z-10 pointer-events-none">
              <div className="w-2 h-2 rounded-full bg-[#25D366]" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. PHYSICS & EASING DEMO */}
      <section className="min-h-screen py-32 bg-[#0a0a0a] easing-demo">
        <div className="container max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-20 text-center">
            THE PHYSICS OF <span className="text-[#25D366]">TRUST</span>
          </h2>
          <div className="space-y-12">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
                <span>Polynomial Ease Out</span>
                <span>'out(3)'</span>
              </div>
              <div className="h-20 bg-white/5 rounded-2xl flex items-center px-4">
                <div className="ease-square-1 w-12 h-12 bg-white/20 rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
                <span>Custom Premium Curve</span>
                <span>cubicBezier(.7, .1, .5, .9)</span>
              </div>
              <div className="h-20 bg-[#25D366]/5 rounded-2xl flex items-center px-4">
                <div className="ease-square-2 w-12 h-12 bg-[#25D366] rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">
                <span>Spring Physics</span>
                <span>spring({`{ bounce: 0.6 }`})</span>
              </div>
              <div className="h-20 bg-blue-500/5 rounded-2xl flex items-center px-4">
                <div className="ease-square-3 w-12 h-12 bg-blue-500 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#25D366]/10 blur-[120px] rounded-full -z-10" />
        <div className="container relative z-10">
          <h2 className="text-6xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] mb-12">
            READY TO<br/> <span className="text-[#25D366]">UPGRADE?</span>
          </h2>
          <Button size="lg" className="h-24 px-16 rounded-full bg-[#25D366] hover:bg-[#20ba56] text-black font-black uppercase text-3xl shadow-heavy shadow-[#25D366]/20 transition-all active:scale-95" asChild>
            <Link href="/login">
              START FREE TRIAL 🚀
            </Link>
          </Button>
          <div className="mt-12 flex flex-col items-center gap-2">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Secured by Indian Sovereign Infrastructure</p>
            <div className="flex gap-4 opacity-30 grayscale mt-4">
              <span className="font-bold">UP KIRANA</span>
              <span className="font-bold">DELHI RETAIL</span>
              <span className="font-bold">MUMBAI FOOD</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
