import { createLogger } from '../shared/utils/logger.js';
const logger = createLogger('middleware:audit');
const auditLog = [];
export async function auditMiddleware(request, reply) {
    const startTime = Date.now();
    const entry = {
        timestamp: new Date(),
        method: request.method,
        url: request.url,
        statusCode: 0,
        duration: 0,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
    };
    reply.raw.on('finish', () => {
        entry.statusCode = reply.statusCode;
        entry.duration = Date.now() - startTime;
        auditLog.push(entry);
        if (auditLog.length > 10000) {
            auditLog.shift();
        }
        // Log security-sensitive operations
        if (request.url.startsWith('/api/auth') || request.url.startsWith('/api/admin')) {
            logger.info(entry, 'Audit event');
        }
    });
}
export function getAuditLog(limit = 100) {
    return auditLog.slice(-limit);
}
export function clearAuditLog() {
    auditLog.length = 0;
}
//# sourceMappingURL=audit.js.map