import fs from 'fs';
let content = fs.readFileSync('components/ComparisonPage.tsx', 'utf8');

const newComparisons = `
  busy: {
    title: "DukaanMitra vs Busy | Modern WhatsApp Billing Alternative",
    description: "Compare DukaanMitra vs Busy Accounting. See why DukaanMitra's AI-first mobile approach is better for small Kirana stores.",
    keywords: "dukaanmitra vs busy, busy alternative, accounting software for small shop",
    pros: ["Zero setup time", "Works via WhatsApp", "No desktop required", "Free for basics"],
    cons: ["Not for large enterprises", "Mobile-first only"]
  },
  'marg-erp': {
    title: "DukaanMitra vs Marg ERP | Simple AI Billing vs Legacy ERP",
    description: "Compare DukaanMitra vs Marg ERP. Find out why modern retailers prefer WhatsApp billing over traditional complex ERPs.",
    keywords: "dukaanmitra vs marg erp, marg erp alternative, billing software india",
    pros: ["AI automation", "Instant WhatsApp bills", "No training needed", "Zero hardware cost"],
    cons: ["Focuses on small/medium shops", "No complex manufacturing modules"]
  },
  tally: {
    title: "DukaanMitra vs Tally | AI Cloud Munim vs Desktop Tally",
    description: "DukaanMitra vs Tally Prime. Discover the easiest way to manage shop accounts on WhatsApp without hiring a full-time accountant.",
    keywords: "dukaanmitra vs tally, tally alternative, tally on mobile, gst billing",
    pros: ["Cloud-native AI", "No accountant required", "WhatsApp integrated", "Auto-reminders"],
    cons: ["Not for CA audit purposes", "Simpler reporting structure"]
  },
`;

content = content.replace('const comparisonLibrary: Record<string, ComparisonData> = {', 'const comparisonLibrary: Record<string, ComparisonData> = {\n' + newComparisons);

fs.writeFileSync('components/ComparisonPage.tsx', content);
console.log("Patched ComparisonPage.tsx!");
