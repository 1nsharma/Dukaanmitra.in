'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';
import { Bot } from 'lucide-react';
import { uiEmitter } from '@/lib/ui-event-emitter';

// --- CONFIGURATION ---
const SELECTORS = '#features, #pricing';
const SPEECH_MAP: Record<string, string> = {
  '#features': 'Features dekho!',
  '#pricing': 'Plans yahaan hain.',
};
const CLICK_PHRASES = [
    'Main DukaanMitra ka AI assistant hoon! Main aapko batata hoon ki hum aapke business ko kaise badal sakte hain.',
    'Udhaar manage karna aasaan hai! Sirf WhatsApp par "Ravi 500 udhaar" likho, baaki main sambhal lunga.',
    'Customers ko automatic payment reminders bhejna chahte ho? Main kar sakta hoon!',
    'Har raat aapke WhatsApp par automatic sales report paayein. Taki aapko hamesha pata ho business kaisa chal raha hai.',
    'Jaano kaunse customer sabse valuable hain aur kaunse products best-seller hain, sab AI-powered insights se.',
    'Click me again for more tips, or use the main chat assistant for a full demo!'
];
const IDLE_PHRASES = [
    "Need help? Just click me!",
    "Curious about a feature? Let me know.",
    "The free trial is just one click away!",
];
const ROBOT_SIZE = 140;

// --- HOOKS ---

// Hook for Page Awareness
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
      { threshold: 0.6 }
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

// Hook for Mouse Position
const useMousePosition = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [x, y]);

  return { x, y };
};

// --- SUB-COMPONENTS ---

// Enhanced SVG Component for the Robot
const RobotSvg = ({ isScrolling, mouseX }: { isScrolling: boolean, mouseX: any }) => {
  const springConfig = { stiffness: 100, damping: 20 };
  
  // Create a springy motion value for the head rotation based on mouse X position
  const headRotate = useSpring(
    useTransform(mouseX, [0, window.innerWidth], [-25, 25]),
    springConfig
  );
  
  // Springy motion for body tilt
  const bodyTilt = useSpring(
    useTransform(mouseX, [0, window.innerWidth], [-8, 8]),
    springConfig
  );

  const eyeBlinkAnimation = {
    scaleY: [1, 0.1, 1],
    transition: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 },
  };

  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      className="motion-safe:animate-none"
    >
      <defs>
        <radialGradient id="robot-gradient" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--secondary))", stopOpacity: 0.3 }} />
        </radialGradient>
      </defs>

      {/* Body Group with tilt */}
      <motion.g style={{ rotate: bodyTilt, transformOrigin: '50% 90%' }}>
        <rect x="20" y="40" width="60" height="55" rx="10" fill="url(#robot-gradient)" className="stroke-border" strokeWidth="2" />
        <rect x="35" y="55" width="30" height="25" rx="5" className="fill-background/50" />
      </motion.g>

      {/* Head Group with rotation */}
      <motion.g style={{ rotate: headRotate, transformOrigin: '50% 40%' }}>
        <rect x="30" y="10" width="40" height="30" rx="8" className="fill-secondary stroke-border" strokeWidth="2" />
        {/* Eyes */}
        <motion.circle cx="42" cy="25" r="4" className={cn('transition-colors', isScrolling ? 'fill-accent' : 'fill-primary')} animate={eyeBlinkAnimation} />
        <motion.circle cx="58" cy="25" r="4" className={cn('transition-colors', isScrolling ? 'fill-accent' : 'fill-primary')} animate={eyeBlinkAnimation} />
        {/* Antenna */}
        <line x1="50" y1="10" x2="50" y2="0" className="stroke-primary/50" strokeWidth="2" />
        <motion.circle
          cx="50" cy="-2" r="3"
          className={cn('transition-colors', isScrolling ? 'fill-accent' : 'fill-primary')}
          animate={{ scale: [1, 1.5, 1], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        />
      </motion.g>
    </motion.svg>
  );
};

// Speech Bubble Component
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
  const { x: mouseX } = useMousePosition();
  const [speech, setSpeech] = useState<string | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpokenSectionRef = useRef<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
      setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const showRobot = () => setIsVisible(true);
    uiEmitter.on('close-chat', showRobot);

    return () => {
        uiEmitter.off('close-chat', showRobot);
    }
  }, [isClient]);

  // Centralized function to manage speech bubble state and timers
  const setRobotSpeech = (text: string, duration: number) => {
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    setSpeech(text);
    if (text) {
      speechTimerRef.current = setTimeout(() => {
        setSpeech(null);
      }, duration);
    }
  };

  // Effect for scroll-based speech
  useEffect(() => {
    if (!isClient) return;
    
    if (isScrolling) {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      setSpeech(null); // Clear speech immediately when scrolling starts
      return;
    }

    if (activeSection && SPEECH_MAP[activeSection] && lastSpokenSectionRef.current !== activeSection) {
      setRobotSpeech(SPEECH_MAP[activeSection], 3000);
      lastSpokenSectionRef.current = activeSection;
    }
  }, [activeSection, isScrolling, isClient]);

  // Effect for idle-based speech (reacting to cursor inactivity)
  useEffect(() => {
    if (!isClient) return;

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      
      idleTimerRef.current = setTimeout(() => {
        const randomPhrase = IDLE_PHRASES[Math.floor(Math.random() * IDLE_PHRASES.length)];
        // Only show idle message if no other speech is currently active
        if (!speech) {
            setRobotSpeech(randomPhrase, 4000);
        }
      }, 8000); // 8-second idle timeout
    };

    const handleInteraction = () => {
      // Any user interaction (mouse, scroll, click) resets the idle timer
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('click', handleInteraction);

    resetIdleTimer(); // Start the timer initially

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, [isClient, speech]); // Rerun this effect if `speech` changes to avoid idle timer overwriting active speech

  // Click handler for the robot
  const handleRobotClick = () => {
    // Hide the robot and open the main chat assistant
    setIsVisible(false);
    uiEmitter.emit('open-chat');
  };
  
  if (!isClient) {
      return null;
  }

  return (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.5 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed bottom-6 left-6 z-50 cursor-pointer"
                style={{ width: ROBOT_SIZE, height: ROBOT_SIZE }}
                onClick={handleRobotClick}
                aria-label="Chat with Mitraa Robot"
                role="button"
            >
              <div
                className={cn(
                  'relative w-full h-full rounded-2xl p-2 transition-all duration-300',
                  'bg-card/50 backdrop-blur-lg border border-border/80',
                  'shadow-heavy shadow-primary/10'
                )}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 px-2 py-1 flex items-center justify-center gap-1.5 text-xs font-mono rounded-full bg-background/50 border border-border/50 text-muted-foreground">
                  <Bot size={12} className="text-primary" />
                  MITRAA
                </div>

                <div className="w-full h-full mt-4">
                  <RobotSvg isScrolling={isScrolling} mouseX={mouseX} />
                </div>

                <AnimatePresence>
                  {speech && <SpeechBubble text={speech} />}
                </AnimatePresence>
              </div>
            </motion.div>
        )}
    </AnimatePresence>
  );
}
