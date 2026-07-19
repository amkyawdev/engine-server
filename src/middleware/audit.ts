// Audit Middleware
import { FastifyRequest, FastifyReply } from 'fastify';
import { createLogger } from '../shared/utils/logger.js';

const logger = createLogger('middleware:audit');

export interface AuditEntry {
  timestamp: Date;
  userId?: string;
  method: string;
  url: string;
  statusCode: number;
  duration: number;
  ip?: string;
  userAgent?: string;
}

const auditLog: AuditEntry[] = [];

export async function auditMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const startTime = Date.now();
  const entry: AuditEntry = {
    timestamp: new Date(),
    method: request.method,
    url: request.url,
    statusCode: 0,
    duration: 0,
    ip: request.ip,
    userAgent: request.headers['user-agent'] as string,
  };

  reply.raw!.on('finish', () => {
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

export function getAuditLog(limit = 100): AuditEntry[] {
  return auditLog.slice(-limit);
}

export function clearAuditLog(): void {
  auditLog.length = 0;
}
