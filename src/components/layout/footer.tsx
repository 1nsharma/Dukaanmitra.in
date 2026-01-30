
"use client";

import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built with Next.js and ❤️ in India.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="h-5 w-5 transition-colors hover:text-white" />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5 transition-colors hover:text-white" />
          </Link>
          <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 transition-colors hover:text-white" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
