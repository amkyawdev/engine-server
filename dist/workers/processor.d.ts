import { type Job } from './queue.js';
export interface ProcessorOptions {
    concurrency?: number;
    pollInterval?: number;
}
export type JobHandler<T = unknown> = (job: Job<T>) => Promise<void>;
export declare class JobProcessor {
    private handlers;
    private running;
    private processor?;
    private concurrency;
    private pollInterval;
    constructor(options?: ProcessorOptions);
    register(type: string, handler: JobHandler): void;
    start(): void;
    stop(): void;
    private processJobs;
    private executeJob;
}
export declare const jobProcessor: JobProcessor;
//# sourceMappingURL=processor.d.ts.map