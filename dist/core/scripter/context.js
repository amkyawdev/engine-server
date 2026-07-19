export class ExecutionContextManager {
    contexts = new Map();
    create(sessionId, config = {}) {
        const context = {
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
    get(sessionId) {
        return this.contexts.get(sessionId);
    }
    update(sessionId, updates) {
        const context = this.contexts.get(sessionId);
        if (!context)
            return false;
        Object.assign(context, updates);
        return true;
    }
    setVariable(sessionId, key, value) {
        const context = this.contexts.get(sessionId);
        if (!context)
            return false;
        context.variables[key] = value;
        return true;
    }
    getVariable(sessionId, key) {
        return this.contexts.get(sessionId)?.variables[key];
    }
    addHistoryItem(sessionId, item) {
        const context = this.contexts.get(sessionId);
        if (!context)
            return false;
        context.history.push({
            ...item,
            timestamp: new Date(),
        });
        return true;
    }
    delete(sessionId) {
        return this.contexts.delete(sessionId);
    }
    clear() {
        this.contexts.clear();
    }
}
export const contextManager = new ExecutionContextManager();
//# sourceMappingURL=context.js.map