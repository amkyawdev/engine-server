// Main Entry Point - Vercel Serverless Compatible
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './shared/config/index.js';
import { logger } from './shared/utils/logger.js';
// Routes - Basic routes for Vercel
import { healthRoute } from './api/health/route.js';
import { toolsRoute } from './api/tools/route.js';
import { skillsRoute } from './api/skills/route.js';
// Create Fastify instance
const app = Fastify({
    logger: config.logging,
});
// CORS
await app.register(cors, {
    origin: config.cors.origin,
});
// Rate Limiting
await app.register(rateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
});
// Register routes
app.register(healthRoute, { prefix: '/api/health' });
app.register(toolsRoute, { prefix: '/api/tools' });
app.register(skillsRoute, { prefix: '/api/skills' });
// Root route
app.get('/', async () => {
    return {
        name: 'engine-server',
        version: '1.0.0',
        status: 'running',
        message: 'AI Agent Engine Server',
    };
});
// Vercel Serverless Handler
export default async function handler(req) {
    try {
        await app.ready();
        const url = new URL(req.url, 'https://vercel.app');
        const method = req.method;
        let body = null;
        if (method !== 'GET' && method !== 'HEAD') {
            body = await req.text();
        }
        // @ts-ignore - Simplified for Vercel
        const result = await app.handle({
            method,
            url: url.pathname + url.search,
            headers: Object.fromEntries(req.headers.entries()),
            body,
        });
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    catch (error) {
        logger.error({ error }, 'Vercel handler error');
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
// Local development server
const isLocal = process.env.NODE_ENV !== 'production' && !process.env.VERCEL;
if (isLocal) {
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
}
//# sourceMappingURL=index.js.map