// Auth Login Route
import { FastifyInstance } from 'fastify';

export async function loginRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { username, password } = request.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Username and password are required',
        },
      });
    }

    // In production, validate credentials and generate JWT
    return reply.send({
      token: 'mock-jwt-token',
      expiresIn: '7d',
    });
  });
}
