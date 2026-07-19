// Error Codes
import { ErrorCode } from '../../shared/types/error.js';
import { HTTP_STATUS } from '../../shared/config/constants.js';
const ERROR_MESSAGES_MAP = {
    [ErrorCode.INTERNAL_ERROR]: 'Internal server error',
    [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
    [ErrorCode.AGENT_NOT_FOUND]: 'Agent not found',
    [ErrorCode.AGENT_TIMEOUT]: 'Agent execution timed out',
    [ErrorCode.AGENT_CANCELLED]: 'Agent execution cancelled',
    [ErrorCode.AGENT_MAX_STEPS]: 'Maximum steps exceeded',
    [ErrorCode.TOOL_NOT_FOUND]: 'Tool not found',
    [ErrorCode.TOOL_EXECUTION_FAILED]: 'Tool execution failed',
    [ErrorCode.TOOL_PERMISSION_DENIED]: 'Tool permission denied',
    [ErrorCode.TOOL_TIMEOUT]: 'Tool execution timed out',
    [ErrorCode.SKILL_NOT_FOUND]: 'Skill not found',
    [ErrorCode.SKILL_LOAD_FAILED]: 'Skill load failed',
    [ErrorCode.SKILL_EXECUTION_FAILED]: 'Skill execution failed',
    [ErrorCode.MEMORY_NOT_FOUND]: 'Memory not found',
    [ErrorCode.MEMORY_STORAGE_FAILED]: 'Memory storage failed',
    [ErrorCode.UNAUTHORIZED]: 'Unauthorized access',
    [ErrorCode.FORBIDDEN]: 'Access forbidden',
    [ErrorCode.TOKEN_EXPIRED]: 'Token expired',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
};
export const createAppError = (code, message, details, cause) => {
    const error = new Error(message || ERROR_MESSAGES_MAP[code]);
    error.code = code;
    error.statusCode = getStatusCode(code);
    error.details = details;
    error.cause = cause;
    error.timestamp = new Date();
    return error;
};
export const getStatusCode = (code) => {
    const mapping = {
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
export const getErrorMessage = (code) => {
    return ERROR_MESSAGES_MAP[code] || 'Unknown error';
};
//# sourceMappingURL=error-codes.js.map