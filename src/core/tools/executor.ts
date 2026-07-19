// Tool Executor
import { createLogger } from '../../shared/utils/logger.js';
import { toolRegistry } from './registry.js';
import type { ToolContext, ToolResult } from '../../shared/types/tool.js';

const logger = createLogger('tools:executor');

export interface ExecutorOptions {
  timeout?: number;
  maxConcurrent?: number;
  enabledTools?: string[];
  disabledTools?: string[];
}

export class ToolExecutor {
  private options: ExecutorOptions;
  private running = 0;

  constructor(options: ExecutorOptions = {}) {
    this.options = {
      timeout: options.timeout ?? 30000,
      maxConcurrent: options.maxConcurrent ?? 5,
      enabledTools: options.enabledTools,
      disabledTools: options.disabledTools ?? ['code-interpreter'],
    };
  }

  async execute(
    toolId: string,
    input: unknown,
    context: ToolContext
  ): Promise<ToolResult> {
    // Check if tool is enabled
    if (this.options.disabledTools?.includes(toolId)) {
      return {
        success: false,
        error: `Tool '${toolId}' is disabled`,
        executionTime: 0,
      };
    }

    if (this.options.enabledTools && !this.options.enabledTools.includes(toolId)) {
      return {
        success: false,
        error: `Tool '${toolId}' is not enabled`,
        executionTime: 0,
      };
    }

    // Check concurrent limit
    if (this.running >= (this.options.maxConcurrent ?? 5)) {
      return {
        success: false,
        error: 'Too many concurrent tool executions',
        executionTime: 0,
      };
    }

    this.running++;
    const startTime = Date.now();

    try {
      // Set timeout
      const timeoutPromise = new Promise<ToolResult>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Tool execution timed out'));
        }, this.options.timeout);
      });

      const result = await Promise.race([
        toolRegistry.execute(toolId, input, {
          ...context,
          timeout: this.options.timeout ?? 30000,
        }),
        timeoutPromise,
      ]);

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ toolId, error: message }, 'Tool execution failed');

      return {
        success: false,
        error: message,
        executionTime: Date.now() - startTime,
      };
    } finally {
      this.running--;
    }
  }

  async executeBatch(
    requests: Array<{ toolId: string; input: unknown; context: ToolContext }>
  ): Promise<ToolResult[]> {
    return Promise.all(
      requests.map((req) => this.execute(req.toolId, req.input, req.context))
    );
  }

  getRunningCount(): number {
    return this.running;
  }

  isToolEnabled(toolId: string): boolean {
    if (this.options.disabledTools?.includes(toolId)) {
      return false;
    }
    if (this.options.enabledTools && !this.options.enabledTools.includes(toolId)) {
      return false;
    }
    return true;
  }
}

export const toolExecutor = new ToolExecutor();
