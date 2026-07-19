// CLI Commands
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('adapters:cli:commands');
const DEFAULT_COMMANDS = [
    {
        name: 'help',
        description: 'Show help information',
        usage: 'help [command]',
        execute: async () => ({
            success: true,
            output: 'Available commands: help, status, list, exec',
        }),
    },
    {
        name: 'status',
        description: 'Show system status',
        usage: 'status',
        execute: async () => ({
            success: true,
            output: 'System status: OK',
        }),
    },
    {
        name: 'list',
        description: 'List resources',
        usage: 'list <resource>',
        execute: async (args) => ({
            success: true,
            output: `Listing ${args[0] || 'all'}...`,
        }),
    },
];
export class CommandHandler {
    commands = new Map();
    constructor() {
        for (const cmd of DEFAULT_COMMANDS) {
            this.register(cmd);
        }
    }
    register(definition) {
        this.commands.set(definition.name, definition);
        logger.debug({ command: definition.name }, 'Command registered');
    }
    unregister(name) {
        return this.commands.delete(name);
    }
    async execute(input) {
        const parts = input.trim().split(/\s+/);
        const commandName = parts[0];
        const args = parts.slice(1);
        const command = this.commands.get(commandName);
        if (!command) {
            return {
                success: false,
                error: `Unknown command: ${commandName}`,
            };
        }
        try {
            return await command.execute(args);
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    list() {
        return [...this.commands.values()];
    }
    get(name) {
        return this.commands.get(name);
    }
}
export const commandHandler = new CommandHandler();
//# sourceMappingURL=commands.js.map