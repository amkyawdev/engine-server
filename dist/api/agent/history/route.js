export async function agentHistoryRoute(app) {
    app.get('/', async (request, reply) => {
        const { sessionId, agentId, limit = 20, offset = 0 } = request.query;
        // In production, fetch from database
        const response = {
            executions: [],
            total: 0,
            limit,
            offset,
        };
        return reply.send(response);
    });
    app.get('/:executionId', async (request, reply) => {
        const { executionId } = request.params;
        // In production, fetch from database
        return reply.send({
            executionId,
            input: '',
            status: 'completed',
            createdAt: new Date().toISOString(),
        });
    });
}
//# sourceMappingURL=route.js.map