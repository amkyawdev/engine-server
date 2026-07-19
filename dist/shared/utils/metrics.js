import { createLogger } from './logger.js';
const logger = createLogger('metrics');
class MetricsCollector {
    metrics = new Map();
    counters = new Map();
    gauges = new Map();
    increment(name, value = 1, labels) {
        const key = this.getKey(name, labels);
        const current = this.counters.get(key) || 0;
        this.counters.set(key, current + value);
        this.record(name, current + value, labels);
    }
    gauge(name, value, labels) {
        const key = this.getKey(name, labels);
        this.gauges.set(key, value);
        this.record(name, value, labels);
    }
    timing(name, duration, labels) {
        this.record(name, duration, { ...labels, type: 'timing' });
    }
    record(name, value, labels) {
        const data = {
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
    getKey(name, labels) {
        if (!labels)
            return name;
        const labelStr = Object.entries(labels)
            .map(([k, v]) => `${k}:${v}`)
            .join(',');
        return `${name}:${labelStr}`;
    }
    getCounter(name, labels) {
        return this.counters.get(this.getKey(name, labels)) || 0;
    }
    getGauge(name, labels) {
        return this.gauges.get(this.getKey(name, labels)) || 0;
    }
    getMetrics(name) {
        if (name) {
            return this.metrics.get(name) || [];
        }
        const all = [];
        for (const metrics of this.metrics.values()) {
            all.push(...metrics);
        }
        return all;
    }
    reset() {
        this.metrics.clear();
        this.counters.clear();
        this.gauges.clear();
    }
}
export const metrics = new MetricsCollector();
// Helper functions
export const recordExecutionTime = (executionId, duration) => {
    metrics.timing('agent.execution.duration', duration, { executionId });
    metrics.increment('agent.execution.count');
};
export const recordToolExecution = (toolName, duration, success) => {
    metrics.timing('tool.execution.duration', duration, { tool: toolName });
    metrics.increment(success ? 'tool.execution.success' : 'tool.execution.failure', 1, { tool: toolName });
};
export const recordApiRequest = (method, path, statusCode, duration) => {
    metrics.timing('api.request.duration', duration, { method, path, status: String(statusCode) });
    metrics.increment('api.request.count', 1, { method, path, status: String(statusCode) });
};
//# sourceMappingURL=metrics.js.map