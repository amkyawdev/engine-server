export interface Plugin {
    id: string;
    name: string;
    version: string;
    description: string;
    author?: string;
    hooks: PluginHooks;
    tools?: PluginTool[];
    skills?: PluginSkill[];
    config?: PluginConfig;
    status: PluginStatus;
}
export type PluginStatus = 'loading' | 'loaded' | 'error' | 'disabled';
export interface PluginHooks {
    beforeAgent?: HookFunction;
    afterAgent?: HookFunction;
    beforeTool?: HookFunction;
    afterTool?: HookFunction;
    onError?: HookFunction;
    onSessionStart?: HookFunction;
    onSessionEnd?: HookFunction;
}
export type HookFunction = (context: HookContext) => Promise<HookResult> | HookResult;
export interface HookContext {
    sessionId: string;
    step?: {
        type: string;
        input: unknown;
        output?: unknown;
        error?: Error;
    };
    variables: Record<string, unknown>;
    metadata: Record<string, unknown>;
}
export interface HookResult {
    modified?: boolean;
    value?: unknown;
    skip?: boolean;
    error?: string;
}
export interface PluginTool {
    id: string;
    name: string;
    execute: (input: unknown, context: HookContext) => Promise<unknown>;
}
export interface PluginSkill {
    id: string;
    name: string;
    triggers: string[];
    actions: PluginSkillAction[];
}
export interface PluginSkillAction {
    name: string;
    execute: (context: HookContext) => Promise<{
        output: string;
        data?: unknown;
    }>;
}
export interface PluginConfig {
    permissions?: string[];
    settings?: Record<string, unknown>;
    dependencies?: string[];
}
//# sourceMappingURL=plugin.d.ts.map