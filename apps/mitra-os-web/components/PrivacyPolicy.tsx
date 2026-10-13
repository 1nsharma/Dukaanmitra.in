import React from "react";
import { ArrowLeft } from "lucide-react";

export const PrivacyPolicy: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
          Privacy Policy
        </h1>
        <p className="text-gray-500 font-medium">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-2xl font-bold text-gray-900">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us, such as when you
            create or modify your account, request on-demand services, contact
            customer support, or otherwise communicate with us. This information
            may include: name, email, phone number, postal address, profile
            picture, payment method, items requested (for delivery services),
            delivery notes, and other information you choose to provide.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">
            2. How We Use Your Information
          </h2>
          <p>We may use the information we collect about you to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our Services.</li>
            <li>
              Perform internal operations, including, for example, to prevent
              fraud and abuse of our Services.
            </li>
            <li>
              Send or facilitate communications between you and a merchant.
            </li>
            <li>
              Send you communications we think will be of interest to you.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900">3. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse and unauthorized access, disclosure,
            alteration and destruction.
          </p>

          <h2 className="text-2xl font-bold text-gray-900">4. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at support@dukaanmitra.com.
          </p>
        </div>
      </div>
    </div>
  );
};
