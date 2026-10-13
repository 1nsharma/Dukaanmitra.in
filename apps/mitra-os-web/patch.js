import fs from 'fs';
let content = fs.readFileSync('components/ProgrammaticSeoPage.tsx', 'utf8');

const roiSection = `
      {/* Traffic & ROI Projection */}
      <section className="py-24 px-6 lg:px-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-slate-900 uppercase">
              The Math Behind The Growth
            </h2>
            <p className="text-xl font-bold text-slate-500">
              See what happens when you publish consistently at scale.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="text-4xl font-black text-indigo-600">156</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Blogs / Year</div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="text-4xl font-black text-amber-500">50</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Visits Daily / Blog</div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="text-4xl font-black text-emerald-500">2.8M</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Annual Traffic</div>
              <div className="text-[10px] text-slate-400 font-medium">(156 * 50 * 365)</div>
            </div>
            <div className="bg-white p-8 rounded-3xl border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 text-center space-y-4 transform hover:-translate-y-2 transition-transform">
              <div className="text-4xl font-black text-emerald-600">28,000</div>
              <div className="text-sm font-bold text-slate-700 uppercase tracking-widest">New Customers</div>
              <div className="text-[10px] text-slate-400 font-medium">(at 1% conversion)</div>
            </div>
          </div>
        </div>
      </section>
`;

content = content.replace('{/* Final Action */}', roiSection + '\n      {/* Final Action */}');
fs.writeFileSync('components/ProgrammaticSeoPage.tsx', content);
console.log("Patched!");
