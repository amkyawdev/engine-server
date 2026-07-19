import type { ToolContext, ToolResult } from '../../shared/types/tool.js';
export interface ExecutorOptions {
    timeout?: number;
    maxConcurrent?: number;
    enabledTools?: string[];
    disabledTools?: string[];
}
export declare class ToolExecutor {
    private options;
    private running;
    constructor(options?: ExecutorOptions);
    execute(toolId: string, input: unknown, context: ToolContext): Promise<ToolResult>;
    executeBatch(requests: Array<{
        toolId: string;
        input: unknown;
        context: ToolContext;
    }>): Promise<ToolResult[]>;
    getRunningCount(): number;
    isToolEnabled(toolId: string): boolean;
}
export declare const toolExecutor: ToolExecutor;
//# sourceMappingURL=executor.d.ts.map