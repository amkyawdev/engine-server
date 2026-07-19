export interface ShellExecutionResult {
    success: boolean;
    output?: string;
    error?: string;
    exitCode?: number;
    duration: number;
}
export interface ShellOptions {
    timeout?: number;
    cwd?: string;
    env?: Record<string, string>;
}
export declare class ShellExecutor {
    execute(command: string, options?: ShellOptions): Promise<ShellExecutionResult>;
    executeBatch(commands: string[]): Promise<ShellExecutionResult[]>;
}
export declare const shellExecutor: ShellExecutor;
//# sourceMappingURL=executor.d.ts.map