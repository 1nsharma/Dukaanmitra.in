export interface CityInfo {
  name: string;
  state: string;
  wikidataId: string;
  marketType: string;
  retailProfile: string;
}

export const cityData: Record<string, CityInfo> = {
  "mumbai": { name: "Mumbai", state: "Maharashtra", wikidataId: "Q1156", marketType: "Tier-1", retailProfile: "Financial & Massive Retail Hub" },
  "delhi": { name: "Delhi", state: "Delhi", wikidataId: "Q1353", marketType: "Tier-1", retailProfile: "Wholesale & Trading Capital" },
  "bangalore": { name: "Bangalore", state: "Karnataka", wikidataId: "Q1355", marketType: "Tier-1", retailProfile: "Tech-Savvy Modern Retail" },
  "hyderabad": { name: "Hyderabad", state: "Telangana", wikidataId: "Q1359", marketType: "Tier-1", retailProfile: "Pharma & Emerging Tech Retail" },
  "ahmedabad": { name: "Ahmedabad", state: "Gujarat", wikidataId: "Q1070", marketType: "Tier-1", retailProfile: "Textile & Manufacturing Hub" },
  "chennai": { name: "Chennai", state: "Tamil Nadu", wikidataId: "Q1352", marketType: "Tier-1", retailProfile: "Automobile & Industrial Retail" },
  "kolkata": { name: "Kolkata", state: "West Bengal", wikidataId: "Q1348", marketType: "Tier-1", retailProfile: "Traditional Markets & East Hub" },
  "pune": { name: "Pune", state: "Maharashtra", wikidataId: "Q1538", marketType: "Tier-1", retailProfile: "Education & IT Retail Mix" },
  "surat": { name: "Surat", state: "Gujarat", wikidataId: "Q167855", marketType: "Tier-2", retailProfile: "Diamond & Textile Retail" },
  "jaipur": { name: "Jaipur", state: "Rajasthan", wikidataId: "Q1537", marketType: "Tier-2", retailProfile: "Tourism & Handicraft Retail" },
  "lucknow": { name: "Lucknow", state: "Uttar Pradesh", wikidataId: "Q1498", marketType: "Tier-2", retailProfile: "Administrative & Consumer Hub" },
  "kanpur": { name: "Kanpur", state: "Uttar Pradesh", wikidataId: "Q1448", marketType: "Tier-2", retailProfile: "Industrial & Kirana Wholesale" },
  "indore": { name: "Indore", state: "Madhya Pradesh", wikidataId: "Q66616", marketType: "Tier-2", retailProfile: "Commercial Capital of Central India" },
  "nagpur": { name: "Nagpur", state: "Maharashtra", wikidataId: "Q19091", marketType: "Tier-2", retailProfile: "Logistics & Distribution Hub" },
  "patna": { name: "Patna", state: "Bihar", wikidataId: "Q18951", marketType: "Tier-2", retailProfile: "High-Growth Consumer Market" },
  "ludhiana": { name: "Ludhiana", state: "Punjab", wikidataId: "Q191143", marketType: "Tier-2", retailProfile: "Hosiery & Industrial Retail" },
  "coimbatore": { name: "Coimbatore", state: "Tamil Nadu", wikidataId: "Q173531", marketType: "Tier-2", retailProfile: "Manufacturing & SME Hub" },
  "kochi": { name: "Kochi", state: "Kerala", wikidataId: "Q1800", marketType: "Tier-2", retailProfile: "Maritime & Modern Retail" },
  "visakhapatnam": { name: "Visakhapatnam", state: "Andhra Pradesh", wikidataId: "Q200021", marketType: "Tier-2", retailProfile: "Port City & Industrial Base" },
  "bhopal": { name: "Bhopal", state: "Madhya Pradesh", wikidataId: "Q80989", marketType: "Tier-2", retailProfile: "Rising SME Retail Center" },
  "varanasi": { name: "Varanasi", state: "Uttar Pradesh", wikidataId: "Q12597", marketType: "Tier-3", retailProfile: "Cultural & Small Business Hub" },
  "madurai": { name: "Madurai", state: "Tamil Nadu", wikidataId: "Q2277", marketType: "Tier-3", retailProfile: "Traditional Retail Ecosystem" },
  "meerut": { name: "Meerut", state: "Uttar Pradesh", wikidataId: "Q200237", marketType: "Tier-3", retailProfile: "Sports Goods & SME Hub" },
  "nashik": { name: "Nashik", state: "Maharashtra", wikidataId: "Q15104", marketType: "Tier-2", retailProfile: "Agriculture & Industrial Retail" },
  "rajkot": { name: "Rajkot", state: "Gujarat", wikidataId: "Q11854", marketType: "Tier-2", retailProfile: "Engineering & Small Industry Hub" }
};
