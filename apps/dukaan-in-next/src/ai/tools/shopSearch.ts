import { Tool } from "../types";

export const shopSearchTool: Tool<{ query: string }, { results: string[] }> = {
  name: "shopSearch",
  description: "Search the shop's knowledge base or vector database for product prices, availability, and store policies.",
  inputSchema: {
    query: "string"
  },
  exampleInput: { query: "What is the price of Aashirvaad Atta?" },
  exampleOutput: { results: ["Aashirvaad Atta 5kg is priced at ₹250. Current stock: 15 bags."] },
  handler: async ({ query }) => {
    // In a real production system, this would embed the query and query a Vector DB (e.g., Pinecone, Qdrant)
    console.log(`[RAG] Searching vector database for: "${query}"`);
    
    // Mock RAG results based on keywords
    const results = [];
    if (query.toLowerCase().includes("atta")) {
      results.push("Aashirvaad Atta 5kg is priced at ₹250. Current stock: 15 bags.");
    } else if (query.toLowerCase().includes("timing") || query.toLowerCase().includes("open")) {
      results.push("Shop is open from 8:00 AM to 10:00 PM everyday.");
    } else if (query.toLowerCase().includes("payment") || query.toLowerCase().includes("credit")) {
      results.push("We accept UPI, Cash, and Card. Credit is allowed for known customers up to ₹5000.");
    } else {
      results.push("No specific information found in the knowledge base for this query. The item might be out of stock or unlisted.");
    }

    return { results };
  },
};
