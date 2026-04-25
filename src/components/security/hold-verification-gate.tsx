"use client";

import { useEffect, useRef, useState } from "react";

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
    clearHoldInterval();
    holdStartRef.current = Date.now();
    setMessage("Keep holding...");

    holdIntervalRef.current = setInterval(() => {
      if (!holdStartRef.current) return;

      const elapsed = Date.now() - holdStartRef.current;
      const nextProgress = Math.min((elapsed / REQUIRED_HOLD_MS) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearHoldInterval();
        setIsVerified(true);
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
    }, 50);
  };

  const cancelHold = (status: string) => {
    if (isVerified) return;
    clearHoldInterval();
    holdStartRef.current = null;
    setProgress(0);
    setMessage(status);
  };

  return (
    <>
      {children}
      {mounted && !isVerified && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-4">
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl">
            <h1 className="text-xl font-semibold text-foreground">Human Verification</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Security check: press and hold the button for 2.5 seconds.
            </p>

            <button
              type="button"
              onPointerDown={startHold}
              onPointerUp={() => cancelHold("Verification failed. Try again.")}
              onPointerCancel={() => cancelHold("Verification cancelled. Try again.")}
              onPointerLeave={() => cancelHold("Verification cancelled. Try again.")}
              className="mt-5 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              aria-live="polite"
            >
              Press and Hold to Verify
            </button>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-[width] duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">{message}</p>
          </div>
        </div>
      )}
    </>
  );
}
