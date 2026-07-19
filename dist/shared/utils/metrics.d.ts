interface MetricData {
    name: string;
    value: number;
    labels?: Record<string, string>;
    timestamp: number;
}
declare class MetricsCollector {
    private metrics;
    private counters;
    private gauges;
    increment(name: string, value?: number, labels?: Record<string, string>): void;
    gauge(name: string, value: number, labels?: Record<string, string>): void;
    timing(name: string, duration: number, labels?: Record<string, string>): void;
    private record;
    private getKey;
    getCounter(name: string, labels?: Record<string, string>): number;
    getGauge(name: string, labels?: Record<string, string>): number;
    getMetrics(name?: string): MetricData[];
    reset(): void;
}
export declare const metrics: MetricsCollector;
export declare const recordExecutionTime: (executionId: string, duration: number) => void;
export declare const recordToolExecution: (toolName: string, duration: number, success: boolean) => void;
export declare const recordApiRequest: (method: string, path: string, statusCode: number, duration: number) => void;
export {};
//# sourceMappingURL=metrics.d.ts.map