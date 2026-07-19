import { createLogger } from '../shared/utils/logger.js';
const logger = createLogger('middleware:auth');
export async function authMiddleware(request, reply) {
    // Skip auth for public routes
    const publicPaths = ['/api/health', '/api/auth/login', '/api/webhooks/incoming'];
    if (publicPaths.some((path) => request.url.startsWith(path))) {
        return;
    }
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        logger.warn({ path: request.url }, 'Missing authorization header');
        reply.status(401).send({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authorization required',
            },
        });
        return;
    }
    // In production, verify JWT token
    if (!authHeader.startsWith('Bearer ')) {
        reply.status(401).send({
            error: {
                code: 'UNAUTHORIZED',
                message: 'Invalid authorization format',
            },
        });
    }
}
//# sourceMappingURL=auth.js.map