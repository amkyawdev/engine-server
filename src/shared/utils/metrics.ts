import { createLogger } from './logger.js';

const logger = createLogger('metrics');

interface MetricData {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp: number;
}

class MetricsCollector {
  private metrics: Map<string, MetricData[]> = new Map();
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();

  increment(name: string, value = 1, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
    this.record(name, current + value, labels);
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    this.gauges.set(key, value);
    this.record(name, value, labels);
  }

  timing(name: string, duration: number, labels?: Record<string, string>): void {
    this.record(name, duration, { ...labels, type: 'timing' });
  }

  private record(name: string, value: number, labels?: Record<string, string>): void {
    const data: MetricData = {
      name,
      value,
      labels,
      timestamp: Date.now(),
    };

    const existing = this.metrics.get(name) || [];
    existing.push(data);
    // Keep last 1000 metrics per name
    if (existing.length > 1000) {
      existing.shift();
    }
    this.metrics.set(name, existing);
  }

  private getKey(name: string, labels?: Record<string, string>): string {
    if (!labels) return name;
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}:${v}`)
      .join(',');
    return `${name}:${labelStr}`;
  }

  getCounter(name: string, labels?: Record<string, string>): number {
    return this.counters.get(this.getKey(name, labels)) || 0;
  }

  getGauge(name: string, labels?: Record<string, string>): number {
    return this.gauges.get(this.getKey(name, labels)) || 0;
  }

  getMetrics(name?: string): MetricData[] {
    if (name) {
      return this.metrics.get(name) || [];
    }
    const all: MetricData[] = [];
    for (const metrics of this.metrics.values()) {
      all.push(...metrics);
    }
    return all;
  }

  reset(): void {
    this.metrics.clear();
    this.counters.clear();
    this.gauges.clear();
  }
}

export const metrics = new MetricsCollector();

// Helper functions
export const recordExecutionTime = (executionId: string, duration: number) => {
  metrics.timing('agent.execution.duration', duration, { executionId });
  metrics.increment('agent.execution.count');
};

export const recordToolExecution = (toolName: string, duration: number, success: boolean) => {
  metrics.timing('tool.execution.duration', duration, { tool: toolName });
  metrics.increment(success ? 'tool.execution.success' : 'tool.execution.failure', 1, { tool: toolName });
};

export const recordApiRequest = (method: string, path: string, statusCode: number, duration: number) => {
  metrics.timing('api.request.duration', duration, { method, path, status: String(statusCode) });
  metrics.increment('api.request.count', 1, { method, path, status: String(statusCode) });
};
