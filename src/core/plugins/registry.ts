// Plugin Registry
import { createLogger } from '../../shared/utils/logger.js';
import type { Plugin, PluginStatus } from '../../shared/types/plugin.js';

const logger = createLogger('plugins:registry');

export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  async register(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      logger.warn({ pluginId: plugin.id }, 'Plugin already registered, updating');
    }

    plugin.status = 'loading';
    this.plugins.set(plugin.id, plugin);

    try {
      // Initialize plugin hooks
      plugin.status = 'loaded';
      logger.info({ pluginId: plugin.id, name: plugin.name }, 'Plugin registered');
    } catch (error) {
      plugin.status = 'error';
      logger.error({ pluginId: plugin.id, error }, 'Plugin registration failed');
      throw error;
    }
  }

  async unregister(id: string): Promise<boolean> {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;

    // Cleanup plugin
    logger.info({ pluginId: id }, 'Plugin unregistered');
    return this.plugins.delete(id);
  }

  get(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  getByName(name: string): Plugin | undefined {
    for (const plugin of this.plugins.values()) {
      if (plugin.name === name) {
        return plugin;
      }
    }
    return undefined;
  }

  list(): Plugin[] {
    return [...this.plugins.values()];
  }

  listByStatus(status: PluginStatus): Plugin[] {
    return [...this.plugins.values()].filter((p) => p.status === status);
  }

  async enable(id: string): Promise<boolean> {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;

    plugin.status = 'loaded';
    logger.info({ pluginId: id }, 'Plugin enabled');
    return true;
  }

  async disable(id: string): Promise<boolean> {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;

    plugin.status = 'disabled';
    logger.info({ pluginId: id }, 'Plugin disabled');
    return true;
  }

  clear(): void {
    this.plugins.clear();
    logger.info('All plugins cleared');
  }
}

export const pluginRegistry = new PluginRegistry();
