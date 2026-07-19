import type { Session, ConversationItem } from '../../shared/types/memory.js';
export interface SessionOptions {
    ttl?: number;
    maxHistory?: number;
}
export declare class SessionManager {
    private sessions;
    private defaultTtl;
    private defaultMaxHistory;
    constructor(options?: SessionOptions);
    create(userId?: string, agentId?: string): Session;
    get(id: string): Session | undefined;
    update(id: string, updates: Partial<Session>): boolean;
    delete(id: string): boolean;
    addConversationItem(sessionId: string, item: Omit<ConversationItem, 'timestamp'>): boolean;
    setVariable(sessionId: string, key: string, value: unknown): boolean;
    getVariable(sessionId: string, key: string): unknown;
    setState(sessionId: string, key: string, value: unknown): boolean;
    getState(sessionId: string, key: string): unknown;
    getHistory(sessionId: string, limit?: number): ConversationItem[];
    listByUser(userId: string): Session[];
    cleanup(): number;
    clear(): void;
}
export declare const sessionManager: SessionManager;
//# sourceMappingURL=session.d.ts.map