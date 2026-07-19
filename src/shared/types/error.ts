// Error Types
export enum ErrorCode {
  // General
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Agent
  AGENT_NOT_FOUND = 'AGENT_NOT_FOUND',
  AGENT_TIMEOUT = 'AGENT_TIMEOUT',
  AGENT_CANCELLED = 'AGENT_CANCELLED',
  AGENT_MAX_STEPS = 'AGENT_MAX_STEPS',
  
  // Tool
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  TOOL_EXECUTION_FAILED = 'TOOL_EXECUTION_FAILED',
  TOOL_PERMISSION_DENIED = 'TOOL_PERMISSION_DENIED',
  TOOL_TIMEOUT = 'TOOL_TIMEOUT',
  
  // Skill
  SKILL_NOT_FOUND = 'SKILL_NOT_FOUND',
  SKILL_LOAD_FAILED = 'SKILL_LOAD_FAILED',
  SKILL_EXECUTION_FAILED = 'SKILL_EXECUTION_FAILED',
  
  // Memory
  MEMORY_NOT_FOUND = 'MEMORY_NOT_FOUND',
  MEMORY_STORAGE_FAILED = 'MEMORY_STORAGE_FAILED',
  
  // Auth
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Rate Limit
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface AppError extends Error {
  code: ErrorCode;
  statusCode: number;
  details?: Record<string, unknown>;
  cause?: Error;
  timestamp: Date;
}

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}
