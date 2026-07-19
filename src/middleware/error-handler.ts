// Error Handler Middleware
import { FastifyRequest, FastifyReply } from 'fastify';
import { createLogger } from '../shared/utils/logger.js';
import { ErrorCode } from '../shared/types/error.js';

const logger = createLogger('middleware:error-handler');

interface CustomError extends Error {
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  timestamp?: Date;
}

export async function errorHandlerMiddleware(
  error: CustomError,
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

  if (error.statusCode) {
    return reply.status(error.statusCode).send({
      error: {
        code: error.code || 'ERROR',
        message: error.message,
        details: error.details,
      },
      timestamp: error.timestamp?.toISOString() || new Date().toISOString(),
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
