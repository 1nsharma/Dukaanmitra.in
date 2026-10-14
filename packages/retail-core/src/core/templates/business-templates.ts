/**
 * Business template registry.
 *
 * Every supported business type ships as a template with:
 *  - pre-generated starter inventory (SKUs, units, typical prices, tax rates)
 *  - pre-generated service catalog (for service businesses)
 *  - an onboarding flow (UPI-simple: verify phone -> pick template -> confirm starter list -> done)
 *
 * Templates are SEEDS, not cages — everything generated from them is fully
 * editable by the merchant directly or via AI (voice / photo / OCR / chat).
 */

export interface TemplateSku {
  sku: string;
  name: string;
  category: string;
  unit: string;            // pcs | kg | litre | ml | packet | dozen | service
  costPrice: number;       // typical indicative price (editable)
  sellPrice: number;
  taxRate: number;         // GST %
  openingStock: number;
  lowStockAlert: number;
  isService?: boolean;
}

export interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  input: 'auto' | 'choose' | 'confirm' | 'optional';
}

export interface BusinessTemplateDef {
  key: string;
  name: string;
  category: 'retail' | 'services' | 'food' | 'health' | 'education' | 'auto' | 'other';
  storeType: 'retail' | 'services' | 'hybrid';
  description: string;
  skus: TemplateSku[];
  workflows: string[];     // which agents/automations turn on by default
  onboarding: OnboardingStep[];
}

const standardOnboarding = (name: string): OnboardingStep[] => [
  { key: 'verify', title: 'Verify phone', description: 'WhatsApp/app number verified via OTP — like UPI login.', input: 'auto' },
  { key: 'pick', title: `Business type: ${name}`, description: 'Already picked — change anytime.', input: 'choose' },
  { key: 'inventory', title: 'Confirm starter inventory', description: `${name} items pre-filled with typical prices. Edit, delete, or add by voice/photo/text.`, input: 'confirm' },
  { key: 'done', title: 'Start selling', description: 'Send a bill photo, a voice note, or tap "+ Sale". DukaanMitra handles the rest.', input: 'auto' },
];

