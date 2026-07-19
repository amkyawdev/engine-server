export interface DockerConfig {
    image: string;
    command?: string[];
    volumes?: Record<string, string>;
    env?: Record<string, string>;
    memory?: string;
    cpu?: string;
    network?: 'bridge' | 'host' | 'none';
}
export interface DockerExecutionResult {
    containerId: string;
    success: boolean;
    output?: string;
    error?: string;
    exitCode?: number;
    duration: number;
}
export declare class DockerExecutor {
    private defaultImage;
    execute(command: string, config?: Partial<DockerConfig>): Promise<DockerExecutionResult>;
    listContainers(): Promise<string[]>;
    removeContainer(containerId: string): Promise<boolean>;
}
export declare const dockerExecutor: DockerExecutor;
//# sourceMappingURL=docker-executor.d.ts.map