import type { Tool, ToolContext, ToolResult } from '../../shared/types/tool.js';
export declare class ToolRegistry {
    private tools;
    register(tool: Tool): void;
    unregister(id: string): boolean;
    get(id: string): Tool | undefined;
    getByName(name: string): Tool | undefined;
    list(): Tool[];
    listByCategory(category: string): Tool[];
    execute(toolId: string, input: unknown, context: ToolContext): Promise<ToolResult>;
    has(id: string): boolean;
    clear(): void;
}
export declare const toolRegistry: ToolRegistry;
//# sourceMappingURL=registry.d.ts.map