// Shell Output Parser
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('adapters:shell:parser');

export interface ParsedOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
  duration: number;
  lines: string[];
}

export class ShellParser {
  parse(output: string): ParsedOutput {
    logger.debug({ length: output.length }, 'Parsing shell output');

    const lines = output.split('\n').filter((line) => line.length > 0);

    return {
      stdout: output,
      stderr: '',
      exitCode: 0,
      duration: 0,
      lines,
    };
  }

  parseWithExitCode(output: string, exitCode: number): ParsedOutput {
    const parsed = this.parse(output);
    parsed.exitCode = exitCode;
    return parsed;
  }

  extractErrors(output: string): string[] {
    const errorPatterns = [
      /error:/gi,
      /failed/gi,
      /fatal/gi,
      /permission denied/gi,
      /no such file/gi,
    ];

    const errors: string[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
      for (const pattern of errorPatterns) {
        if (pattern.test(line)) {
          errors.push(line);
          break;
        }
      }
    }

    return errors;
  }

  formatForDisplay(output: string, options: { maxLines?: number; maxWidth?: number } = {}): string {
    const { maxLines = 100, maxWidth = 80 } = options;
    const lines = output.split('\n');

    const truncated = lines.length > maxLines
      ? [...lines.slice(0, maxLines), `... (${lines.length - maxLines} more lines)`]
      : lines;

    return truncated
      .map((line) => (line.length > maxWidth ? line.slice(0, maxWidth) + '...' : line))
      .join('\n');
  }
}

export const shellParser = new ShellParser();
