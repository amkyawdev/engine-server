// Incoming Webhooks Route
import { FastifyInstance } from 'fastify';

export async function incomingWebhookRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const signature = request.headers['x-signature'] as string;
    const body = request.body;

    // In production, verify webhook signature
    if (!signature) {
      // Allow unsigned webhooks for now
    }

    // Process webhook
    console.log('Received webhook:', body);

    return reply.send({
      received: true,
      timestamp: new Date().toISOString(),
    });
  });

  // Webhook event handler
  app.post<{ Params: { event: string } }>(
    '/:event',
    async (request, reply) => {
      const { event } = request.params;
      const body = request.body;

      console.log(`Received ${event} webhook:`, body);

      return reply.send({
        received: true,
        event,
        timestamp: new Date().toISOString(),
      });
    }
  );
}
