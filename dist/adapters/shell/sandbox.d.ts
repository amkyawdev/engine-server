export interface SandboxConfig {
    maxMemory?: number;
    maxCpu?: number;
    maxProcesses?: number;
    timeout?: number;
    networkEnabled?: boolean;
    filesystemRoot?: string;
}
export declare class ShellSandbox {
    private config;
    private activeProcesses;
    constructor(config?: SandboxConfig);
    spawn(id: string): Promise<void>;
    terminate(id: string): Promise<void>;
    cleanup(): Promise<void>;
    getActiveCount(): number;
    getConfig(): Readonly<SandboxConfig>;
}
export declare const shellSandbox: ShellSandbox;
//# sourceMappingURL=sandbox.d.ts.map