import type { AppError, ErrorResponse } from '../../shared/types/error.js';
export interface ErrorReport {
    error: AppError;
    context: {
        sessionId?: string;
        userId?: string;
        endpoint?: string;
        method?: string;
        timestamp: Date;
    };
    metadata?: Record<string, unknown>;
}
export declare class ErrorReporter {
    private reports;
    report(error: AppError, context?: Partial<ErrorReport['context']>): void;
    getReports(limit?: number): ErrorReport[];
    getReportsBySession(sessionId: string): ErrorReport[];
    clear(): void;
    toResponse(error: AppError): ErrorResponse;
    private sendToService;
}
export declare const errorReporter: ErrorReporter;
//# sourceMappingURL=error-reporter.d.ts.map