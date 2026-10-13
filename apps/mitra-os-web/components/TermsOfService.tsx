import React from "react";
import { ArrowLeft } from "lucide-react";

export const TermsOfService: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-600">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </nav>
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase">
          Terms of Service
        </h1>
        <p className="text-gray-500 font-medium">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-900">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using DukaanMitra, you accept and agree to be bound
            by the terms and provision of this agreement. In addition, when
            using these particular services, you shall be subject to any posted
            guidelines or rules applicable to such services.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            2. Description of Service
          </h2>
          <p>
            DukaanMitra provides merchants with a digital ledger and
            WhatsApp-based management tools. We reserve the right to modify or
            discontinue, temporarily or permanently, the Service with or without
            notice.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">3. User Conduct</h2>
          <p>
            You agree to use the Service only for lawful purposes. You agree not
            to take any action that might compromise the security of the site,
            render the site inaccessible to others or otherwise cause damage to
            the site or the Content.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            4. Limitation of Liability
          </h2>
          <p>
            In no event shall DukaanMitra be liable for any direct, indirect,
            incidental, special, consequential or exemplary damages, including
            but not limited to, damages for loss of profits, goodwill, use, data
            or other intangible losses resulting from the use of or inability to
            use the service.
          </p>
        </div>
      </div>
    </div>
  );
};
