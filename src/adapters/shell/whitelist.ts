// Shell Command Whitelist
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('adapters:shell:whitelist');

export interface WhitelistRule {
  command: string;
  args?: string[];
  description?: string;
}

const DEFAULT_WHITELIST: WhitelistRule[] = [
  { command: 'ls', description: 'List directory contents' },
  { command: 'pwd', description: 'Print working directory' },
  { command: 'echo', description: 'Display text' },
  { command: 'cat', description: 'Display file contents' },
  { command: 'grep', description: 'Search for patterns' },
  { command: 'find', description: 'Search for files' },
  { command: 'mkdir', description: 'Create directory' },
  { command: 'touch', description: 'Create empty file' },
  { command: 'rm', args: ['-f'], description: 'Remove file' },
  { command: 'cp', description: 'Copy file' },
  { command: 'mv', description: 'Move file' },
  { command: 'curl', description: 'HTTP client' },
  { command: 'wget', description: 'Download files' },
];

export class ShellWhitelist {
  private rules: Set<string> = new Set();
  private blockedPatterns: RegExp[] = [
    /rm\s+-rf\s+\//i,
    /mkfs/i,
    /dd\s+if=/i,
    /shutdown/i,
    /reboot/i,
  ];

  constructor(rules: WhitelistRule[] = DEFAULT_WHITELIST) {
    for (const rule of rules) {
      this.rules.add(rule.command);
    }
  }

  add(command: string): void {
    this.rules.add(command);
    logger.info({ command }, 'Command added to whitelist');
  }

  remove(command: string): boolean {
    return this.rules.delete(command);
  }

  isAllowed(command: string): boolean {
    // Check blocked patterns first
    for (const pattern of this.blockedPatterns) {
      if (pattern.test(command)) {
        return false;
      }
    }

    // Extract the base command
    const parts = command.trim().split(/\s+/);
    const baseCommand = parts[0];

    return this.rules.has(baseCommand);
  }

  list(): string[] {
    return [...this.rules];
  }
}

export const shellWhitelist = new ShellWhitelist();
