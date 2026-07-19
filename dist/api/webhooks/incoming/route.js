export async function incomingWebhookRoute(app) {
    app.post('/', async (request, reply) => {
        const signature = request.headers['x-signature'];
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
    app.post('/:event', async (request, reply) => {
        const { event } = request.params;
        const body = request.body;
        console.log(`Received ${event} webhook:`, body);
        return reply.send({
            received: true,
            event,
            timestamp: new Date().toISOString(),
        });
    });
}
//# sourceMappingURL=route.js.map