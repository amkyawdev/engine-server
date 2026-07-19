// Plugin Hooks
import { createLogger } from '../../shared/utils/logger.js';
import { pluginRegistry } from './registry.js';
const logger = createLogger('plugins:hooks');
export class HookManager {
    async executeHook(hookName, context) {
        const plugins = pluginRegistry.listByStatus('loaded');
        let finalResult = { modified: false };
        for (const plugin of plugins) {
            const hook = plugin.hooks[hookName];
            if (!hook)
                continue;
            try {
                logger.debug({ pluginId: plugin.id, hook: hookName }, 'Executing plugin hook');
                const result = await hook(context);
                if (result.modified) {
                    finalResult.modified = true;
                    finalResult.value = result.value;
                }
                if (result.skip) {
                    logger.debug({ pluginId: plugin.id }, 'Hook requested skip');
                    break;
                }
                if (result.error) {
                    logger.warn({ pluginId: plugin.id, error: result.error }, 'Hook returned error');
                }
            }
            catch (error) {
                logger.error({ pluginId: plugin.id, hook: hookName, error }, 'Hook execution failed');
            }
        }
        return finalResult;
    }
    async beforeAgent(context) {
        return this.executeHook('beforeAgent', context);
    }
    async afterAgent(context) {
        return this.executeHook('afterAgent', context);
    }
    async beforeTool(context) {
        return this.executeHook('beforeTool', context);
    }
    async afterTool(context) {
        return this.executeHook('afterTool', context);
    }
    async onError(context) {
        return this.executeHook('onError', context);
    }
    async onSessionStart(context) {
        return this.executeHook('onSessionStart', context);
    }
    async onSessionEnd(context) {
        return this.executeHook('onSessionEnd', context);
    }
}
export const hookManager = new HookManager();
//# sourceMappingURL=hooks.js.map