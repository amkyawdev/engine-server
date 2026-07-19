// Auth Verify Route
import { FastifyInstance } from 'fastify';

export async function verifyRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { token } = request.body as { token?: string };

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
