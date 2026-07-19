export interface ExecuteRequest {
    input: string;
    agentId?: string;
    config?: Partial<ExecuteConfig>;
    context?: Record<string, unknown>;
}
export interface ExecuteConfig {
    maxSteps: number;
    timeout: number;
    streaming: boolean;
    tools: string[];
}
export interface ExecuteResponse {
    executionId: string;
    status: 'pending' | 'running';
}
export interface StatusResponse {
    executionId: string;
    status: ExecutionStatus;
    steps: StepInfo[];
    progress: ProgressInfo;
}
export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export interface StepInfo {
    number: number;
    type: string;
    content: string;
    tool?: string;
    timestamp: string;
}
export interface ProgressInfo {
    currentStep: number;
    totalSteps: number;
    percentage: number;
}
export interface HistoryQuery {
    sessionId?: string;
    agentId?: string;
    limit?: number;
    offset?: number;
    from?: string;
    to?: string;
}
export interface HistoryResponse {
    executions: ExecutionSummary[];
    total: number;
    limit: number;
    offset: number;
}
export interface ExecutionSummary {
    id: string;
    agentId: string;
    input: string;
    status: ExecutionStatus;
    createdAt: string;
    completedAt?: string;
}
export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    version: string;
    uptime: number;
    checks: ComponentHealth[];
}
export interface ComponentHealth {
    name: string;
    status: 'up' | 'down' | 'degraded';
    latency?: number;
    error?: string;
}
//# sourceMappingURL=api.d.ts.map