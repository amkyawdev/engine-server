import { FastifyRequest, FastifyReply } from 'fastify';
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
export declare function auditMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void>;
export declare function getAuditLog(limit?: number): AuditEntry[];
export declare function clearAuditLog(): void;
//# sourceMappingURL=audit.d.ts.map