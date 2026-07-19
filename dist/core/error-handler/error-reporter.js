// Error Reporter
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('error-handler:reporter');
export class ErrorReporter {
    reports = [];
    report(error, context = {}) {
        const report = {
            error,
            context: {
                ...context,
                timestamp: new Date(),
            },
        };
        this.reports.push(report);
        logger.error({
            code: error.code,
            message: error.message,
            statusCode: error.statusCode,
            context: report.context,
        }, 'Error reported');
        // In production, send to error tracking service
        this.sendToService(report);
    }
    getReports(limit) {
        return limit ? this.reports.slice(-limit) : [...this.reports];
    }
    getReportsBySession(sessionId) {
        return this.reports.filter((r) => r.context.sessionId === sessionId);
    }
    clear() {
        this.reports = [];
    }
    toResponse(error) {
        return {
            error: {
                code: error.code,
                message: error.message,
                details: error.details,
            },
            timestamp: error.timestamp.toISOString(),
        };
    }
    sendToService(report) {
        // Placeholder for error tracking service integration
        // e.g., Sentry, Datadog, etc.
    }
}
export const errorReporter = new ErrorReporter();
//# sourceMappingURL=error-reporter.js.map