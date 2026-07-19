// Retry Handler
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('error-handler:retry');
export class RetryHandler {
    async execute(fn, options = {}) {
        const { maxAttempts = 3, initialDelay = 1000, maxDelay = 30000, backoffMultiplier = 2, shouldRetry = () => true, } = options;
        let lastError;
        let delay = initialDelay;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (attempt === maxAttempts || !shouldRetry(lastError, attempt)) {
                    throw lastError;
                }
                logger.warn({ attempt, maxAttempts, delay, error: lastError.message }, 'Retrying after error');
                await this.sleep(delay);
                delay = Math.min(delay * backoffMultiplier, maxDelay);
            }
        }
        throw lastError;
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
export const retryHandler = new RetryHandler();
//# sourceMappingURL=retry.js.map