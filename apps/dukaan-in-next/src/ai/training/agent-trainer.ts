
import fs from 'fs';
import path from 'path';

/**
 * AgentTrainer: A utility to "train" agents by processing context files
 * and generating structured knowledge or prompts.
 */
export class AgentTrainer {
  private static AGENTS_DIR = path.join(process.cwd(), '.agents');

  /**
   * Load a training context file from the .agents directory.
   */
  public static loadContext(filename: string): string {
    const filePath = path.join(this.AGENTS_DIR, filename);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
    return '';
  }

  /**
   * Generates a specialized system prompt based on training data.
   */
  public static generateSpecializedPrompt(basePrompt: string, contextFile: string): string {
    const context = this.loadContext(contextFile);
    if (!context) return basePrompt;

    return `
${basePrompt}

### ADDITIONAL TRAINED CONTEXT:
${context}

Always adhere to the rules and personality defined in the context above.
`.trim();
  }

  /**
   * "Trains" an agent by updating its configuration or prompt.
   * In a production environment, this could involve fine-tuning or vector DB ingestion.
   */
  public static async trainAgent(agentId: string, sourceFiles: string[]): Promise<boolean> {
    console.log(`[Trainer] Training agent ${agentId} on ${sourceFiles.join(', ')}...`);
    
    // For now, we simulate training by verifying files exist and logging
    for (const file of sourceFiles) {
      const content = this.loadContext(file);
      if (!content) {
        console.error(`[Trainer] Failed to load training file: ${file}`);
        return false;
      }
    }

    console.log(`[Trainer] Agent ${agentId} trained successfully with ${sourceFiles.length} context blocks.`);
    return true;
  }
}
