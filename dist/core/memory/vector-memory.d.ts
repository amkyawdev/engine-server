import type { Memory, VectorSearchResult, VectorSearchOptions } from '../../shared/types/memory.js';
export declare class VectorMemory {
    private memories;
    private embeddings;
    add(memory: Memory): Promise<void>;
    search(query: string, options?: VectorSearchOptions): Promise<VectorSearchResult[]>;
    get(id: string): Promise<Memory | undefined>;
    delete(id: string): Promise<boolean>;
    update(id: string, updates: Partial<Memory>): Promise<boolean>;
    size(): number;
    clear(): void;
    private generateEmbedding;
    private cosineSimilarity;
}
export declare const vectorMemory: VectorMemory;
//# sourceMappingURL=vector-memory.d.ts.map