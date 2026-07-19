// Tool Registry
import { createLogger } from '../../shared/utils/logger.js';
import type { Tool, ToolContext, ToolResult } from '../../shared/types/tool.js';

const logger = createLogger('tools:registry');

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    if (this.tools.has(tool.id)) {
      logger.warn({ toolId: tool.id }, 'Tool already registered, overwriting');
    }
    this.tools.set(tool.id, tool);
    logger.info({ toolId: tool.id, name: tool.name }, 'Tool registered');
  }

  unregister(id: string): boolean {
    return this.tools.delete(id);
  }

  get(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  getByName(name: string): Tool | undefined {
    for (const tool of this.tools.values()) {
      if (tool.name === name) {
        return tool;
      }
    }
    return undefined;
  }

  list(): Tool[] {
    return [...this.tools.values()];
  }

  listByCategory(category: string): Tool[] {
    return [...this.tools.values()].filter((t) => t.category === category);
  }

  async execute(
    toolId: string,
    input: unknown,
    context: ToolContext
  ): Promise<ToolResult> {
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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ toolId, error: message }, 'Tool execution failed');

      return {
        success: false,
        error: message,
        executionTime: Date.now() - startTime,
      };
    }
  }

  has(id: string): boolean {
    return this.tools.has(id);
  }

  clear(): void {
    this.tools.clear();
    logger.info('All tools cleared');
  }
}

export const toolRegistry = new ToolRegistry();
