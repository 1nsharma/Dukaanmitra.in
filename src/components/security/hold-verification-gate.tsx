"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Smartphone, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const REQUIRED_HOLD_MS = 2500;
const STORAGE_KEY = "dm_human_verified";

export default function HoldVerificationGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Press and hold to enter website");
  const [isHolding, setIsHolding] = useState(false);

  const holdStartRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearHoldInterval = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  useEffect(() => {
    setMounted(true);
    const storedVerification = window.sessionStorage.getItem(STORAGE_KEY);
    if (storedVerification === "true") {
      setIsVerified(true);
    }

    return () => clearHoldInterval();
  }, []);

  const startHold = () => {
    if (isVerified) return;
    setIsHolding(true);
    clearHoldInterval();
    holdStartRef.current = Date.now();
    setMessage("Verifying human status...");

    holdIntervalRef.current = setInterval(() => {
      if (!holdStartRef.current) return;

      const elapsed = Date.now() - holdStartRef.current;
      const nextProgress = Math.min((elapsed / REQUIRED_HOLD_MS) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearHoldInterval();
        setIsVerified(true);
        setIsHolding(false);
        window.sessionStorage.setItem(STORAGE_KEY, "true");
        
        // Notify autonomous agent that a human has passed verification
        import("../../ai/tools/verifyHuman").then(({ verifyHumanTool }) => {
          verifyHumanTool.handler({}).then(result => {
            console.log("Human verification tool result:", result);
          }).catch(err => {
            console.error("Human verification tool error:", err);
          });
        });
      }
    }, 16); // Smoother update rate (60fps)
  };

  const cancelHold = (status: string) => {
    if (isVerified) return;
    setIsHolding(false);
    clearHoldInterval();
    holdStartRef.current = null;
    setProgress(0);
    setMessage(status);
  };

  return (
    <>
      {children}
      <AnimatePresence>
        {mounted && !isVerified && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#121212]/80 p-8 shadow-2xl shadow-black/50"
            >
              {/* Background Glow Effect */}
              <div 
                className="absolute inset-0 -z-10 opacity-20 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, #25D366 0%, transparent ${progress}%)`,
                  opacity: isHolding ? 0.3 : 0.1
                }}
              />

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <motion.div 
                    animate={isHolding ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#25D366]/10 text-[#25D366] shadow-[0_0_30px_rgba(37,211,102,0.2)]"
                  >
                    {isVerified ? <ShieldCheck size={40} /> : <Lock size={40} />}
                  </motion.div>
                  {isHolding && (
                    <motion.div 
                      className="absolute inset-0 rounded-3xl border-2 border-[#25D366]"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <h1 className="font-headline text-3xl font-black uppercase tracking-tighter text-white">
                    Human <span className="text-[#25D366]">Gate</span>
                  </h1>
                  <p className="text-sm font-medium text-white/50 leading-relaxed max-w-[280px]">
                    Confirm your identity to unlock the <br />
                    <span className="text-white">Mitra OS ecosystem</span>.
                  </p>
                </div>

                <div className="w-full space-y-4">
                  <motion.button
                    type="button"
                    onPointerDown={startHold}
                    onPointerUp={() => cancelHold("Verification failed. Keep holding.")}
                    onPointerCancel={() => cancelHold("Action cancelled.")}
                    onPointerLeave={() => cancelHold("Action cancelled.")}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative h-16 w-full overflow-hidden rounded-2xl bg-white/5 text-sm font-black uppercase tracking-widest transition-all duration-300",
                      isHolding ? "text-[#25D366]" : "text-white/70 hover:bg-white/10"
                    )}
                    aria-live="polite"
                  >
                    {/* Fill Level */}
                    <motion.div 
                      className="absolute inset-y-0 left-0 bg-[#25D366]/20"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "tween", ease: "linear" }}
                    />
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isHolding ? <Zap size={16} className="animate-pulse" /> : <Smartphone size={16} />}
                      {progress > 0 ? `${Math.round(progress)}% Verified` : "Hold to Unlock"}
                    </span>
                  </motion.button>

                  <div className="flex items-center justify-between px-2">
                     <p className={cn(
                       "text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-300",
                       isHolding ? "text-[#25D366]" : "text-white/30"
                     )}>
                       {message}
                     </p>
                     <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "h-1 w-4 rounded-full transition-colors duration-500",
                              progress > (i + 1) * 33 ? "bg-[#25D366]" : "bg-white/10"
                            )} 
                          />
                        ))}
                     </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#25D366]/10 blur-3xl" />
              <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

