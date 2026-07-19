// Error Handler Middleware
import { FastifyRequest, FastifyReply } from 'fastify';
import { createLogger } from '../shared/utils/logger.js';
import { AppError, ErrorCode } from '../shared/types/error.js';
import { getStatusCode } from '../shared/config/constants.js';

const logger = createLogger('middleware:error-handler');

export async function errorHandlerMiddleware(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  logger.error(
    {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
    },
    'Request error'
  );

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp: error.timestamp.toISOString(),
    });
  }

  // Generic error
  const statusCode = 500;
  return reply.status(statusCode).send({
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: 'Internal server error',
    },
    timestamp: new Date().toISOString(),
  });
}
