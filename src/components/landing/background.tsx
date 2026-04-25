
'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 bg-background overflow-hidden transition-colors duration-700">
      {/* Precision Grid Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.3] dark:opacity-[0.1]" />
      
      {/* Subtle Depth Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full"
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-mercantile-ink/5 dark:bg-white/5 blur-[150px] rounded-full"
      />

      {/* Heritage Texture Overlay */}
      <div className="noise absolute inset-0 mix-blend-multiply dark:mix-blend-overlay" />
      
      {/* Left Margin Line (Ledger Style) */}
      <div className="absolute left-[5%] top-0 bottom-0 w-px bg-secondary/10 hidden md:block" />
      <div className="absolute left-[5.2%] top-0 bottom-0 w-px bg-secondary/5 hidden md:block" />
    </div>
  );
}

