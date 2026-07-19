const startTime = Date.now();
export async function healthRoute(app) {
    app.get('/', async (request, reply) => {
        const uptime = Date.now() - startTime;
        const checks = [
            {
                name: 'server',
                status: 'up',
                latency: 0,
            },
        ];
        const overallStatus = checks.every((c) => c.status === 'up')
            ? 'healthy'
            : checks.some((c) => c.status === 'down')
                ? 'unhealthy'
                : 'degraded';
        const health = {
            status: overallStatus,
            version: '1.0.0',
            uptime,
            checks,
        };
        const statusCode = overallStatus === 'healthy' ? 200 : 503;
        return reply.status(statusCode).send(health);
    });
    // Liveness probe
    app.get('/live', async (request, reply) => {
        return reply.send({ status: 'alive' });
    });
    // Readiness probe
    app.get('/ready', async (request, reply) => {
        return reply.send({ status: 'ready' });
    });
}
//# sourceMappingURL=route.js.map