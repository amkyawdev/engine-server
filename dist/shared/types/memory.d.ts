export interface Memory {
    id: string;
    sessionId: string;
    type: MemoryType;
    content: string;
    embedding?: number[];
    metadata: MemoryMetadata;
    createdAt: Date;
    accessedAt: Date;
}
export type MemoryType = 'short-term' | 'long-term' | 'semantic' | 'episodic';
export interface MemoryMetadata {
    source?: 'user' | 'agent' | 'tool' | 'skill';
    tags?: string[];
    importance?: number;
    expiresAt?: Date;
}
export interface Session {
    id: string;
    userId?: string;
    agentId: string;
    context: SessionContext;
    memories: string[];
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
}
export interface SessionContext {
    variables: Record<string, unknown>;
    history: ConversationItem[];
    state: Record<string, unknown>;
}
export interface ConversationItem {
    role: 'user' | 'agent' | 'system';
    content: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}
export interface VectorSearchResult {
    id: string;
    content: string;
    score: number;
    metadata: MemoryMetadata;
}
export interface VectorSearchOptions {
    limit?: number;
    threshold?: number;
    filter?: Record<string, unknown>;
}
//# sourceMappingURL=memory.d.ts.map