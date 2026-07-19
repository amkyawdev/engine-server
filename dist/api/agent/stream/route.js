export async function agentStreamRoute(app) {
    app.post('/', async (request, reply) => {
        const { input } = request.body;
        if (!input) {
            return reply.status(400).send({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Input is required',
                },
            });
        }
        // Set up SSE headers
        reply.raw.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        // In production, this would stream agent events
        // For now, send a simple completion event
        const sendEvent = (data) => {
            reply.raw.write(`data: ${JSON.stringify(data)}\n\n`);
        };
        sendEvent({ type: 'done', data: { output: 'Stream completed' } });
        return reply;
    });
}
//# sourceMappingURL=route.js.map