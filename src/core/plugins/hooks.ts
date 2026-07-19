// Plugin Hooks
import { createLogger } from '../../shared/utils/logger.js';
import { pluginRegistry } from './registry.js';
import type { HookContext, HookResult, Plugin } from '../../shared/types/plugin.js';

const logger = createLogger('plugins:hooks');

export class HookManager {
  async executeHook(
    hookName: keyof Plugin['hooks'],
    context: HookContext
  ): Promise<HookResult> {
    const plugins = pluginRegistry.listByStatus('loaded');
    let finalResult: HookResult = { modified: false };

    for (const plugin of plugins) {
      const hook = plugin.hooks[hookName];
      if (!hook) continue;

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
      } catch (error) {
        logger.error(
          { pluginId: plugin.id, hook: hookName, error },
          'Hook execution failed'
        );
      }
    }

    return finalResult;
  }

  async beforeAgent(context: HookContext): Promise<HookResult> {
    return this.executeHook('beforeAgent', context);
  }

  async afterAgent(context: HookContext): Promise<HookResult> {
    return this.executeHook('afterAgent', context);
  }

  async beforeTool(context: HookContext): Promise<HookResult> {
    return this.executeHook('beforeTool', context);
  }

  async afterTool(context: HookContext): Promise<HookResult> {
    return this.executeHook('afterTool', context);
  }

  async onError(context: HookContext): Promise<HookResult> {
    return this.executeHook('onError', context);
  }

  async onSessionStart(context: HookContext): Promise<HookResult> {
    return this.executeHook('onSessionStart', context);
  }

  async onSessionEnd(context: HookContext): Promise<HookResult> {
    return this.executeHook('onSessionEnd', context);
  }
}

export const hookManager = new HookManager();
