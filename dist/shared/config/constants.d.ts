export declare const DEFAULT_TIMEOUT = 30000;
export declare const DEFAULT_MAX_STEPS = 50;
export declare const DEFAULT_MAX_HISTORY = 100;
export declare const DEFAULT_SESSION_TTL = 3600;
export declare const ERROR_MESSAGES: {
    readonly AGENT_NOT_FOUND: "Agent not found";
    readonly TOOL_NOT_FOUND: "Tool not found";
    readonly SKILL_NOT_FOUND: "Skill not found";
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly FORBIDDEN: "Access forbidden";
    readonly INTERNAL_ERROR: "Internal server error";
    readonly VALIDATION_ERROR: "Validation failed";
    readonly RATE_LIMIT_EXCEEDED: "Rate limit exceeded";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const STREAM_EVENT_TYPES: {
    readonly THOUGHT: "thought";
    readonly ACTION: "action";
    readonly OUTPUT: "output";
    readonly ERROR: "error";
    readonly DONE: "done";
};
//# sourceMappingURL=constants.d.ts.map