// Main Entry Point
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import { config } from './shared/config/index.js';
import { logger } from './shared/utils/logger.js';
// Routes
import { agentExecuteRoute } from './api/agent/execute/route.js';
import { agentStreamRoute } from './api/agent/stream/route.js';
import { agentStatusRoute } from './api/agent/status/route.js';
import { agentCancelRoute } from './api/agent/cancel/route.js';
import { agentHistoryRoute } from './api/agent/history/route.js';
import { skillsRoute } from './api/skills/route.js';
import { toolsRoute } from './api/tools/route.js';
import { healthRoute } from './api/health/route.js';
import { loginRoute } from './api/auth/login/route.js';
import { verifyRoute } from './api/auth/verify/route.js';
import { incomingWebhookRoute } from './api/webhooks/incoming/route.js';
const app = Fastify({
    logger: config.logging,
});
// Plugins
await app.register(cors, {
    origin: config.cors.origin,
});
await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
});
await app.register(websocket);
// Routes
app.register(agentExecuteRoute, { prefix: '/api/agent/execute' });
app.register(agentStreamRoute, { prefix: '/api/agent/stream' });
app.register(agentStatusRoute, { prefix: '/api/agent/status' });
app.register(agentCancelRoute, { prefix: '/api/agent/cancel' });
app.register(agentHistoryRoute, { prefix: '/api/agent/history' });
app.register(skillsRoute, { prefix: '/api/skills' });
app.register(toolsRoute, { prefix: '/api/tools' });
app.register(healthRoute, { prefix: '/api/health' });
app.register(loginRoute, { prefix: '/api/auth/login' });
app.register(verifyRoute, { prefix: '/api/auth/verify' });
app.register(incomingWebhookRoute, { prefix: '/api/webhooks/incoming' });
// Root route
app.get('/', async () => {
    return {
        name: 'engine-server',
        version: '1.0.0',
        status: 'running',
    };
});
// Start server
const start = async () => {
    try {
        await app.listen({
            port: config.server.port,
            host: config.server.host,
        });
        logger.info(`Server running on http://${config.server.host}:${config.server.port}`);
    }
    catch (error) {
        logger.error({ error }, 'Failed to start server');
        process.exit(1);
    }
};
start();
export { app };
//# sourceMappingURL=index.js.map