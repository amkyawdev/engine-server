// Error Types
export var ErrorCode;
(function (ErrorCode) {
    // General
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    // Agent
    ErrorCode["AGENT_NOT_FOUND"] = "AGENT_NOT_FOUND";
    ErrorCode["AGENT_TIMEOUT"] = "AGENT_TIMEOUT";
    ErrorCode["AGENT_CANCELLED"] = "AGENT_CANCELLED";
    ErrorCode["AGENT_MAX_STEPS"] = "AGENT_MAX_STEPS";
    // Tool
    ErrorCode["TOOL_NOT_FOUND"] = "TOOL_NOT_FOUND";
    ErrorCode["TOOL_EXECUTION_FAILED"] = "TOOL_EXECUTION_FAILED";
    ErrorCode["TOOL_PERMISSION_DENIED"] = "TOOL_PERMISSION_DENIED";
    ErrorCode["TOOL_TIMEOUT"] = "TOOL_TIMEOUT";
    // Skill
    ErrorCode["SKILL_NOT_FOUND"] = "SKILL_NOT_FOUND";
    ErrorCode["SKILL_LOAD_FAILED"] = "SKILL_LOAD_FAILED";
    ErrorCode["SKILL_EXECUTION_FAILED"] = "SKILL_EXECUTION_FAILED";
    // Memory
    ErrorCode["MEMORY_NOT_FOUND"] = "MEMORY_NOT_FOUND";
    ErrorCode["MEMORY_STORAGE_FAILED"] = "MEMORY_STORAGE_FAILED";
    // Auth
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    // Rate Limit
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
})(ErrorCode || (ErrorCode = {}));
//# sourceMappingURL=error.js.map