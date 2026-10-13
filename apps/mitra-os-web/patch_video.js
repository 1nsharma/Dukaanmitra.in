import fs from 'fs';
let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

const videoSection = `
      {/* Product Demo Video Section */}
      <section className="py-24 px-6 lg:px-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
              See How It Works
            </h2>
            <p className="text-xl font-bold text-slate-500">
              Watch the 60-second product demo of DukaanMitra AI.
            </p>
          </div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-slate-900 aspect-video bg-slate-900 flex items-center justify-center">
            {/* Placeholder for actual video iframe */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
            <div className="relative z-10 w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_50px_rgba(16,185,129,0.5)]">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-slate-900 border-b-[12px] border-b-transparent ml-2"></div>
            </div>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-bold tracking-widest uppercase text-sm drop-shadow-md">Play Product Demo</p>
          </div>
        </div>
      </section>
`;

content = content.replace('{/* Semantic Content Expansion Section */}', videoSection + '\n      {/* Semantic Content Expansion Section */}');

fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Patched video section in LandingPage!");
