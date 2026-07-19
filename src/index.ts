// Main Entry Point - Vercel Serverless
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './shared/config/index.js';
import { logger } from './shared/utils/logger.js';
import { healthRoute } from './api/health/route.js';
import { toolsRoute } from './api/tools/route.js';
import { skillsRoute } from './api/skills/route.js';

const app = Fastify({ logger: config.logging });

await app.register(cors, { origin: config.cors.origin });
await app.register(rateLimit, { max: config.rateLimit.max, timeWindow: config.rateLimit.timeWindow });

app.register(healthRoute, { prefix: '/api/health' });
app.register(toolsRoute, { prefix: '/api/tools' });
app.register(skillsRoute, { prefix: '/api/skills' });

app.get('/', async () => ({
  name: 'engine-server',
  version: '1.0.0',
  status: 'running',
  message: 'AI Agent Engine Server',
}));

// Vercel with @vercel/node
const handler = async (req: any, res: any) => {
  await app.ready();
  
  // Build Fastify request
  const method = req.method || 'GET';
  const url = req.url || '/';
  const headers = req.headers || {};
  
  try {
    const result = await app.inject({ method, url, headers });
    res.status(result.statusCode).send(result.body);
  } catch (error) {
    logger.error({ error }, 'Handler error');
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export { handler };
export default handler;
