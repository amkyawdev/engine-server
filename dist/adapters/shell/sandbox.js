// Shell Sandbox
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('adapters:shell:sandbox');
export class ShellSandbox {
    config;
    activeProcesses = new Set();
    constructor(config = {}) {
        this.config = {
            maxMemory: config.maxMemory ?? 512 * 1024 * 1024, // 512MB
            maxCpu: config.maxCpu ?? 1,
            maxProcesses: config.maxProcesses ?? 10,
            timeout: config.timeout ?? 30000,
            networkEnabled: config.networkEnabled ?? true,
            filesystemRoot: config.filesystemRoot ?? '/tmp/sandbox',
        };
    }
    async spawn(id) {
        if (this.activeProcesses.size >= this.config.maxProcesses) {
            throw new Error('Maximum number of processes reached');
        }
        this.activeProcesses.add(id);
        logger.info({ id }, 'Sandbox process spawned');
    }
    async terminate(id) {
        this.activeProcesses.delete(id);
        logger.info({ id }, 'Sandbox process terminated');
    }
    async cleanup() {
        for (const id of this.activeProcesses) {
            await this.terminate(id);
        }
        logger.info('Sandbox cleaned up');
    }
    getActiveCount() {
        return this.activeProcesses.size;
    }
    getConfig() {
        return { ...this.config };
    }
}
export const shellSandbox = new ShellSandbox();
//# sourceMappingURL=sandbox.js.map