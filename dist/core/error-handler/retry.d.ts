export interface RetryOptions {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: Error, attempt: number) => boolean;
}
export declare class RetryHandler {
    execute<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
    private sleep;
}
export declare const retryHandler: RetryHandler;
//# sourceMappingURL=retry.d.ts.map