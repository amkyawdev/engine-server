import { globalCache } from '../core/memory/cache.js';
export async function cacheMiddleware(request, reply) {
    // Only cache GET requests
    if (request.method !== 'GET')
        return;
    const cacheKey = request.url;
    // Check cache
    const cached = globalCache.get(cacheKey);
    if (cached) {
        reply.header('X-Cache', 'HIT');
        return reply.send(cached);
    }
    reply.header('X-Cache', 'MISS');
    // Override reply.send to cache response
    const originalSend = reply.send.bind(reply);
    reply.send = function (data) {
        if (reply.statusCode === 200) {
            globalCache.set(cacheKey, data, 60); // Cache for 60 seconds
        }
        return originalSend(data);
    };
}
//# sourceMappingURL=cache.js.map