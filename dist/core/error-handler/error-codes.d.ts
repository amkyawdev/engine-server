import { ErrorCode, AppError } from '../../shared/types/error.js';
export declare const createAppError: (code: ErrorCode, message?: string, details?: Record<string, unknown>, cause?: Error) => AppError;
export declare const getStatusCode: (code: ErrorCode) => number;
export declare const getErrorMessage: (code: ErrorCode) => string;
//# sourceMappingURL=error-codes.d.ts.map