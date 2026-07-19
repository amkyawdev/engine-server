// Shell Command Whitelist
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('adapters:shell:whitelist');
const DEFAULT_WHITELIST = [
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
    rules = new Set();
    blockedPatterns = [
        /rm\s+-rf\s+\//i,
        /mkfs/i,
        /dd\s+if=/i,
        /shutdown/i,
        /reboot/i,
    ];
    constructor(rules = DEFAULT_WHITELIST) {
        for (const rule of rules) {
            this.rules.add(rule.command);
        }
    }
    add(command) {
        this.rules.add(command);
        logger.info({ command }, 'Command added to whitelist');
    }
    remove(command) {
        return this.rules.delete(command);
    }
    isAllowed(command) {
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
    list() {
        return [...this.rules];
    }
}
export const shellWhitelist = new ShellWhitelist();
//# sourceMappingURL=whitelist.js.map