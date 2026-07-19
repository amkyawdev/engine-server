import { FastifyRequest, FastifyReply } from 'fastify';
interface CustomError extends Error {
    code?: string;
    statusCode?: number;
    details?: Record<string, unknown>;
    timestamp?: Date;
}
export declare function errorHandlerMiddleware(error: CustomError, request: FastifyRequest, reply: FastifyReply): Promise<void>;
export {};
//# sourceMappingURL=error-handler.d.ts.map