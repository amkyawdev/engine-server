export interface Job<T = unknown> {
    id: string;
    type: string;
    data: T;
    priority?: number;
    attempts: number;
    maxAttempts?: number;
    createdAt: Date;
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
}
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';
export declare class JobQueue<T = unknown> {
    private queue;
    private processing;
    enqueue(job: Omit<Job<T>, 'id' | 'attempts' | 'createdAt'>): string;
    dequeue(): Job<T> | undefined;
    complete(jobId: string): void;
    fail(jobId: string, error: string): void;
    size(): number;
    getProcessingCount(): number;
    clear(): void;
}
export declare const jobQueue: JobQueue<unknown>;
//# sourceMappingURL=queue.d.ts.map