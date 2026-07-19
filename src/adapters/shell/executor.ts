// Shell Executor Adapter
import { createLogger } from '../../shared/utils/logger.js';
import { shellWhitelist } from './whitelist.js';

const logger = createLogger('adapters:shell:executor');

export interface ShellExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
  duration: number;
}

export interface ShellOptions {
  timeout?: number;
  cwd?: string;
  env?: Record<string, string>;
}

export class ShellExecutor {
  async execute(
    command: string,
    options: ShellOptions = {}
  ): Promise<ShellExecutionResult> {
    const startTime = Date.now();

    // Check whitelist
    if (!shellWhitelist.isAllowed(command)) {
      logger.warn({ command }, 'Command not in whitelist');
      return {
        success: false,
        error: 'Command not allowed',
        duration: Date.now() - startTime,
      };
    }

    try {
      logger.debug({ command, options }, 'Executing shell command');

      // In production, this would use child_process.spawn
      // For now, return a mock result
      return {
        success: true,
        output: 'Command executed successfully',
        exitCode: 0,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      logger.error({ command, error: message }, 'Shell execution failed');

      return {
        success: false,
        error: message,
        exitCode: 1,
        duration: Date.now() - startTime,
      };
    }
  }

  async executeBatch(commands: string[]): Promise<ShellExecutionResult[]> {
    return Promise.all(commands.map((cmd) => this.execute(cmd)));
  }
}

export const shellExecutor = new ShellExecutor();
