export type Industry = 'RETAIL' | 'HEALTHCARE' | 'EDUCATION' | 'LOGISTICS' | 'REAL_ESTATE';

export type ExperienceStage = 
  | "ACT_1_SHOP"          // 0.00 - 0.15
  | "ACT_2_TENSION"       // 0.15 - 0.30
  | "ACT_3_MUNIM"         // 0.30 - 0.45
  | "ACT_4_AUTOMATION"    // 0.45 - 0.60
  | "ACT_5_TRANSFORMATION"// 0.60 - 0.75
  | "ACT_6_NETWORK"       // 0.75 - 0.85
  | "ACT_7_PEACE"         // 0.85 - 0.95
  | "ACT_8_SOCIETY";      // 0.95 - 1.00

export interface StageConfig {
  range: [number, number];
  pos: [number, number, number];
  lookAt: [number, number, number];
  label: string;      // Used for UI overlays
  narration: string;  // AI Voice / Text narration
  ambient: string;    // Environment fog/bg color
  light: string;      // Directional light color
}

export interface IndustryConfig {
  id: Industry;
  name: string;
  stages: Record<ExperienceStage, StageConfig>;
  // Additional modular configurations can be added here
  metrics: { label: string; value: string; color: string; pos: [number, number, number] }[];
  videoUrl: string;
}

export const RETAIL_EXPERIENCE: IndustryConfig = {
  id: 'RETAIL',
  name: 'Retail Operating System',
  stages: {
    ACT_1_SHOP: { 
      range: [0, 0.15], pos: [0, 1, 5], lookAt: [0, 1, 0], 
      label: "8:00 AM - Setup", narration: "Subah ki shuruaat. Dukaan khul gayi hai aur saaf safai ho rahi hai.",
      ambient: "#ffd59e", light: "#ffffff"
    },
    ACT_2_TENSION: { 
      range: [0.15, 0.30], pos: [2, 0, -2], lookAt: [0, 0, -5], 
      label: "12:00 PM - Rush", narration: "Dopehar ka time hai. Bheed badh rahi hai. Bahi khata aur purane udhaar ka hisaab lagana mushkil ho raha hai.",
      ambient: "#ff4500", light: "#ff0000"
    },
    ACT_3_MUNIM: { 
      range: [0.30, 0.45], pos: [0, 2, -10], lookAt: [0, 2, -20], 
      label: "AI Energy Core", narration: "Ab DukaanMitra app shuru. Ek click mein saari problem solve.",
      ambient: "#000000", light: "#00ffcc"
    },
    ACT_4_AUTOMATION: { 
      range: [0.45, 0.60], pos: [-2, 0, -20], lookAt: [0, 0, -30], 
      label: "Billing & Khata", narration: "Dekhiye, udhaar apne aap add ho gaya, aur grahak ko WhatsApp par reminder chala gaya.",
      ambient: "#000a12", light: "#00ffcc"
    },
    ACT_5_TRANSFORMATION: { 
      range: [0.60, 0.75], pos: [0, 5, -40], lookAt: [0, 0, -50], 
      label: "Growth", narration: "Inventory alert aa gaya hai. Pehle se pata hai kya stock khatam hone wala hai.",
      ambient: "#ffccaa", light: "#ff8c00"
    },
    ACT_6_NETWORK: { 
      range: [0.75, 0.85], pos: [0, 10, -60], lookAt: [0, 0, -70], 
      label: "India Retail Pulse", narration: "Meri dukaan ka online network badh raha hai. Naye orders aa rahe hain aur AI manage kar raha hai.",
      ambient: "#000308", light: "#00ffcc"
    },
    ACT_7_PEACE: { 
      range: [0.85, 0.95], pos: [0, 2, -80], lookAt: [0, 2, -90], 
      label: "Peace", narration: "Raat ho gayi. Pura hisaab clear hai. Main chain ki neend so raha hoon, DukaanMitra apna kaam kar raha hai.",
      ambient: "#000000", light: "#1a1a2e"
    },
    ACT_8_SOCIETY: {
      range: [0.95, 1.0], pos: [0, 2, -100], lookAt: [0, 2, -120],
      label: "Agent Society", narration: "Yeh hai dukaan ke peeche ka dimaag. Bahut saare AI agents ek saath auto-pilot par kaam kar rahe hain. Aapke business ko badhane ke liye.",
      ambient: "#000a12", light: "#00ffcc"
    }
  },
  metrics: [
    { label: "Orders", value: "84", color: "#00ffcc", pos: [-2, 0, 0] },
    { label: "Earnings", value: "₹24K", color: "#ff8c00", pos: [0, 0, 0] },
    { label: "Udhaar", value: "-₹5K", color: "#ff4500", pos: [2, 0, 0] }
  ],
  videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
};

export const getExperienceState = (offset: number, config: IndustryConfig = RETAIL_EXPERIENCE) => {
  const stages = Object.keys(config.stages) as ExperienceStage[];
  const activeStage = stages.find(s => offset >= config.stages[s].range[0] && offset <= config.stages[s].range[1]) || "ACT_7_PEACE";
  
  const stageConfig = config.stages[activeStage];
  // Calculate relative progress inside the current scene (0 to 1)
  const [start, end] = stageConfig.range;
  const stageProgress = (offset - start) / (end - start);
  
  return { activeStage, stageProgress, stageConfig };
};
