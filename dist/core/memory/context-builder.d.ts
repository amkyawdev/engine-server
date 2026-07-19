import type { ConversationItem } from '../../shared/types/memory.js';
export interface ContextBuildOptions {
    maxTokens?: number;
    includeSystem?: boolean;
    format?: 'text' | 'json';
}
export declare class ContextBuilder {
    private defaultMaxTokens;
    build(history: ConversationItem[], options?: ContextBuildOptions): string;
    buildSystemPrompt(instructions: string, variables?: Record<string, unknown>): string;
    buildSummary(history: ConversationItem[], summaryLength?: 'short' | 'medium' | 'long'): string;
    private formatItem;
    private estimateTokens;
}
export declare const contextBuilder: ContextBuilder;
//# sourceMappingURL=context-builder.d.ts.map