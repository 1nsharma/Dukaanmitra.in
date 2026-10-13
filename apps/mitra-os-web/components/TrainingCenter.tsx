import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";

const TrainingCenter: React.FC = () => {
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // Accessing aistudio from window with type casting to bypass environment-specific type missingness
      // and avoid conflicting with potentially pre-existing global declarations.
      const aiStudio = (window as any).aistudio;
      if (aiStudio) {
        const selected = await aiStudio.hasSelectedApiKey();
        setHasApiKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    const aiStudio = (window as any).aistudio;
    if (aiStudio) {
      await aiStudio.openSelectKey();
      // Assume selection successful as per guidelines to avoid race condition between key selection and verification
      setHasApiKey(true);
    }
  };

  const generateTutorialVideo = async () => {
    setError(null);
    setIsVideoGenerating(true);
    setVideoUrl(null);

    // Creative loading states to improve user experience during lengthy video generation
    const steps = [
      "Dreaming up the inventory business environment...",
      "Animating the friendly shopkeeper...",
      "Synthesizing the WhatsApp message workflow...",
      "Adding cinematic lighting and textures...",
      "Polishing the final tutorial flow...",
      "Baking 1080p pixels with Veo 3.1...",
    ];

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      setGenerationStep(steps[stepIndex % steps.length]);
      stepIndex++;
    }, 4000);

    try {
      // Initialize GoogleGenAI immediately before the call to ensure the latest API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const prompt =
        "A high-quality 3D cinematic animation of a friendly Indian inventory business owner happily using a mobile phone. He types 'Rahul 500 Sugar' into WhatsApp, and a large green confirmation checkmark appears over his phone. The shop is modern, clean, and filled with colorful groceries. The lighting is warm and professional. 4K detail, vibrant colors.";

      // Video generation can take a few minutes. Using veo-3.1-fast-generate-preview for general video generation tasks.
      let operation = await ai.models.generateVideos({
        model: "veo-3.1-fast-generate-preview",
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: "1080p",
          aspectRatio: "16:9",
        },
      });

      // Poll the operation until it's finished
      while (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({
          operation: operation,
        });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

      if (downloadLink) {
        // Fetch the MP4 bytes using the download link with the API key appended
        const response = await fetch(
          `${downloadLink}&key=${process.env.GEMINI_API_KEY}`,
        );
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } else {
        throw new Error("Video generation failed to return a link.");
      }
    } catch (err: any) {
      console.error("Veo Generation Error:", err);
      // Handle the specific error indicating an invalid/unpaid project API key
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setError(
          "API Key verification failed. Please re-select a paid project API key.",
        );
      } else {
        setError(
          "Video generation failed. Please check your project billing status and try again.",
        );
      }
    } finally {
      clearInterval(stepInterval);
      setIsVideoGenerating(false);
      setGenerationStep("");
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Enterprise Pro
            </span>
            <span className="text-slate-400 text-sm">• Training Hub</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">
            Training Center
          </h2>
          <p className="text-slate-500 font-medium">
            Generate high-fidelity AI tutorials to educate your shop owners.
          </p>
        </div>
      </header>

      {!hasApiKey ? (
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl text-center space-y-8 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl mx-auto flex items-center justify-center text-4xl shadow-xl shadow-amber-200/50">
            🔑
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-slate-900 italic tracking-tight uppercase">
              Premium Feature Access
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium">
              To use Veo Video Generation, you must select an API key from a
              paid GCP project. This ensures high-quality processing and
              dedicated resource allocation.
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Visit{" "}
              <a
                href="https://ai.google.dev/gemini-api/docs/billing"
                target="_blank"
                className="text-indigo-600 underline"
              >
                Billing Documentation
              </a>{" "}
              for more info.
            </p>
          </div>
          <button
            onClick={handleOpenKeySelector}
            className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95"
          >
            Connect Paid Project ➔
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">
                AI Tutorial Generator
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Use Google Veo to create a personalized training video. These
                videos help owners understand that DukaanMitra is as simple as
                sending a WhatsApp message.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Scene Parameters
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>Indian Inventory Business Environment</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>Friendly Owner Character</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  <span>1080p High Resolution</span>
                </li>
              </ul>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-xs font-bold text-center">
                {error}
              </div>
            )}

            <button
              onClick={generateTutorialVideo}
              disabled={isVideoGenerating}
              className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-3 ${
                isVideoGenerating
                  ? "bg-slate-100 text-slate-400"
                  : "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700"
              }`}
            >
              {isVideoGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Video...</span>
                </>
              ) : (
                <>
                  <span>🎥 Generate AI Tutorial</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
              Note: Generation takes 2-4 minutes
            </p>
          </div>

          <div className="flex flex-col space-y-8">
            <div className="flex-1 bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-slate-800 relative flex items-center justify-center min-h-[400px]">
              {isVideoGenerating ? (
                <div className="text-center space-y-6 p-8 relative z-10">
                  <div className="flex justify-center space-x-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-12 bg-indigo-500 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                  <p className="text-white text-lg font-black italic animate-pulse">
                    {generationStep}
                  </p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Our high-fidelity video engine is processing your request
                  </p>
                </div>
              ) : videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-4 opacity-30 px-10">
                  <span className="text-6xl">🎞️</span>
                  <p className="text-white font-black italic uppercase tracking-tighter">
                    Video Preview Display
                  </p>
                </div>
              )}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {videoUrl && (
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl">
                    ✅
                  </span>
                  <div>
                    <p className="font-bold text-slate-900">Tutorial Ready!</p>
                    <p className="text-xs text-slate-500">1080p MP4 Format</p>
                  </div>
                </div>
                <a
                  href={videoUrl}
                  download="DukaanMitra_Tutorial.mp4"
                  className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase shadow-lg hover:bg-black transition"
                >
                  Download Video ➔
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="bg-indigo-900 p-12 rounded-[4rem] text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">
              Why AI Training?
            </h3>
            <p className="text-indigo-100 opacity-80 leading-relaxed font-medium">
              Video-based education increases retention by 65%. For inventory
              business owners, seeing is believing. Use these videos in your
              onboarding WhatsApp blast to reduce CAC and increase LTV.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-6 w-full">
            {[
              {
                l: "High Engagement",
                v: "Tutorials are consumed 3x more than text guides.",
              },
              {
                l: "Trust Building",
                v: "Professional animations reflect platform stability.",
              },
              {
                l: "Language Bridge",
                v: "Visuals transcend dialect barriers in diverse regions.",
              },
              {
                l: "Scale Ready",
                v: "Create hundreds of variations for different store types.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10"
              >
                <p className="text-[10px] font-black text-indigo-300 uppercase mb-1 tracking-widest">
                  {item.l}
                </p>
                <p className="text-[10px] opacity-80 font-medium leading-tight">
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrainingCenter;
