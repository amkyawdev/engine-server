import { createLogger } from '../shared/utils/logger.js';
const logger = createLogger('middleware:logging');
export async function loggingMiddleware(request, reply) {
    const startTime = Date.now();
    reply.raw.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.info({
            method: request.method,
            url: request.url,
            statusCode: reply.statusCode,
            duration,
            userAgent: request.headers['user-agent'],
        }, 'Request completed');
    });
}
//# sourceMappingURL=logging.js.map