// CLI REPL
import { createLogger } from '../../shared/utils/logger.js';
import { commandHandler } from './commands.js';
import { outputFormatter } from './output.js';
const logger = createLogger('adapters:cli:repl');
export class Repl {
    prompt;
    welcome;
    running = false;
    history = [];
    historyIndex = -1;
    constructor(options = {}) {
        this.prompt = options.prompt ?? '> ';
        this.welcome = options.welcome ?? 'Welcome to Engine Server CLI';
    }
    async start() {
        this.running = true;
        console.log(this.welcome);
        console.log('Type "help" for available commands, "exit" to quit\n');
        while (this.running) {
            const input = await this.readLine();
            if (!input)
                continue;
            this.addToHistory(input);
            if (input === 'exit' || input === 'quit') {
                console.log('Goodbye!');
                break;
            }
            await this.processInput(input);
        }
    }
    stop() {
        this.running = false;
        logger.info('REPL stopped');
    }
    async readLine() {
        // In production, use readline package
        // For now, return empty string (non-interactive)
        return '';
    }
    async processInput(input) {
        const result = await commandHandler.execute(input);
        if (result.success) {
            console.log(outputFormatter.success('Success'));
            if (result.output) {
                console.log(result.output);
            }
        }
        else {
            console.log(outputFormatter.error(result.error || 'Command failed'));
        }
    }
    addToHistory(input) {
        if (this.history[this.history.length - 1] !== input) {
            this.history.push(input);
            this.historyIndex = this.history.length;
        }
    }
    getHistory() {
        return [...this.history];
    }
}
export const repl = new Repl();
//# sourceMappingURL=repl.js.map