
"use client";

import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-3 cursor-pointer mb-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-black italic">D</span>
                </div>
                <h1 className="text-3xl font-black italic tracking-tighter text-white">DukaanMitra</h1>
              </Link>
              <p className="text-sm max-w-sm">
                Transform your Kirana shop with India's first AI-powered WhatsApp Munim. No app downloads. Just message and you're done.
              </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">Docs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
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
        </div>
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm">
          <p>Built with Next.js and ❤️ in India.</p>
        </div>
      </div>
    </footer>
  );
}
