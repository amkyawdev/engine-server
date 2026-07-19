import type { Plugin } from '../../shared/types/plugin.js';
export interface PluginSource {
    type: 'local' | 'npm' | 'github';
    path?: string;
    package?: string;
    ref?: string;
}
export declare class PluginLoader {
    load(source: PluginSource): Promise<Plugin | null>;
    private loadLocal;
    private loadNpm;
    private loadGitHub;
    loadFromDirectory(dirPath: string): Promise<Plugin[]>;
}
export declare const pluginLoader: PluginLoader;
//# sourceMappingURL=loader.d.ts.map