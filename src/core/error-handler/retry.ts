// Retry Handler
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('error-handler:retry');

export interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

export class RetryHandler {
  async execute<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxAttempts = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      backoffMultiplier = 2,
      shouldRetry = () => true,
    } = options;

    let lastError: Error | undefined;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === maxAttempts || !shouldRetry(lastError, attempt)) {
          throw lastError;
        }

        logger.warn(
          { attempt, maxAttempts, delay, error: lastError.message },
          'Retrying after error'
        );

        await this.sleep(delay);
        delay = Math.min(delay * backoffMultiplier, maxDelay);
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const retryHandler = new RetryHandler();
