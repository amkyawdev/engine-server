// Tool Registry
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('tools:registry');
export class ToolRegistry {
    tools = new Map();
    register(tool) {
        if (this.tools.has(tool.id)) {
            logger.warn({ toolId: tool.id }, 'Tool already registered, overwriting');
        }
        this.tools.set(tool.id, tool);
        logger.info({ toolId: tool.id, name: tool.name }, 'Tool registered');
    }
    unregister(id) {
        return this.tools.delete(id);
    }
    get(id) {
        return this.tools.get(id);
    }
    getByName(name) {
        for (const tool of this.tools.values()) {
            if (tool.name === name) {
                return tool;
            }
        }
        return undefined;
    }
    list() {
        return [...this.tools.values()];
    }
    listByCategory(category) {
        return [...this.tools.values()].filter((t) => t.category === category);
    }
    async execute(toolId, input, context) {
        const tool = this.tools.get(toolId);
        if (!tool) {
            return {
                success: false,
                error: `Tool '${toolId}' not found`,
                executionTime: 0,
            };
        }
        const startTime = Date.now();
        try {
            logger.debug({ toolId, input }, 'Executing tool');
            const output = await tool.execute(input, context);
            return {
                success: true,
                output,
                executionTime: Date.now() - startTime,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error({ toolId, error: message }, 'Tool execution failed');
            return {
                success: false,
                error: message,
                executionTime: Date.now() - startTime,
            };
        }
    }
    has(id) {
        return this.tools.has(id);
    }
    clear() {
        this.tools.clear();
        logger.info('All tools cleared');
    }
}
export const toolRegistry = new ToolRegistry();
//# sourceMappingURL=registry.js.map