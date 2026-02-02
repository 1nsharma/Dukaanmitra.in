'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SELECTORS = '#features, #pricing';

const SPEECH_MAP: Record<string, string> = {
  '#features': 'fix',
  '#pricing': 'fix',
};

/**
 * Custom hook for page awareness using IntersectionObserver and scroll detection.
 * Observes elements matching the selectors and detects scroll activity.
 * @returns An object with the active section ID and a boolean indicating if the user is scrolling.
 */
const useRobotAwareness = (selectors: string) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);

    // Ensure this runs only on the client
    const elements = document.querySelectorAll(selectors);
    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [selectors]);

  return { activeSection, isScrolling };
};

const RobotSvg = () => (
  <motion.svg
    width="120"
    height="120"
    viewBox="0 0 100 100"
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    {/* Body */}
    <motion.rect
      x="20"
      y="40"
      width="60"
      height="50"
      rx="10"
      className="fill-secondary stroke-primary/30"
      strokeWidth="2"
      animate={{ y: [40, 42, 40] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Head */}
    <motion.rect
      x="30"
      y="10"
      width="40"
      height="30"
      rx="8"
      className="fill-secondary stroke-primary/30"
      strokeWidth="2"
    />
    {/* Eyes */}
    <circle cx="42" cy="25" r="3" className="fill-primary" />
    <circle cx="58" cy="25" r="3" className="fill-primary" />
     {/* Antenna */}
    <line x1="50" y1="10" x2="50" y2="0" className="stroke-primary/50" strokeWidth="2" />
    <motion.circle 
      cx="50" cy="-2" r="3" className="fill-primary" 
      animate={{ scale: [1, 1.5, 1]}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.svg>
);

const SpeechBubble = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 10, scale: 0.9 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="absolute bottom-full mb-4 w-auto whitespace-nowrap rounded-lg bg-card border border-border px-3 py-2 text-sm text-foreground shadow-lg"
  >
    {text}
    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-border" />
  </motion.div>
);

export default function Mitraa() {
  const { activeSection } = useRobotAwareness(SELECTORS);
  const [speech, setSpeech] = useState<string | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
    }

    if (activeSection && SPEECH_MAP[activeSection]) {
      setSpeech(SPEECH_MAP[activeSection]);
      speechTimerRef.current = setTimeout(() => {
        setSpeech(null);
      }, 1500); // Show message for 1.5 seconds
    } else {
      setSpeech(null);
    }

    return () => {
      if (speechTimerRef.current) {
        clearTimeout(speechTimerRef.current);
      }
    };
  }, [activeSection]);

  return (
    <div className="fixed bottom-6 left-6 z-50 w-[150px] h-[150px] pointer-events-none flex items-center justify-center">
      <div className={cn(
        'relative w-full h-full rounded-2xl p-2 transition-all duration-300',
        'bg-card/30 backdrop-blur-md border border-primary/20',
        'shadow-heavy shadow-primary/10'
      )}>
        <RobotSvg />
        <AnimatePresence>
          {speech && <SpeechBubble text={speech} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
