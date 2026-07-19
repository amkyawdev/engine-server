export async function agentStatusRoute(app) {
    app.get('/:executionId', async (request, reply) => {
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
        const response = {
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
    });
}
//# sourceMappingURL=route.js.map