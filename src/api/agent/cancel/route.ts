// Agent Cancel Route
import { FastifyInstance } from 'fastify';

export async function agentCancelRoute(app: FastifyInstance) {
  app.post<{ Params: { executionId: string } }>(
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

      // In production, cancel the execution
      return reply.send({
        success: true,
        executionId,
        status: 'cancelled',
      });
    }
  );
}
