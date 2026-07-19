// Error Reporter
import { createLogger } from '../../shared/utils/logger.js';
import type { AppError, ErrorResponse } from '../../shared/types/error.js';

const logger = createLogger('error-handler:reporter');

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

export class ErrorReporter {
  private reports: ErrorReport[] = [];

  report(error: AppError, context: Partial<ErrorReport['context']> = {}): void {
    const report: ErrorReport = {
      error,
      context: {
        ...context,
        timestamp: new Date(),
      },
    };

    this.reports.push(report);

    logger.error(
      {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        context: report.context,
      },
      'Error reported'
    );

    // In production, send to error tracking service
    this.sendToService(report);
  }

  getReports(limit?: number): ErrorReport[] {
    return limit ? this.reports.slice(-limit) : [...this.reports];
  }

  getReportsBySession(sessionId: string): ErrorReport[] {
    return this.reports.filter((r) => r.context.sessionId === sessionId);
  }

  clear(): void {
    this.reports = [];
  }

  toResponse(error: AppError): ErrorResponse {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
      timestamp: error.timestamp.toISOString(),
    };
  }

  private sendToService(report: ErrorReport): void {
    // Placeholder for error tracking service integration
    // e.g., Sentry, Datadog, etc.
  }
}

export const errorReporter = new ErrorReporter();
