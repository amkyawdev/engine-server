// Vector Memory (Simplified Implementation)
import { createLogger } from '../../shared/utils/logger.js';
import type { Memory, VectorSearchResult, VectorSearchOptions } from '../../shared/types/memory.js';

const logger = createLogger('memory:vector');

export class VectorMemory {
  private memories: Map<string, Memory> = new Map();
  private embeddings: Map<string, number[]> = new Map();

  async add(memory: Memory): Promise<void> {
    this.memories.set(memory.id, memory);

    // Generate simple embedding (in production, use proper embedding model)
    const embedding = this.generateEmbedding(memory.content);
    this.embeddings.set(memory.id, embedding);

    logger.debug({ memoryId: memory.id }, 'Memory added to vector store');
  }

  async search(
    query: string,
    options: VectorSearchOptions = {}
  ): Promise<VectorSearchResult[]> {
    const { limit = 5, threshold = 0.5, filter } = options;

    // Generate query embedding
    const queryEmbedding = this.generateEmbedding(query);

    const results: VectorSearchResult[] = [];

    for (const [id, memory] of this.memories.entries()) {
      // Apply filters
      if (filter) {
        const matchesFilter = Object.entries(filter).every(
          ([key, value]) => memory.metadata[key as keyof typeof memory.metadata] === value
        );
        if (!matchesFilter) continue;
      }

      const embedding = this.embeddings.get(id);
      if (!embedding) continue;

      const score = this.cosineSimilarity(queryEmbedding, embedding);

      if (score >= threshold) {
        results.push({
          id: memory.id,
          content: memory.content,
          score,
          metadata: memory.metadata,
        });
      }
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit);
  }

  async get(id: string): Promise<Memory | undefined> {
    return this.memories.get(id);
  }

  async delete(id: string): Promise<boolean> {
    this.embeddings.delete(id);
    return this.memories.delete(id);
  }

  async update(id: string, updates: Partial<Memory>): Promise<boolean> {
    const existing = this.memories.get(id);
    if (!existing) return false;

    const updated = { ...existing, ...updates };
    this.memories.set(id, updated);

    if (updates.content) {
      const embedding = this.generateEmbedding(updates.content);
      this.embeddings.set(id, embedding);
    }

    return true;
  }

  size(): number {
    return this.memories.size;
  }

  clear(): void {
    this.memories.clear();
    this.embeddings.clear();
  }

  // Simple embedding generation (replace with proper model in production)
  private generateEmbedding(text: string): number[] {
    const dimension = 128;
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(dimension).fill(0);

    // Simple hash-based embedding
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < Math.min(word.length, dimension); j++) {
        const idx = (word.charCodeAt(j) + i + j) % dimension;
        embedding[idx] += 1;
      }
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    if (magnitude > 0) {
      for (let i = 0; i < dimension; i++) {
        embedding[i] /= magnitude;
      }
    }

    return embedding;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }
}

export const vectorMemory = new VectorMemory();
