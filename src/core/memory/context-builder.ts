// Context Builder
import { createLogger } from '../../shared/utils/logger.js';
import type { ConversationItem } from '../../shared/types/memory.js';

const logger = createLogger('memory:context-builder');

export interface ContextBuildOptions {
  maxTokens?: number;
  includeSystem?: boolean;
  format?: 'text' | 'json';
}

export class ContextBuilder {
  private defaultMaxTokens = 4000;

  build(
    history: ConversationItem[],
    options: ContextBuildOptions = {}
  ): string {
    const { maxTokens = this.defaultMaxTokens, format = 'text' } = options;

    logger.debug({ historyLength: history.length, maxTokens }, 'Building context');

    if (history.length === 0) {
      return '';
    }

    // Sort by timestamp (newest first for context window)
    const sorted = [...history].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const contextParts: string[] = [];
    let currentTokens = 0;

    for (const item of sorted) {
      const itemText = this.formatItem(item, format);
      const itemTokens = this.estimateTokens(itemText);

      if (currentTokens + itemTokens > maxTokens) {
        break;
      }

      contextParts.unshift(itemText);
      currentTokens += itemTokens;
    }

    return contextParts.join('\n');
  }

  buildSystemPrompt(
    instructions: string,
    variables: Record<string, unknown> = {}
  ): string {
    let prompt = instructions;

    if (Object.keys(variables).length > 0) {
      const varsStr = Object.entries(variables)
        .map(([k, v]) => `- ${k}: ${JSON.stringify(v)}`)
        .join('\n');
      prompt += `\n\nContext Variables:\n${varsStr}`;
    }

    return prompt;
  }

  buildSummary(
    history: ConversationItem[],
    summaryLength: 'short' | 'medium' | 'long' = 'medium'
  ): string {
    if (history.length === 0) {
      return 'No conversation history.';
    }

    const counts = {
      user: history.filter((h) => h.role === 'user').length,
      agent: history.filter((h) => h.role === 'agent').length,
      system: history.filter((h) => h.role === 'system').length,
    };

    const summaries = [
      `This conversation has ${history.length} messages.`,
      `${counts.user} from user, ${counts.agent} from agent${counts.system > 0 ? `, ${counts.system} system` : ''}.`,
    ];

    const recentMessages = history.slice(-5);
    if (recentMessages.length > 0) {
      const lastTopic = recentMessages[recentMessages.length - 1].content.slice(0, 100);
      summaries.push(`Recent topic: "${lastTopic}"`);
    }

    return summaries.join(' ');
  }

  private formatItem(item: ConversationItem, format: 'text' | 'json'): string {
    const timestamp = new Date(item.timestamp).toISOString();

    if (format === 'json') {
      return JSON.stringify({
        role: item.role,
        content: item.content,
        timestamp,
      });
    }

    const prefix = item.role.toUpperCase();
    return `[${timestamp}] ${prefix}: ${item.content}`;
  }

  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

export const contextBuilder = new ContextBuilder();
