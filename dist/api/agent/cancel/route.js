export async function agentCancelRoute(app) {
    app.post('/:executionId', async (request, reply) => {
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
    });
}
//# sourceMappingURL=route.js.map