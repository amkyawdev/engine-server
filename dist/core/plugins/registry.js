// Plugin Registry
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('plugins:registry');
export class PluginRegistry {
    plugins = new Map();
    async register(plugin) {
        if (this.plugins.has(plugin.id)) {
            logger.warn({ pluginId: plugin.id }, 'Plugin already registered, updating');
        }
        plugin.status = 'loading';
        this.plugins.set(plugin.id, plugin);
        try {
            // Initialize plugin hooks
            plugin.status = 'loaded';
            logger.info({ pluginId: plugin.id, name: plugin.name }, 'Plugin registered');
        }
        catch (error) {
            plugin.status = 'error';
            logger.error({ pluginId: plugin.id, error }, 'Plugin registration failed');
            throw error;
        }
    }
    async unregister(id) {
        const plugin = this.plugins.get(id);
        if (!plugin)
            return false;
        // Cleanup plugin
        logger.info({ pluginId: id }, 'Plugin unregistered');
        return this.plugins.delete(id);
    }
    get(id) {
        return this.plugins.get(id);
    }
    getByName(name) {
        for (const plugin of this.plugins.values()) {
            if (plugin.name === name) {
                return plugin;
            }
        }
        return undefined;
    }
    list() {
        return [...this.plugins.values()];
    }
    listByStatus(status) {
        return [...this.plugins.values()].filter((p) => p.status === status);
    }
    async enable(id) {
        const plugin = this.plugins.get(id);
        if (!plugin)
            return false;
        plugin.status = 'loaded';
        logger.info({ pluginId: id }, 'Plugin enabled');
        return true;
    }
    async disable(id) {
        const plugin = this.plugins.get(id);
        if (!plugin)
            return false;
        plugin.status = 'disabled';
        logger.info({ pluginId: id }, 'Plugin disabled');
        return true;
    }
    clear() {
        this.plugins.clear();
        logger.info('All plugins cleared');
    }
}
export const pluginRegistry = new PluginRegistry();
//# sourceMappingURL=registry.js.map