export interface ThoughtStep {
    id: string;
    content: string;
    reasoning: string;
    nextAction?: string;
    confidence: number;
}
export interface ChainOfThoughtResult {
    steps: ThoughtStep[];
    finalAnswer: string;
    confidence: number;
    reasoning: string;
}
export declare class ChainOfThoughtReasoner {
    private maxDepth;
    private temperature;
    constructor(maxDepth?: number, temperature?: number);
    reason(prompt: string, context?: Record<string, unknown>): Promise<ChainOfThoughtResult>;
    private generateThought;
    private extractFinalAnswer;
    private calculateConfidence;
}
export declare const chainOfThoughtReasoner: ChainOfThoughtReasoner;
//# sourceMappingURL=chain-of-thought.d.ts.map