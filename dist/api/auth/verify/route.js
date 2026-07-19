export async function verifyRoute(app) {
    app.post('/', async (request, reply) => {
        const { token } = request.body;
        if (!token) {
            return reply.status(400).send({
                error: {
                    code: 'VALIDATION_ERROR',
                    message: 'Token is required',
                },
            });
        }
        // In production, verify JWT and return user info
        return reply.send({
            valid: true,
            user: {
                id: 'user-1',
                username: 'admin',
            },
        });
    });
}
//# sourceMappingURL=route.js.map