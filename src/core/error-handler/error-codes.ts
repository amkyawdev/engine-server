// Error Codes
import { ErrorCode, AppError } from '../../shared/types/error.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../shared/config/constants.js';

export const createAppError = (
  code: ErrorCode,
  message?: string,
  details?: Record<string, unknown>,
  cause?: Error
): AppError => {
  const error = new Error(message || ERROR_MESSAGES[code]) as AppError;
  error.code = code;
  error.statusCode = getStatusCode(code);
  error.details = details;
  error.cause = cause;
  error.timestamp = new Date();
  return error;
};

export const getStatusCode = (code: ErrorCode): number => {
  const mapping: Record<ErrorCode, number> = {
    [ErrorCode.INTERNAL_ERROR]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ErrorCode.VALIDATION_ERROR]: HTTP_STATUS.BAD_REQUEST,
    [ErrorCode.AGENT_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ErrorCode.AGENT_TIMEOUT]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ErrorCode.AGENT_CANCELLED]: HTTP_STATUS.BAD_REQUEST,
    [ErrorCode.AGENT_MAX_STEPS]: HTTP_STATUS.BAD_REQUEST,
    [ErrorCode.TOOL_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ErrorCode.TOOL_EXECUTION_FAILED]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ErrorCode.TOOL_PERMISSION_DENIED]: HTTP_STATUS.FORBIDDEN,
    [ErrorCode.TOOL_TIMEOUT]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ErrorCode.SKILL_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ErrorCode.SKILL_LOAD_FAILED]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ErrorCode.SKILL_EXECUTION_FAILED]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ErrorCode.MEMORY_NOT_FOUND]: HTTP_STATUS.NOT_FOUND,
    [ErrorCode.MEMORY_STORAGE_FAILED]: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    [ErrorCode.UNAUTHORIZED]: HTTP_STATUS.UNAUTHORIZED,
    [ErrorCode.FORBIDDEN]: HTTP_STATUS.FORBIDDEN,
    [ErrorCode.TOKEN_EXPIRED]: HTTP_STATUS.UNAUTHORIZED,
    [ErrorCode.RATE_LIMIT_EXCEEDED]: HTTP_STATUS.TOO_MANY_REQUESTS,
  };

  return mapping[code] || HTTP_STATUS.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (code: ErrorCode): string => {
  return ERROR_MESSAGES[code] || 'Unknown error';
};
