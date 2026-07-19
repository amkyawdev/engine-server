// Script Executor
import { scriptParser } from './parser.js';
import { contextManager } from './context.js';
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('scripter:executor');
export class ScriptExecutor {
    options;
    constructor(options = {}) {
        this.options = options;
    }
    async execute(script, context) {
        const startTime = Date.now();
        let stepCount = 0;
        logger.info({ sessionId: context.sessionId }, 'Starting script execution');
        try {
            // Parse the script
            const parsed = scriptParser.parse(script);
            // Validate
            const validation = scriptParser.validate(script);
            if (!validation.valid) {
                return {
                    success: false,
                    error: validation.errors.join(', '),
                    steps: 0,
                    duration: Date.now() - startTime,
                };
            }
            // Execute each step
            for (const step of parsed.steps) {
                stepCount++;
                // Check max steps
                if (stepCount > (this.options.maxSteps ?? context.config.maxSteps)) {
                    logger.warn({ sessionId: context.sessionId, steps: stepCount }, 'Max steps exceeded');
                    break;
                }
                // Execute callback if provided
                if (this.options.onStep) {
                    await this.options.onStep(step, stepCount);
                }
                // Add to history
                contextManager.addHistoryItem(context.sessionId, {
                    step: stepCount,
                    type: step.type,
                    content: step.content,
                });
            }
            logger.info({ sessionId: context.sessionId, steps: stepCount, duration: Date.now() - startTime }, 'Script execution completed');
            return {
                success: true,
                steps: stepCount,
                duration: Date.now() - startTime,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            logger.error({ sessionId: context.sessionId, error: message }, 'Script execution failed');
            return {
                success: false,
                error: message,
                steps: stepCount,
                duration: Date.now() - startTime,
            };
        }
    }
}
export const scriptExecutor = new ScriptExecutor();
//# sourceMappingURL=executor.js.map