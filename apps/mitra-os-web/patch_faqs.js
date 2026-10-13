import fs from 'fs';
let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

const newFaqs = `
  const faqs = [
    { q: "What is DukaanMitra?", a: "DukaanMitra is an AI-powered WhatsApp Business Operating System designed specifically for Indian Kirana stores and retail businesses to manage billing, inventory, and udhaar automatically." },
    { q: "How does WhatsApp Billing work?", a: "You simply type a message like 'Ramesh 500 Sugar' and our AI Munim automatically generates a professional GST or non-GST bill and sends it to the customer's WhatsApp instantly." },
    { q: "Can I manage inventory with it?", a: "Yes, every time you log a sale, the AI automatically deducts the items from your inventory and alerts you when stock is low, preventing stockouts." },
    { q: "Can AI read Hindi or Hinglish?", a: "Absolutely. DukaanMitra's AI is trained on Indian local dialects and perfectly understands Hinglish (e.g., '2 kilo aalu udhaar') and updates the ledger accurately." },
    { q: "How is DukaanMitra different from Vyapar or Khatabook?", a: "Unlike Vyapar or Khatabook which require you to download an app and fill out complex forms, DukaanMitra works 100% inside WhatsApp using natural chat, saving you 2 hours daily." },
    { q: "How do I start using DukaanMitra?", a: "Simply send 'START' to our WhatsApp number +91 63937 41171. No app download is required." },
    { q: "Is my data safe?", a: "Yes, we use enterprise-grade encryption and secure cloud storage (Firebase) to ensure your shop's data is always protected." }
  ];
`;

content = content.replace(/const faqs = \[\s*\{ q: "How do I start.*?\];/s, newFaqs);

fs.writeFileSync('components/LandingPage.tsx', content);
console.log("Patched LandingPage FAQs!");