export const BUSINESS_TEMPLATES: BusinessTemplateDef[] = [
  {
    key: 'kirana',
    name: 'Kirana / General Store',
    category: 'retail',
    storeType: 'retail',
    description: 'Daily groceries, staples, snacks and household items.',
    workflows: ['bill_parser', 'inventory', 'customer_intelligence', 'low_stock_alerts'],
    skus: [
      { sku: 'atta-1kg', name: 'Atta (Wheat Flour) 1kg', category: 'Stapals', unit: 'packet', costPrice: 38, sellPrice: 45, taxRate: 0, openingStock: 40, lowStockAlert: 10 },
      { sku: 'rice-5kg', name: 'Sona Masoori Rice 5kg', category: 'Stapals', unit: 'packet', costPrice: 260, sellPrice: 300, taxRate: 5, openingStock: 20, lowStockAlert: 5 },
      { sku: 'dal-tur-1kg', name: 'Toor Dal 1kg', category: 'Stapals', unit: 'kg', costPrice: 130, sellPrice: 155, taxRate: 5, openingStock: 25, lowStockAlert: 8 },
      { sku: 'oil-sun-1l', name: 'Sunflower Oil 1L', category: 'Oils', unit: 'litre', costPrice: 135, sellPrice: 155, taxRate: 5, openingStock: 24, lowStockAlert: 6 },
      { sku: 'sugar-1kg', name: 'Sugar 1kg', category: 'Stapals', unit: 'kg', costPrice: 42, sellPrice: 50, taxRate: 5, openingStock: 30, lowStockAlert: 10 },
      { sku: 'salt-1kg', name: 'Iodised Salt 1kg', category: 'Stapals', unit: 'packet', costPrice: 22, sellPrice: 28, taxRate: 0, openingStock: 30, lowStockAlert: 10 },
      { sku: 'tea-250g', name: 'Tea 250g', category: 'Beverages', unit: 'packet', costPrice: 110, sellPrice: 140, taxRate: 5, openingStock: 15, lowStockAlert: 5 },
      { sku: 'milk-500ml', name: 'Toned Milk 500ml', category: 'Dairy', unit: 'pcs', costPrice: 26, sellPrice: 30, taxRate: 0, openingStock: 40, lowStockAlert: 15 },
      { sku: 'bread-pav', name: 'Bread Pav (pkt)', category: 'Bakery', unit: 'packet', costPrice: 28, sellPrice: 35, taxRate: 5, openingStock: 20, lowStockAlert: 8 },
      { sku: 'biscuit-nmc', name: 'Marie Biscuits 200g', category: 'Snacks', unit: 'packet', costPrice: 25, sellPrice: 35, taxRate: 18, openingStock: 40, lowStockAlert: 12 },
      { sku: 'detergent-1kg', name: 'Detergent Powder 1kg', category: 'Household', unit: 'packet', costPrice: 95, sellPrice: 120, taxRate: 18, openingStock: 15, lowStockAlert: 5 },
      { sku: 'soap-bath', name: 'Bath Soap', category: 'Personal Care', unit: 'pcs', costPrice: 28, sellPrice: 38, taxRate: 18, openingStock: 50, lowStockAlert: 15 },
    ],
    onboarding: standardOnboarding('Kirana'),
  },
  {
    key: 'pharmacy',
    name: 'Medical Store / Pharmacy',
    category: 'health',
    storeType: 'retail',
    description: 'Medicines, wellness products, first-aid essentials.',
    workflows: ['bill_parser', 'inventory', 'expiry_watch', 'low_stock_alerts'],
    skus: [
      { sku: 'paracet-500', name: 'Paracetamol 500mg (strip)', category: 'OTC', unit: 'packet', costPrice: 18, sellPrice: 30, taxRate: 12, openingStock: 60, lowStockAlert: 20 },
      { sku: 'cetirizine', name: 'Cetirizine 10mg (strip)', category: 'OTC', unit: 'packet', costPrice: 22, sellPrice: 35, taxRate: 12, openingStock: 40, lowStockAlert: 15 },
      { sku: 'ORS-pkt', name: 'ORS Sachet', category: 'Wellness', unit: 'packet', costPrice: 18, sellPrice: 25, taxRate: 12, openingStock: 50, lowStockAlert: 15 },
      { sku: 'vitc-500', name: 'Vitamin C 500mg (strip)', category: 'Wellness', unit: 'packet', costPrice: 60, sellPrice: 90, taxRate: 12, openingStock: 30, lowStockAlert: 10 },
      { sku: 'dettol-100', name: 'Antiseptic Liquid 100ml', category: 'First Aid', unit: 'pcs', costPrice: 72, sellPrice: 95, taxRate: 12, openingStock: 25, lowStockAlert: 8 },
      { sku: 'bandage-roll', name: 'Adhesive Bandage Roll', category: 'First Aid', unit: 'pcs', costPrice: 35, sellPrice: 55, taxRate: 12, openingStock: 30, lowStockAlert: 10 },
      { sku: 'syringe-5ml', name: 'Disposable Syringe 5ml', category: 'Devices', unit: 'pcs', costPrice: 8, sellPrice: 15, taxRate: 12, openingStock: 100, lowStockAlert: 30 },
      { sku: 'glucometer-strip', name: 'Glucometer Test Strips', category: 'Devices', unit: 'packet', costPrice: 480, sellPrice: 600, taxRate: 12, openingStock: 10, lowStockAlert: 4 },
    ],
    onboarding: standardOnboarding('Pharmacy'),
  },
  {
    key: 'salon',
    name: 'Beauty Salon / Parlour',
    category: 'services',
    storeType: 'services',
    description: 'Hair, skin, and grooming services with product retail.',
    workflows: ['booking', 'inventory', 'customer_intelligence', 'reply_generator'],
    skus: [
      { sku: 'svc-haircut', name: 'Haircut', category: 'Hair', unit: 'service', costPrice: 0, sellPrice: 200, taxRate: 18, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'svc-facial', name: 'Basic Facial', category: 'Skin', unit: 'service', costPrice: 150, sellPrice: 800, taxRate: 18, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'svc-threading', name: 'Threading (Eyebrow)', category: 'Grooming', unit: 'service', costPrice: 0, sellPrice: 80, taxRate: 18, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'svc-headmassage', name: 'Head Massage', category: 'Hair', unit: 'service', costPrice: 0, sellPrice: 150, taxRate: 18, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'shampoo-200', name: 'Shampoo 200ml (retail)', category: 'Products', unit: 'pcs', costPrice: 90, sellPrice: 140, taxRate: 18, openingStock: 20, lowStockAlert: 6 },
      { sku: 'hair-oil-100', name: 'Hair Oil 100ml (retail)', category: 'Products', unit: 'pcs', costPrice: 60, sellPrice: 95, taxRate: 18, openingStock: 20, lowStockAlert: 6 },
    ],
    onboarding: standardOnboarding('Salon'),
  },
  {
    key: 'restaurant',
    name: 'Restaurant / Cafe / Dhaba',
    category: 'food',
    storeType: 'hybrid',
    description: 'Menu items, kitchen stock, and table billing.',
    workflows: ['bill_parser', 'inventory', 'menu_management', 'customer_intelligence'],
    skus: [
      { sku: 'men-thali-veg', name: 'Veg Thali', category: 'Menu', unit: 'pcs', costPrice: 60, sellPrice: 150, taxRate: 5, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'men-chicken-curry', name: 'Chicken Curry', category: 'Menu', unit: 'pcs', costPrice: 120, sellPrice: 260, taxRate: 5, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'men-biryani', name: 'Biryani', category: 'Menu', unit: 'pcs', costPrice: 90, sellPrice: 220, taxRate: 5, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'men-chai', name: 'Chai', category: 'Beverages', unit: 'pcs', costPrice: 8, sellPrice: 20, taxRate: 5, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'ing-atta-10kg', name: 'Atta 10kg (kitchen)', category: 'Kitchen Stock', unit: 'packet', costPrice: 380, sellPrice: 0, taxRate: 0, openingStock: 10, lowStockAlert: 3 },
      { sku: 'ing-oil-5l', name: 'Cooking Oil 5L (kitchen)', category: 'Kitchen Stock', unit: 'litre', costPrice: 680, sellPrice: 0, taxRate: 5, openingStock: 8, lowStockAlert: 2 },
      { sku: 'ing-onion-1kg', name: 'Onion (kitchen)', category: 'Kitchen Stock', unit: 'kg', costPrice: 30, sellPrice: 0, taxRate: 0, openingStock: 20, lowStockAlert: 5 },
      { sku: 'ing-milk-1l', name: 'Milk 1L (kitchen)', category: 'Kitchen Stock', unit: 'litre', costPrice: 52, sellPrice: 0, taxRate: 0, openingStock: 20, lowStockAlert: 8 },
    ],
    onboarding: standardOnboarding('Restaurant'),
  },
  {
    key: 'mobile-shop',
    name: 'Mobile & Accessories Shop',
    category: 'retail',
    storeType: 'hybrid',
    description: 'Phones, accessories, repairs and recharge.',
    workflows: ['bill_parser', 'inventory', 'serial_tracking', 'repairs', 'customer_intelligence'],
    skus: [
      { sku: 'acc-charger-20w', name: '20W Fast Charger', category: 'Accessories', unit: 'pcs', costPrice: 350, sellPrice: 599, taxRate: 18, openingStock: 30, lowStockAlert: 8 },
      { sku: 'acc-earbuds', name: 'TWS Earbuds', category: 'Accessories', unit: 'pcs', costPrice: 700, sellPrice: 1299, taxRate: 18, openingStock: 20, lowStockAlert: 5 },
      { sku: 'acc-cover-univ', name: 'Universal Phone Cover', category: 'Accessories', unit: 'pcs', costPrice: 60, sellPrice: 199, taxRate: 18, openingStock: 80, lowStockAlert: 20 },
      { sku: 'acc-glass-9h', name: 'Tempered Glass 9H', category: 'Accessories', unit: 'pcs', costPrice: 40, sellPrice: 149, taxRate: 18, openingStock: 80, lowStockAlert: 20 },
      { sku: 'svc-repair-screen', name: 'Screen Replacement (service)', category: 'Services', unit: 'service', costPrice: 1200, sellPrice: 2200, taxRate: 18, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'svc-software', name: 'Software Repair (service)', category: 'Services', unit: 'service', costPrice: 0, sellPrice: 300, taxRate: 18, openingStock: 0, lowStockAlert: 0, isService: true },
    ],
    onboarding: standardOnboarding('Mobile Shop'),
  },
  {
    key: 'garage',
    name: 'Auto Garage / Workshop',
    category: 'auto',
    storeType: 'hybrid',
    description: 'Repairs, servicing, spare parts.',
    workflows: ['job_card', 'inventory', 'customer_intelligence', 'reply_generator'],
    skus: [
      { sku: 'svc-general-service', name: 'General Service (car)', category: 'Services', unit: 'service', costPrice: 400, sellPrice: 1500, taxRate: 18, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'svc-oil-change', name: 'Engine Oil Change', category: 'Services', unit: 'service', costPrice: 300, sellPrice: 900, taxRate: 18, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'prt-oil-1l', name: 'Engine Oil 1L', category: 'Spares', unit: 'litre', costPrice: 420, sellPrice: 650, taxRate: 18, openingStock: 24, lowStockAlert: 8 },
      { sku: 'prt-filter-air', name: 'Air Filter', category: 'Spares', unit: 'pcs', costPrice: 180, sellPrice: 350, taxRate: 18, openingStock: 15, lowStockAlert: 5 },
      { sku: 'prt-brake-pad', name: 'Brake Pad Set', category: 'Spares', unit: 'pcs', costPrice: 600, sellPrice: 1100, taxRate: 18, openingStock: 12, lowStockAlert: 4 },
      { sku: 'prt-plug-set', name: 'Spark Plug Set', category: 'Spares', unit: 'packet', costPrice: 350, sellPrice: 700, taxRate: 18, openingStock: 15, lowStockAlert: 5 },
    ],
    onboarding: standardOnboarding('Garage'),
  },
  {
    key: 'tailor-boutique',
    name: 'Tailor / Boutique',
    category: 'services',
    storeType: 'hybrid',
    description: 'Stitching services with fabric and thread stock.',
    workflows: ['order_tracking', 'inventory', 'customer_intelligence'],
    skus: [
      { sku: 'svc-kurti-stitch', name: 'Kurti Stitching', category: 'Services', unit: 'service', costPrice: 0, sellPrice: 350, taxRate: 5, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'svc-blazer-stitch', name: 'Blazer/Pant Stitching', category: 'Services', unit: 'service', costPrice: 0, sellPrice: 900, taxRate: 5, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'fab-cotton-m', name: 'Cotton Fabric (per mtr)', category: 'Fabrics', unit: 'pcs', costPrice: 120, sellPrice: 200, taxRate: 5, openingStock: 50, lowStockAlert: 15 },
      { sku: 'acc-thread', name: 'Thread Spool', category: 'Accessories', unit: 'pcs', costPrice: 15, sellPrice: 30, taxRate: 18, openingStock: 60, lowStockAlert: 20 },
      { sku: 'acc-zipper', name: 'Zipper (various)', category: 'Accessories', unit: 'pcs', costPrice: 8, sellPrice: 20, taxRate: 18, openingStock: 100, lowStockAlert: 30 },
      { sku: 'acc-buttons', name: 'Buttons (dozen)', category: 'Accessories', unit: 'dozen', costPrice: 10, sellPrice: 25, taxRate: 18, openingStock: 50, lowStockAlert: 15 },
    ],
    onboarding: standardOnboarding('Tailor/Boutique'),
  },
  {
    key: 'tuition-coaching',
    name: 'Tuition / Coaching Centre',
    category: 'education',
    storeType: 'services',
    description: 'Batches, monthly fees, study material.',
    workflows: ['fee_reminders', 'batch_management', 'customer_intelligence'],
    skus: [
      { sku: 'fee-grade6-9', name: 'Grade 6–9 Monthly Fee', category: 'Fees', unit: 'service', costPrice: 0, sellPrice: 1500, taxRate: 0, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'fee-grade10-12', name: 'Grade 10–12 Monthly Fee', category: 'Fees', unit: 'service', costPrice: 0, sellPrice: 2500, taxRate: 0, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'fee-crash-neet', name: 'NEET Crash Course', category: 'Fees', unit: 'service', costPrice: 0, sellPrice: 12000, taxRate: 0, openingStock: 0, lowStockAlert: 0, isService: true },
      { sku: 'mat-workbook', name: 'Workbook (per student)', category: 'Material', unit: 'pcs', costPrice: 80, sellPrice: 150, taxRate: 0, openingStock: 100, lowStockAlert: 25 },
    ],
    onboarding: standardOnboarding('Coaching'),
  },
  {
    key: 'hardware-paint',
    name: 'Hardware / Paint Store',
    category: 'retail',
    storeType: 'retail',
    description: 'Building materials, tools, paints.',
    workflows: ['bill_parser', 'inventory', 'low_stock_alerts'],
    skus: [
      { sku: 'pt-emulsion-10l', name: 'Emulsion Paint 10L', category: 'Paints', unit: 'pcs', costPrice: 1400, sellPrice: 1900, taxRate: 18, openingStock: 10, lowStockAlert: 3 },
      { sku: 'pt-enamel-1l', name: 'Enamel Paint 1L', category: 'Paints', unit: 'litre', costPrice: 260, sellPrice: 380, taxRate: 18, openingStock: 20, lowStockAlert: 6 },
      { sku: 'hd-cement-50kg', name: 'Cement Bag 50kg', category: 'Building', unit: 'packet', costPrice: 320, sellPrice: 380, taxRate: 28, openingStock: 40, lowStockAlert: 10 },
      { sku: 'hd-sand-cft', name: 'Sand (per cft)', category: 'Building', unit: 'pcs', costPrice: 40, sellPrice: 60, taxRate: 18, openingStock: 200, lowStockAlert: 50 },
      { sku: 'tl-hammer', name: 'Hammer', category: 'Tools', unit: 'pcs', costPrice: 120, sellPrice: 200, taxRate: 18, openingStock: 15, lowStockAlert: 5 },
      { sku: 'tl-screwdriver-set', name: 'Screwdriver Set', category: 'Tools', unit: 'packet', costPrice: 180, sellPrice: 300, taxRate: 18, openingStock: 12, lowStockAlert: 4 },
    ],
    onboarding: standardOnboarding('Hardware'),
  },
  {
    key: 'sweet-shop',
    name: 'Sweet Shop / Halwai',
    category: 'food',
    storeType: 'retail',
    description: 'Sweets, namkeen, gift boxes.',
    workflows: ['bill_parser', 'inventory', 'expiry_watch'],
    skus: [
      { sku: 'sw-gulab-500g', name: 'Gulab Jamun 500g', category: 'Sweets', unit: 'packet', costPrice: 130, sellPrice: 210, taxRate: 5, openingStock: 30, lowStockAlert: 10 },
      { sku: 'sw-kaju-katli', name: 'Kaju Katli 250g', category: 'Sweets', unit: 'packet', costPrice: 320, sellPrice: 480, taxRate: 5, openingStock: 20, lowStockAlert: 8 },
      { sku: 'sw-soan-500g', name: 'Soan Papdi 500g', category: 'Sweets', unit: 'packet', costPrice: 110, sellPrice: 180, taxRate: 5, openingStock: 25, lowStockAlert: 8 },
      { sku: 'nk-mixture-500g', name: 'Namkeen Mixture 500g', category: 'Namkeen', unit: 'packet', costPrice: 90, sellPrice: 150, taxRate: 12, openingStock: 30, lowStockAlert: 10 },
      { sku: 'gif-box-prem', name: 'Premium Gift Box', category: 'Gifting', unit: 'pcs', costPrice: 500, sellPrice: 850, taxRate: 18, openingStock: 15, lowStockAlert: 5 },
    ],
    onboarding: standardOnboarding('Sweet Shop'),
  },
];

export function getTemplate(key: string): BusinessTemplateDef | undefined {
  return BUSINESS_TEMPLATES.find((t) => t.key === key);
}

export function listTemplates(): Array<Pick<BusinessTemplateDef, 'key' | 'name' | 'category' | 'description'>> {
  return BUSINESS_TEMPLATES.map(({ key, name, category, description }) => ({ key, name, category, description }));
}
