export interface ThoughtNode {
    id: string;
    content: string;
    parent?: string;
    children: string[];
    score: number;
    depth: number;
    status: 'pending' | 'explored' | 'pruned' | 'finished';
}
export interface TreeOfThoughtResult {
    tree: Map<string, ThoughtNode>;
    bestPath: string[];
    bestScore: number;
    exploredNodes: number;
}
export declare class TreeOfThoughtReasoner {
    private maxDepth;
    private maxWidth;
    private pruningThreshold;
    constructor(maxDepth?: number, maxWidth?: number, pruningThreshold?: number);
    reason(prompt: string, context?: Record<string, unknown>): Promise<TreeOfThoughtResult>;
    private generateChildThoughts;
    private scoreThought;
    private findBestPath;
}
export declare const treeOfThoughtReasoner: TreeOfThoughtReasoner;
//# sourceMappingURL=tree-of-thought.d.ts.map