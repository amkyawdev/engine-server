// Agent Status Route
import { FastifyInstance } from 'fastify';
import type { StatusResponse } from '../../../shared/types/api.js';

export async function agentStatusRoute(app: FastifyInstance) {
  app.get<{ Params: { executionId: string } }>(
    '/:executionId',
    async (request, reply) => {
      const { executionId } = request.params;

      if (!executionId) {
        return reply.status(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Execution ID is required',
          },
        });
      }

      // In production, fetch actual execution status
      const response: StatusResponse = {
        executionId,
        status: 'running',
        steps: [],
        progress: {
          currentStep: 0,
          totalSteps: 10,
          percentage: 0,
        },
      };

      return reply.send(response);
    }
  );
}
