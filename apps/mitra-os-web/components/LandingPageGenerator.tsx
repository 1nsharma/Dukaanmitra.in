import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Code,
  Layout,
  Rocket,
  Check,
  Copy,
  Wand2,
  Eye,
} from "lucide-react";
import { generateLandingPage } from "../services/geminiService";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";

export const LandingPageGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    product: "",
    tagline: "",
    audience: "",
    painPoint: "",
    benefit: "",
    pricing: "",
    style: "bold-startup" as const,
    framework: "PAS" as const,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateLandingPage(formData);
      setGeneratedCode(result);
      setShowPreview(true);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12 pb-24">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100 italic">
          <Sparkles className="w-3 h-3" />
          AI Page Engine v1.0
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">
          Landing Page <span className="text-indigo-600">Generator</span>
        </h2>
        <p className="text-xl text-slate-500 font-bold italic">
          Generate high-converting marketing pages for your shop or product in
          seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Form Section */}
        <Card className="p-8 md:p-12 space-y-8 border-b-8 border-indigo-600 shadow-2xl bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Rocket className="w-40 h-40" />
          </div>

          <div className="grid gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                  Product Name
                </label>
                <input
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  placeholder="e.g. Ramesh Inventory Business"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                  Tagline
                </label>
                <input
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="e.g. Freshness Delivered"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                  Target Audience
                </label>
                <input
                  name="audience"
                  value={formData.audience}
                  onChange={handleInputChange}
                  placeholder="e.g. Local household owners"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                  Pricing Tiers
                </label>
                <input
                  name="pricing"
                  value={formData.pricing}
                  onChange={handleInputChange}
                  placeholder="e.g. Basic, Pro, Special"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                  Design Style
                </label>
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all"
                >
                  <option value="dark-saas">Dark SaaS</option>
                  <option value="clean-minimal">Clean Minimal</option>
                  <option value="bold-startup">Bold Startup</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                  Copy Framework
                </label>
                <select
                  name="framework"
                  value={formData.framework}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all"
                >
                  <option value="PAS">PAS (Problem-Agitate-Solution)</option>
                  <option value="AIDA">
                    AIDA (Attention-Interest-Desire-Action)
                  </option>
                  <option value="BAB">BAB (Before-After-Bridge)</option>
                  <option value="4PS">4PS (Promise-Picture-Proof-Push)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                Key Pain Point
              </label>
              <textarea
                name="painPoint"
                value={formData.painPoint}
                onChange={handleInputChange}
                placeholder="What problem does your customer have?"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all h-24 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">
                Key Benefit
              </label>
              <textarea
                name="benefit"
                value={formData.benefit}
                onChange={handleInputChange}
                placeholder="How do you solve it?"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 focus:border-indigo-600 focus:outline-none transition-all h-24 resize-none"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !formData.product}
            size="lg"
            className="w-full h-16 bg-indigo-600 text-white rounded-[2rem] font-black text-xl italic tracking-tight shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                Architecting Page...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Wand2 className="w-6 h-6" />
                Generate Complete Page 🚀
              </div>
            )}
          </Button>
          <div className="pt-8 border-t border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              Style Reference
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "Dark SaaS", color: "bg-slate-900 border-slate-800" },
                {
                  name: "Minimal",
                  color: "bg-white border-slate-100 shadow-sm",
                },
                { name: "Startup", color: "bg-indigo-600" },
                { name: "Enterprise", color: "bg-slate-50 border-slate-200" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-full aspect-video rounded-xl border-2 ${s.color}`}
                  />
                  <span className="text-[8px] font-black uppercase opacity-40">
                    {s.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Preview/Output Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900">
              Output Area
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${!showPreview ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}
              >
                <Code className="w-4 h-4 inline mr-2" /> Code
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${showPreview ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}
              >
                <Eye className="w-4 h-4 inline mr-2" /> Visual
              </button>
            </div>
          </div>

          <div className="h-[600px] bg-slate-50 rounded-[4rem] border-4 border-slate-900 overflow-hidden relative shadow-2xl group">
            <AnimatePresence mode="wait">
              {!generatedCode ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6"
                >
                  <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-lg animate-bounce">
                    <Rocket className="w-12 h-12 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold italic text-lg leading-relaxed">
                    Fill the form and hit generate. <br /> Your high-converting
                    landing page <br /> will appear here instantly.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full relative"
                >
                  {showPreview ? (
                    <div className="h-full bg-white flex flex-col items-center justify-center p-12 text-center space-y-8">
                      <Layout className="w-20 h-20 text-indigo-100" />
                      <div className="space-y-4">
                        <h4 className="text-2xl font-black italic tracking-tighter">
                          {formData.product} Page Generated
                        </h4>
                        <p className="text-slate-500 font-bold italic">
                          The visual preview of dynamic components is limited in
                          sandbox. Please view the code to see the full
                          structural implementation.
                        </p>
                      </div>
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="rounded-full"
                      >
                        {copied ? (
                          <Check className="mr-2" />
                        ) : (
                          <Copy className="mr-2" />
                        )}
                        {copied ? "Copied" : "Copy Code"}
                      </Button>
                    </div>
                  ) : (
                    <div className="h-full font-mono text-xs overflow-auto p-8 bg-slate-950 text-emerald-400">
                      <pre className="whitespace-pre-wrap">{generatedCode}</pre>
                    </div>
                  )}

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={copyToClipboard}
                      className="bg-white/90 backdrop-blur text-slate-900 p-4 rounded-2xl shadow-xl hover:bg-white transition-all transform hover:scale-110"
                    >
                      {copied ? (
                        <Check className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Copy className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Check className="w-3 h-3 text-emerald-500" /> SEO Optimized
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Check className="w-3 h-3 text-emerald-500" /> Moblie First
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <Check className="w-3 h-3 text-emerald-500" /> Fast LCP
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
