// Fallback Handler
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('error-handler:fallback');
export class FallbackHandler {
    async execute(options, defaultValue) {
        const sorted = [...options].sort((a, b) => (b.weight || 1) - (a.weight || 1));
        for (const option of sorted) {
            try {
                logger.debug({ name: option.name }, 'Trying fallback option');
                const result = await option.fn();
                logger.info({ name: option.name }, 'Fallback option succeeded');
                return result;
            }
            catch (error) {
                logger.warn({ name: option.name, error }, 'Fallback option failed, trying next');
            }
        }
        if (defaultValue !== undefined) {
            logger.info('Using default value');
            return defaultValue;
        }
        throw new Error('All fallback options failed');
    }
}
export const fallbackHandler = new FallbackHandler();
//# sourceMappingURL=fallback.js.map