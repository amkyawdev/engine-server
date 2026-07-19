// Logging Middleware
import { FastifyRequest, FastifyReply } from 'fastify';
import { createLogger } from '../shared/utils/logger.js';

const logger = createLogger('middleware:logging');

export async function loggingMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const startTime = Date.now();

  reply.raw!.on('finish', () => {
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
