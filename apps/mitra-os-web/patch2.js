import fs from 'fs';
let content = fs.readFileSync('components/SeoDashboard.tsx', 'utf8');

const mathSection = `
                {/* Math Verification Section */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8 mt-8">
                  <div className="text-center space-y-4">
                    <h3 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
                      Traffic & Conversion Projection
                    </h3>
                    <p className="text-xl font-bold text-slate-500">
                      Steady-state annual traffic projection
                    </p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-2">
                      <div className="text-4xl font-black text-slate-800">156</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blogs / Year</div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-center space-y-2">
                      <div className="text-4xl font-black text-slate-800">50</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visits Daily / Blog</div>
                    </div>
                    <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 text-center space-y-2">
                      <div className="text-4xl font-black text-indigo-600">2.8M</div>
                      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Annual Traffic</div>
                      <div className="text-[10px] text-indigo-300 font-medium">(156 * 50 * 365 = 2,847,000)</div>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-500 shadow-xl shadow-emerald-500/20 text-center space-y-2 transform hover:-translate-y-2 transition-transform">
                      <div className="text-4xl font-black text-emerald-600">28,000</div>
                      <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">New Customers</div>
                      <div className="text-[10px] text-emerald-500 font-medium">(1% conversion rate)</div>
                    </div>
                  </div>
                </div>
`;

// Insert it right after the grid of the Overview tab
content = content.replace('</div>\n              </div>\n              <div className="space-y-8">', '</div>\n' + mathSection + '\n              </div>\n              <div className="space-y-8">');

fs.writeFileSync('components/SeoDashboard.tsx', content);
console.log("Patched SeoDashboard!");
