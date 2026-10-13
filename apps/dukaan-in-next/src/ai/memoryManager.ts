// src/ai/memoryManager.ts

/**
 * Simple layered memory manager used by the autonomous agent.
 * Works in the browser (sessionStorage) and in Node (in‑memory cache).
 */
export class MemoryManager {
  /** Working memory – lives only for the duration of a single request */
  private workingMemory: Record<string, any> = {};

  /** Episodic memory – persisted for the user session (browser) */
  private static EPISODIC_KEY = "ai_epic_memory";

  /** Retrieve a value from working memory */
  getWorking(key: string): any {
    return this.workingMemory[key];
  }

  /** Store a value in working memory */
  setWorking(key: string, value: any): void {
    this.workingMemory[key] = value;
  }

  /** Append a snippet to episodic memory (browser only) */
  appendEpisodic(snippet: string): void {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    const existing = window.sessionStorage.getItem(MemoryManager.EPISODIC_KEY) || "";
    const updated = existing + "\n" + snippet;
    window.sessionStorage.setItem(MemoryManager.EPISODIC_KEY, updated);
  }

  /** Retrieve episodic memory – returns a concatenated string */
  getEpisodic(): string {
    if (typeof window === "undefined" || !window.sessionStorage) return "";
    return window.sessionStorage.getItem(MemoryManager.EPISODIC_KEY) || "";
  }

  /** Clear episodic memory – called when a session ends */
  clearEpisodic(): void {
    if (typeof window !== "undefined" && window.sessionStorage) {
      window.sessionStorage.removeItem(MemoryManager.EPISODIC_KEY);
    }
  }
}
