// Agent History Route
import { FastifyInstance } from 'fastify';
import type { HistoryQuery, HistoryResponse } from '../../../shared/types/api.js';

export async function agentHistoryRoute(app: FastifyInstance) {
  app.get<{ Querystring: HistoryQuery }>(
    '/',
    async (request, reply) => {
      const { sessionId, agentId, limit = 20, offset = 0 } = request.query;

      // In production, fetch from database
      const response: HistoryResponse = {
        executions: [],
        total: 0,
        limit,
        offset,
      };

      return reply.send(response);
    }
  );

  app.get<{ Params: { executionId: string } }>(
    '/:executionId',
    async (request, reply) => {
      const { executionId } = request.params;

      // In production, fetch from database
      return reply.send({
        executionId,
        input: '',
        status: 'completed',
        createdAt: new Date().toISOString(),
      });
    }
  );
}
