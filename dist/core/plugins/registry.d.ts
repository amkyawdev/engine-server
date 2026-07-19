import type { Plugin, PluginStatus } from '../../shared/types/plugin.js';
export declare class PluginRegistry {
    private plugins;
    register(plugin: Plugin): Promise<void>;
    unregister(id: string): Promise<boolean>;
    get(id: string): Plugin | undefined;
    getByName(name: string): Plugin | undefined;
    list(): Plugin[];
    listByStatus(status: PluginStatus): Plugin[];
    enable(id: string): Promise<boolean>;
    disable(id: string): Promise<boolean>;
    clear(): void;
}
export declare const pluginRegistry: PluginRegistry;
//# sourceMappingURL=registry.d.ts.map