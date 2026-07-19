import type { HookContext, HookResult, Plugin } from '../../shared/types/plugin.js';
export declare class HookManager {
    executeHook(hookName: keyof Plugin['hooks'], context: HookContext): Promise<HookResult>;
    beforeAgent(context: HookContext): Promise<HookResult>;
    afterAgent(context: HookContext): Promise<HookResult>;
    beforeTool(context: HookContext): Promise<HookResult>;
    afterTool(context: HookContext): Promise<HookResult>;
    onError(context: HookContext): Promise<HookResult>;
    onSessionStart(context: HookContext): Promise<HookResult>;
    onSessionEnd(context: HookContext): Promise<HookResult>;
}
export declare const hookManager: HookManager;
//# sourceMappingURL=hooks.d.ts.map