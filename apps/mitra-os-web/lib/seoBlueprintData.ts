export interface KeywordCategory {
  title: string;
  intent: 'High (Money)' | 'Medium (Comparison)' | 'Low (Educational)' | 'Local (Growth)' | 'Brand (Navigation)' | 'AI (AEO)';
  difficulty: 'Low' | 'Medium' | 'High';
  estimatedVolume: number;
  seedKeywords: string[];
  generatedCount: number;
}

export const seoBlueprintMatrix: Record<string, KeywordCategory> = {
  primary_business: {
    title: "Primary Business Keywords (Core OS)",
    intent: 'High (Money)',
    difficulty: 'High',
    estimatedVolume: 85000,
    seedKeywords: [
      "AI Dukaan Management", "Dukaan Management Software", "Kirana Store Software",
      "Retail Management System", "Retail Business OS", "Smart Retail Platform",
      "Small Business Management Software", "Digital Dukaan Solution",
      "Retail Automation Platform", "Bharat Commerce OS"
    ],
    generatedCount: 15
  },
  ai_keywords: {
    title: "AI Keywords (AEO & Future)",
    intent: 'AI (AEO)',
    difficulty: 'Medium',
    estimatedVolume: 42000,
    seedKeywords: [
      "AI for Retail", "AI Business Assistant", "AI Retail Automation",
      "AI Inventory Management", "AI Accounting Assistant", "AI Ledger Management",
      "AI Commerce Platform", "Generative AI for Retail", "Agentic AI Commerce",
      "Autonomous Business Operations"
    ],
    generatedCount: 20
  },
  whatsapp_commerce: {
    title: "WhatsApp First Commerce (Differentiator)",
    intent: 'High (Money)',
    difficulty: 'Low',
    estimatedVolume: 32000,
    seedKeywords: [
      "WhatsApp Business Automation", "WhatsApp ERP", "WhatsApp CRM",
      "WhatsApp Billing System", "WhatsApp Inventory Management", "WhatsApp Accounting",
      "WhatsApp Udhaar Book", "WhatsApp Business Assistant", "No App Business Software",
      "WhatsApp Commerce Platform"
    ],
    generatedCount: 89
  },
  finance_udhaar: {
    title: "Finance & Udhaar (Core Action)",
    intent: 'High (Money)',
    difficulty: 'Low',
    estimatedVolume: 45000,
    seedKeywords: [
      "Digital Khata", "Udhaar Management", "Credit Book App",
      "AI Munim", "Smart Ledger", "Digital Munim",
      "Business Accounting Automation", "Customer Credit Tracking",
      "Payment Reminder Automation", "AI Bookkeeping"
    ],
    generatedCount: 156
  },
  inventory_management: {
    title: "Inventory Keywords (Operations)",
    intent: 'Medium (Comparison)',
    difficulty: 'Medium',
    estimatedVolume: 38000,
    seedKeywords: [
      "Inventory Management Software", "Stock Management System", "Smart Inventory Tracking",
      "Retail Stock Analytics", "Automated Inventory Control", "Product Management Software",
      "Warehouse Management", "Purchase Management", "FMCG Inventory Management",
      "AI Stock Prediction"
    ],
    generatedCount: 45
  },
  analytics: {
    title: "Analytics Keywords (Insights)",
    intent: 'Low (Educational)',
    difficulty: 'Low',
    estimatedVolume: 24000,
    seedKeywords: [
      "Business Intelligence", "Retail Analytics", "Sales Analytics",
      "Customer Analytics", "AI Insights", "Business Dashboard",
      "Retail Performance Tracking", "Predictive Analytics",
      "Business Reports Automation", "Growth Intelligence"
    ],
    generatedCount: 30
  },
  bharat_local: {
    title: "Bharat / Local Market (Mass Local)",
    intent: 'Local (Growth)',
    difficulty: 'Low',
    estimatedVolume: 120000,
    seedKeywords: [
      "Kirana Tech", "Bharat Commerce", "India Retail Tech",
      "Local Business Digitization", "MSME Software", "Small Shop Software",
      "Kirana Automation", "Vyapar Automation", "Merchant OS",
      "Bharat AI Platform"
    ],
    generatedCount: 400
  },
  brand_hidden: {
    title: "Brand Hidden Keywords (SEO + AI)",
    intent: 'Brand (Navigation)',
    difficulty: 'Low',
    estimatedVolume: 15000,
    seedKeywords: [
      "DukaanMitra", "MitraOS", "Munim AI", "DukaanMitra AI",
      "DukaanMitra ERP", "DukaanMitra WhatsApp", "AI Munim Bharat",
      "Bharat Retail OS", "WhatsApp First Commerce", "Future of Kirana Commerce"
    ],
    generatedCount: 10
  },
  high_intent: {
    title: "High Intent SEO (Bottom Funnel)",
    intent: 'High (Money)',
    difficulty: 'High',
    estimatedVolume: 65000,
    seedKeywords: [
      "Best Kirana Store Software India", "WhatsApp Based Business Software",
      "AI Software For Small Business", "Digital Udhaar Management App",
      "Retail Automation Software India", "AI Accounting Software For Shops",
      "Inventory Software For Kirana Stores", "Business Management App For Retailers",
      "WhatsApp ERP For Small Business", "AI Munim For Shop Owners"
    ],
    generatedCount: 25
  },
  competitor_alternatives: {
    title: "Competitor Alternatives (Siphon Traffic)",
    intent: 'Medium (Comparison)',
    difficulty: 'Medium',
    estimatedVolume: 65000,
    seedKeywords: [
      "khatabook alternative", "okcredit similar app", "vyapar app replacement", 
      "better than khatabook", "dukaanmitra vs vyapar"
    ],
    generatedCount: 45
  },
  hinglish_vernacular: {
    title: "Hinglish Queries (Fastest Ranking)",
    intent: 'Low (Educational)',
    difficulty: 'Low',
    estimatedVolume: 85000,
    seedKeywords: [
      "udhaar ka hisaab kaise rakhe", "dukaan online kaise laye", "bina app ke hisaab", 
      "whatsapp se saman kaise beche", "kirana store ka hisaab kitab"
    ],
    generatedCount: 215
  },
};

export const generateSampleKeywords = () => {
  return [
    { term: "AI Dukaan Management", difficulty: 45, volume: 8500, intent: "Transactional / Buy" },
    { term: "DukaanMitra", difficulty: 10, volume: 45000, intent: "Navigational / Brand" },
    { term: "WhatsApp ERP For Small Business", difficulty: 25, volume: 3200, intent: "Transactional / Buy" },
    { term: "AI Munim For Shop Owners", difficulty: 15, volume: 1800, intent: "Transactional / Buy" },
    { term: "Bharat Commerce OS", difficulty: 22, volume: 4100, intent: "Educational / Problem" },
    { term: "best udhaar app india 2026", difficulty: 21, volume: 1200, intent: "Transactional / Buy" },
    { term: "khatabook alternative for pc", difficulty: 24, volume: 2100, intent: "Comparison / Switch" },
    { term: "how to get google reviews automatically", difficulty: 18, volume: 3200, intent: "Educational / Growth" },
    { term: "bina app ke dukaan kaise manage kare", difficulty: 5, volume: 5600, intent: "Vernacular / Problem" },
    { term: "Digital Khata", difficulty: 35, volume: 15000, intent: "Educational / Problem" },
  ];
};
