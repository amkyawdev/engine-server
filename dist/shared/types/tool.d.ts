export interface Tool {
    id: string;
    name: string;
    description: string;
    version: string;
    category: ToolCategory;
    parameters?: ToolParameter[];
    returns?: ToolReturnType;
    permissions?: ToolPermission[];
    execute: (input: unknown, context: ToolContext) => Promise<ToolResult>;
}
export type ToolCategory = 'calculator' | 'file-reader' | 'http-request' | 'datetime' | 'code-interpreter' | 'custom';
export interface ToolParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object' | 'array';
    required: boolean;
    default?: unknown;
    description?: string;
    validation?: ToolValidation;
}
export interface ToolValidation {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
}
export interface ToolReturnType {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'void';
    description?: string;
}
export interface ToolPermission {
    type: 'network' | 'file-system' | 'execute' | 'env' | 'calculator' | 'datetime';
    level: 'none' | 'read' | 'write' | 'all';
    resources?: string[];
}
export interface ToolContext {
    sessionId: string;
    userId?: string;
    timeout: number;
    variables: Record<string, unknown>;
}
export interface ToolResult {
    success: boolean;
    output?: unknown;
    error?: string;
    executionTime: number;
    metadata?: Record<string, unknown>;
}
//# sourceMappingURL=tool.d.ts.map