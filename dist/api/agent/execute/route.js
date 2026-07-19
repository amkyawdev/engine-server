import { generateId } from '../../../shared/utils/crypto.js';
export async function agentExecuteRoute(app) {
    app.post('/', async (request, reply) => {
        const { input, agentId, config, context } = request.body;
        if (!input) {
            return reply.status(400).send({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Input is required',
                },
            });
        }
        const executionId = generateId();
        // In production, this would start the agent execution
        // and return immediately with execution ID
        const response = {
            executionId,
            status: 'pending',
        };
        return reply.status(202).send(response);
    });
}
//# sourceMappingURL=route.js.map