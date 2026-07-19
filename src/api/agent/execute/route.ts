// Agent Execute Route
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { generateId } from '../../../shared/utils/crypto.js';
import type { ExecuteRequest, ExecuteResponse } from '../../../shared/types/api.js';

export async function agentExecuteRoute(app: FastifyInstance) {
  app.post('/', async (request: FastifyRequest<{ Body: ExecuteRequest }>, reply: FastifyReply) => {
    const { input, agentId, config, context } = request.body;

    if (!input) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input is required',
        },
      });
    }

    const executionId = generateId();

    // In production, this would start the agent execution
    // and return immediately with execution ID

    const response: ExecuteResponse = {
      executionId,
      status: 'pending',
    };

    return reply.status(202).send(response);
  });
}
