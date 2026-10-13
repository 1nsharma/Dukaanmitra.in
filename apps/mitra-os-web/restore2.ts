import fs from 'fs';

let lp = fs.readFileSync('components/LandingPage.tsx', 'utf8');

const featuresStr = `const features = [
    { title: "WhatsApp-First", desc: "Manage your entire shop via WhatsApp—no app needed.", benefit: "Zero learning curve, high adoption.", icon: "📱" },
    { title: "AI-Powered Munim", desc: "Type 'Rahul 500 Chini' and let AI extract customer, amount, and item.", benefit: "Saves time, reduces errors.", icon: "🧠" },
    { title: "Auto Ledger", desc: "Every transaction updates Google Sheets/SQL in real time.", benefit: "Always accurate books, no manual entry.", icon: "📑" },
    { title: "Udhaar Tracking", desc: "Instant udhaar statements for customers.", benefit: "Reduces defaults, builds trust.", icon: "📄" },
    { title: "Daily Reports", desc: "End-of-day sales, udhaar, and inventory summaries sent via WhatsApp.", benefit: "Stay informed without effort.", icon: "📊" },
    { title: "Retail Intel", desc: "AI-driven insights on stock trends and customer behavior.", benefit: "Make data-backed decisions.", icon: "💡" },
  ];`;

const flowStr = `const dukaanFlow = [
    { title: "Smart Ingress", desc: "Customer buys an item. Shopkeeper types 'Rahul 500 Chini' in WhatsApp.", icon: "📱", color: "indigo", tech: "WhatsApp API + NLP", detail: "99.9% extraction accuracy for Indian names and items." },
    { title: "AI Reasoning", desc: "Munim AI parses the message: Customer, Amount, and Item extraction.", icon: "🧠", color: "emerald", tech: "Gemini / BERT", detail: "Context-aware parsing handles slang and local dialects." },
    { title: "Ledger Update", desc: "Transaction is logged in Google Sheets or SQL DB automatically.", icon: "📑", color: "blue", tech: "Firebase + Sheets API", detail: "Real-time sync with 0.5s latency across all devices." },
    { title: "Auto Statement", desc: "Customer gets receipt. Shopkeeper gets EOD report with sales & udhaar.", icon: "📄", color: "amber", tech: "Automated Triggers", detail: "Reduces manual calculation time by 95% daily." },
  ];`;

// Replace features array
lp = lp.replace(/const features = \[[\s\S]*?\];/, featuresStr);
// Replace dukaanFlow array
lp = lp.replace(/const dukaanFlow = \[[\s\S]*?\];/, flowStr);

// Replace testimonials
lp = lp.replace(/const testimonials = \[[\s\S]*?\];/, `const testimonials = [
    { name: "Rajesh", shop: "Kirana Store Owner, Kanpur", quote: "DukaanMitra ne mere 4 ghante ka kaam 10 minute ka kar diya. Ab WhatsApp pe hi sab ho jaata hai!", icon: "👨‍🌾" },
    { name: "Suresh", shop: "General Store, Lucknow", quote: "Udhaar mangne mein sharam aati thi, ab Munim AI apne aap reminder bhej deta hai. Paisa time pe mil raha hai.", icon: "🏪" },
    { name: "Meena", shop: "Dairy Booth, Delhi", quote: "Inventory management ab bahut asaan hai. WhatsApp pe hi pata chal jata hai kya khatam ho raha hai.", icon: "🥛" },
  ];`);

// Fix headings
lp = lp.replace(/The Spatial <br\/>[\s\S]*?Web Interface[\s\S]*?of the Future/g, `India's First <br/>\\n              <span className="text-emerald-400">AI WhatsApp Munim</span> <br/>\\n              for Kirana Stores`);
lp = lp.replace(/We aren't selling a product. We are building a vision of how websites should feel. Control the entire experience seamlessly through air gestures and AI integration./g, `Transform your Kirana shop with India's first AI-powered WhatsApp Munim. No app downloads. Just message "Rahul 500" and you're done.`);

lp = lp.replace(/JOIN THE EARLY ACCESS WAITLIST 🚀/g, `START FREE ON WHATSAPP ➔`);
lp = lp.replace(/ENTER AGENT SOCIETY 🤖/g, `SEE HOW IT WORKS`);

// Fix "A System Built to Enhance Human Interaction" block
lp = lp.replace(/A System Built to Enhance Human Interaction/g, `Comprehensive AI Shop Automation Platform`);
lp = lp.replace(/This environment serves as a functional demonstration[\s\S]*?boundaries of what is possible within a web browser constraint./g, `DukaanMitra is revolutionizing how local retail operates across India by acting as your digital Munim built entirely on the WhatsApp ecosystem. Traditional bookkeeping using manual ledgers and paper receipts is prone to errors, missing udhaar (credit) entries, and lost sales data. Empowering local retailers with smart AI solutions means you no longer need complex POS hardware or a steep learning curve to digitize your storefront. By integrating seamless natural language processing (NLP), our platform extracts meaningful transactional data from casual conversational text.`);
lp = lp.replace(/By leveraging device-agnostic computer vision[\s\S]*?This is the new standard we demand of our own architecture./g, `Our intelligence engine categorizes every entry—whether it is an inventory restock log, a customer's pending credit, or a daily sales total—with 99.9% semantic accuracy tailored explicitly for local Indian dialects and Kirana store nomenclature. This provides unparalleled value propositions, including zero-onboarding friction, completely automated end-of-day sales reporting, and instant digital receipts delivered directly to your customer's WhatsApp inbox. DukaanMitra is built to support your growth, helping you transform a conventional neighborhood shop into a highly structured, data-driven retail business without ever downloading a separate application.`);


fs.writeFileSync('components/LandingPage.tsx', lp);
console.log('Restored LandingPage arrays and hero');

