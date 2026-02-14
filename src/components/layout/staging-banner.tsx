'use client';

import { AlertTriangle } from 'lucide-react';

export default function StagingBanner() {
  if (process.env.NEXT_PUBLIC_APP_ENV !== 'staging') {
    return null;
  }

  return (
    <div className="bg-yellow-500 text-black font-bold text-center py-2 px-4 flex items-center justify-center gap-2 sticky top-0 z-[200]">
      <AlertTriangle className="w-5 h-5" />
      <span>STAGING ENVIRONMENT – FOR TESTING PURPOSES ONLY</span>
    </div>
  );
}
