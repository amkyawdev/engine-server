// Agent Stream Route
import { FastifyInstance } from 'fastify';
import type { ExecuteRequest } from '../../../shared/types/api.js';

export async function agentStreamRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { input } = request.body as ExecuteRequest;

    if (!input) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Input is required',
        },
      });
    }

    // Set up SSE headers
    reply.raw!.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // In production, this would stream agent events
    // For now, send a simple completion event
    const sendEvent = (data: unknown) => {
      reply.raw!.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    sendEvent({ type: 'done', data: { output: 'Stream completed' } });

    return reply;
  });
}
