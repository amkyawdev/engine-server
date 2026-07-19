// Session Management
import { createLogger } from '../../shared/utils/logger.js';
import { generateId } from '../../shared/utils/crypto.js';
import type { Session, SessionContext, ConversationItem } from '../../shared/types/memory.js';

const logger = createLogger('memory:session');

export interface SessionOptions {
  ttl?: number;
  maxHistory?: number;
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private defaultTtl: number;
  private defaultMaxHistory: number;

  constructor(options: SessionOptions = {}) {
    this.defaultTtl = options.ttl ?? 3600;
    this.defaultMaxHistory = options.maxHistory ?? 100;
  }

  create(userId?: string, agentId = 'default'): Session {
    const id = generateId();
    const now = new Date();

    const session: Session = {
      id,
      userId,
      agentId,
      context: {
        variables: {},
        history: [],
        state: {},
      },
      memories: [],
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(now.getTime() + this.defaultTtl * 1000),
    };

    this.sessions.set(id, session);
    logger.info({ sessionId: id, userId, agentId }, 'Session created');

    return session;
  }

  get(id: string): Session | undefined {
    const session = this.sessions.get(id);
    if (session && new Date() > session.expiresAt) {
      this.delete(id);
      return undefined;
    }
    return session;
  }

  update(id: string, updates: Partial<Session>): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;

    Object.assign(session, updates, { updatedAt: new Date() });
    return true;
  }

  delete(id: string): boolean {
    const deleted = this.sessions.delete(id);
    if (deleted) {
      logger.info({ sessionId: id }, 'Session deleted');
    }
    return deleted;
  }

  addConversationItem(
    sessionId: string,
    item: Omit<ConversationItem, 'timestamp'>
  ): boolean {
    const session = this.get(sessionId);
    if (!session) return false;

    session.context.history.push({
      ...item,
      timestamp: new Date(),
    });

    // Trim history if needed
    if (session.context.history.length > this.defaultMaxHistory) {
      session.context.history = session.context.history.slice(-this.defaultMaxHistory);
    }

    session.updatedAt = new Date();
    return true;
  }

  setVariable(sessionId: string, key: string, value: unknown): boolean {
    const session = this.get(sessionId);
    if (!session) return false;

    session.context.variables[key] = value;
    session.updatedAt = new Date();
    return true;
  }

  getVariable(sessionId: string, key: string): unknown {
    const session = this.get(sessionId);
    return session?.context.variables[key];
  }

  setState(sessionId: string, key: string, value: unknown): boolean {
    const session = this.get(sessionId);
    if (!session) return false;

    session.context.state[key] = value;
    session.updatedAt = new Date();
    return true;
  }

  getState(sessionId: string, key: string): unknown {
    const session = this.get(sessionId);
    return session?.context.state[key];
  }

  getHistory(sessionId: string, limit?: number): ConversationItem[] {
    const session = this.get(sessionId);
    if (!session) return [];

    const history = session.context.history;
    return limit ? history.slice(-limit) : history;
  }

  listByUser(userId: string): Session[] {
    const result: Session[] = [];
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        result.push(session);
      }
    }
    return result;
  }

  cleanup(): number {
    const now = new Date();
    let count = 0;

    for (const [id, session] of this.sessions.entries()) {
      if (now > session.expiresAt) {
        this.sessions.delete(id);
        count++;
      }
    }

    if (count > 0) {
      logger.info({ cleaned: count }, 'Sessions cleaned up');
    }

    return count;
  }

  clear(): void {
    this.sessions.clear();
    logger.info('All sessions cleared');
  }
}

export const sessionManager = new SessionManager();
