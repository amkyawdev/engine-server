export const DEFAULT_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_MAX_STEPS = 50;
export const DEFAULT_MAX_HISTORY = 100;
export const DEFAULT_SESSION_TTL = 3600; // 1 hour in seconds

export const ERROR_MESSAGES = {
  AGENT_NOT_FOUND: 'Agent not found',
  TOOL_NOT_FOUND: 'Tool not found',
  SKILL_NOT_FOUND: 'Skill not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation failed',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const STREAM_EVENT_TYPES = {
  THOUGHT: 'thought',
  ACTION: 'action',
  OUTPUT: 'output',
  ERROR: 'error',
  DONE: 'done',
} as const;
