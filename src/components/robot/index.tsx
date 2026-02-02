
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';

// --- CONFIGURATION ---
const SELECTORS = '#features, #pricing';
const SPEECH_MAP: Record<string, string> = {
  '#features': 'Features dekho!',
  '#pricing': 'Plans yahaan hain.',
};
const ROBOT_SIZE = 180;

// --- HOOK for Page Awareness ---
const useRobotAwareness = (selectors: string) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastActiveSectionRef = useRef<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const elements = document.querySelectorAll(selectors);
    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = `#${entry.target.id}`;
            if (lastActiveSectionRef.current !== currentId) {
              setActiveSection(currentId);
              lastActiveSectionRef.current = currentId;
            }
          }
        });
      },
      { threshold: 0.6 } // Trigger when 60% of the section is visible
    );

    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) observerRef.current.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [selectors]);

  return { activeSection, isScrolling };
};

// --- SVG Component for the Robot ---
const RobotSvg = ({ isScrolling }: { isScrolling: boolean }) => {
  const bodyAnimation = {
    y: [40, 42, 40],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
  };

  const antennaAnimation = {
      scale: [1, 1.5, 1],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  };
  
  const eyeBlinkAnimation = {
      scaleY: [1, 0.1, 1],
      transition: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }
  };

  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="motion-safe:animate-none"
    >
      {/* Body */}
      <motion.rect
        x="20" y="40" width="60" height="50" rx="10"
        className="fill-secondary stroke-border" strokeWidth="2"
        animate={bodyAnimation}
      />
      {/* Head */}
      <motion.g 
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <rect x="30" y="10" width="40" height="30" rx="8" className="fill-secondary stroke-border" strokeWidth="2"/>
        {/* Eyes */}
        <motion.circle cx="42" cy="25" r="4" className={cn("transition-colors", isScrolling ? "fill-accent" : "fill-primary")} animate={eyeBlinkAnimation} />
        <motion.circle cx="58" cy="25" r="4" className={cn("transition-colors", isScrolling ? "fill-accent" : "fill-primary")} animate={eyeBlinkAnimation} />
      </motion.g>
      {/* Antenna */}
      <line x1="50" y1="10" x2="50" y2="0" className="stroke-primary/50" strokeWidth="2" />
      <motion.circle
        cx="50" cy="-2" r="3"
        className={cn("transition-colors", isScrolling ? "fill-accent" : "fill-primary")}
        animate={antennaAnimation}
      />
    </motion.svg>
  );
};


// --- Speech Bubble Component ---
const SpeechBubble = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.9 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="absolute bottom-full mb-4 w-auto whitespace-nowrap rounded-lg bg-card border border-border px-3 py-2 text-sm font-semibold text-foreground shadow-lg"
  >
    {text}
    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-border" />
  </motion.div>
);

// --- Main Robot Component ---
export default function Mitraa() {
  const { activeSection, isScrolling } = useRobotAwareness(SELECTORS);
  const [speech, setSpeech] = useState<string | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenSectionRef = useRef<string | null>(null);

  useEffect(() => {
    // Don't speak while user is actively scrolling
    if (isScrolling) {
      if(speechTimerRef.current) clearTimeout(speechTimerRef.current);
      setSpeech(null);
      return;
    }
    
    // If a new section is active and we haven't spoken about it yet
    if (activeSection && SPEECH_MAP[activeSection] && lastSpokenSectionRef.current !== activeSection) {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      
      setSpeech(SPEECH_MAP[activeSection]);
      lastSpokenSectionRef.current = activeSection;

      speechTimerRef.current = setTimeout(() => {
        setSpeech(null);
      }, 2000); // Show message for 2 seconds
    }

    return () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    };
  }, [activeSection, isScrolling]);

  return (
    <div
      className="fixed bottom-6 left-6 z-50 pointer-events-none"
      style={{ width: ROBOT_SIZE, height: ROBOT_SIZE }}
    >
      <div
        className={cn(
          'relative w-full h-full rounded-2xl p-2 transition-all duration-300',
          'bg-card/50 backdrop-blur-lg border border-border/80',
          'shadow-heavy shadow-primary/10'
        )}
      >
        {/* Cabin Header */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 px-2 py-1 flex items-center justify-center gap-1.5 text-xs font-mono rounded-full bg-background/50 border border-border/50 text-muted-foreground">
            <Bot size={12} className="text-primary" />
            MITRAA
        </div>

        <div className="w-full h-full mt-4">
          <RobotSvg isScrolling={isScrolling} />
        </div>
        
        <AnimatePresence>
          {speech && <SpeechBubble text={speech} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
