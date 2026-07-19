export interface ExecutionContext {
    sessionId: string;
    userId?: string;
    variables: Record<string, unknown>;
    history: ExecutionHistoryItem[];
    config: ExecutionConfig;
    metadata: Record<string, unknown>;
}
export interface ExecutionHistoryItem {
    step: number;
    type: 'thought' | 'action' | 'observation' | 'result';
    content: string;
    tool?: string;
    timestamp: Date;
    duration?: number;
}
export interface ExecutionConfig {
    maxSteps: number;
    timeout: number;
    tools: string[];
}
export declare class ExecutionContextManager {
    private contexts;
    create(sessionId: string, config?: Partial<ExecutionConfig>): ExecutionContext;
    get(sessionId: string): ExecutionContext | undefined;
    update(sessionId: string, updates: Partial<ExecutionContext>): boolean;
    setVariable(sessionId: string, key: string, value: unknown): boolean;
    getVariable(sessionId: string, key: string): unknown;
    addHistoryItem(sessionId: string, item: Omit<ExecutionHistoryItem, 'timestamp'>): boolean;
    delete(sessionId: string): boolean;
    clear(): void;
}
export declare const contextManager: ExecutionContextManager;
//# sourceMappingURL=context.d.ts.map