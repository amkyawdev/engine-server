// Session Management
import { createLogger } from '../../shared/utils/logger.js';
import { generateId } from '../../shared/utils/crypto.js';
const logger = createLogger('memory:session');
export class SessionManager {
    sessions = new Map();
    defaultTtl;
    defaultMaxHistory;
    constructor(options = {}) {
        this.defaultTtl = options.ttl ?? 3600;
        this.defaultMaxHistory = options.maxHistory ?? 100;
    }
    create(userId, agentId = 'default') {
        const id = generateId();
        const now = new Date();
        const session = {
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
    get(id) {
        const session = this.sessions.get(id);
        if (session && new Date() > session.expiresAt) {
            this.delete(id);
            return undefined;
        }
        return session;
    }
    update(id, updates) {
        const session = this.sessions.get(id);
        if (!session)
            return false;
        Object.assign(session, updates, { updatedAt: new Date() });
        return true;
    }
    delete(id) {
        const deleted = this.sessions.delete(id);
        if (deleted) {
            logger.info({ sessionId: id }, 'Session deleted');
        }
        return deleted;
    }
    addConversationItem(sessionId, item) {
        const session = this.get(sessionId);
        if (!session)
            return false;
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
    setVariable(sessionId, key, value) {
        const session = this.get(sessionId);
        if (!session)
            return false;
        session.context.variables[key] = value;
        session.updatedAt = new Date();
        return true;
    }
    getVariable(sessionId, key) {
        const session = this.get(sessionId);
        return session?.context.variables[key];
    }
    setState(sessionId, key, value) {
        const session = this.get(sessionId);
        if (!session)
            return false;
        session.context.state[key] = value;
        session.updatedAt = new Date();
        return true;
    }
    getState(sessionId, key) {
        const session = this.get(sessionId);
        return session?.context.state[key];
    }
    getHistory(sessionId, limit) {
        const session = this.get(sessionId);
        if (!session)
            return [];
        const history = session.context.history;
        return limit ? history.slice(-limit) : history;
    }
    listByUser(userId) {
        const result = [];
        for (const session of this.sessions.values()) {
            if (session.userId === userId) {
                result.push(session);
            }
        }
        return result;
    }
    cleanup() {
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
    clear() {
        this.sessions.clear();
        logger.info('All sessions cleared');
    }
}
export const sessionManager = new SessionManager();
//# sourceMappingURL=session.js.map