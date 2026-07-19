// Execution Context
import type { SessionContext } from '../../shared/types/memory.js';

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

export class ExecutionContextManager {
  private contexts: Map<string, ExecutionContext> = new Map();

  create(sessionId: string, config: Partial<ExecutionConfig> = {}): ExecutionContext {
    const context: ExecutionContext = {
      sessionId,
      variables: {},
      history: [],
      config: {
        maxSteps: config.maxSteps ?? 50,
        timeout: config.timeout ?? 30000,
        tools: config.tools ?? [],
      },
      metadata: {
        createdAt: new Date(),
      },
    };

    this.contexts.set(sessionId, context);
    return context;
  }

  get(sessionId: string): ExecutionContext | undefined {
    return this.contexts.get(sessionId);
  }

  update(sessionId: string, updates: Partial<ExecutionContext>): boolean {
    const context = this.contexts.get(sessionId);
    if (!context) return false;

    Object.assign(context, updates);
    return true;
  }

  setVariable(sessionId: string, key: string, value: unknown): boolean {
    const context = this.contexts.get(sessionId);
    if (!context) return false;

    context.variables[key] = value;
    return true;
  }

  getVariable(sessionId: string, key: string): unknown {
    return this.contexts.get(sessionId)?.variables[key];
  }

  addHistoryItem(
    sessionId: string,
    item: Omit<ExecutionHistoryItem, 'timestamp'>
  ): boolean {
    const context = this.contexts.get(sessionId);
    if (!context) return false;

    context.history.push({
      ...item,
      timestamp: new Date(),
    });
    return true;
  }

  delete(sessionId: string): boolean {
    return this.contexts.delete(sessionId);
  }

  clear(): void {
    this.contexts.clear();
  }
}

export const contextManager = new ExecutionContextManager();
