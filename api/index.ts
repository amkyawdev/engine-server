import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

const app = Fastify({ logger: false });

async function setup() {
  await app.register(cors, { origin: '*' });
  await app.register(rateLimit, { max: 100, timeWindow: 60000 });
  
  app.get('/', async () => ({ name: 'engine-server', version: '1.0.0', status: 'running' }));
  app.get('/api/health', async () => ({ status: 'healthy', timestamp: new Date().toISOString() }));
  app.get('/api/tools', async () => ({ tools: [{ id: 'calculator', name: 'Calculator' }], total: 1 }));
  app.get('/api/skills', async () => ({ skills: [], total: 0 }));
}

setup();

const handler = async (req: any, res: any) => {
  await app.ready();
  const result = await app.inject({ method: req.method, url: req.url, headers: req.headers });
  res.status(result.statusCode).header('Content-Type', 'application/json').send(result.body);
};

export default handler;
