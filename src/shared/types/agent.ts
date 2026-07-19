// Agent Types
export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  maxSteps: number;
  timeout: number;
  reasoning: ReasoningConfig;
  tools: ToolConfig;
  memory: MemoryConfig;
}

export interface ReasoningConfig {
  type: 'chain-of-thought' | 'tree-of-thought' | 'state-machine';
  maxDepth: number;
  temperature: number;
}

export interface ToolConfig {
  enabled: string[];
  disabled: string[];
  timeout: number;
  maxConcurrent: number;
}

export interface MemoryConfig {
  sessionTtl: number;
  maxHistory: number;
  vectorEnabled: boolean;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  input: string;
  output?: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  steps: AgentStep[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface AgentStep {
  id: string;
  executionId: string;
  stepNumber: number;
  type: 'thought' | 'action' | 'observation' | 'result';
  content: string;
  tool?: string;
  result?: unknown;
  timestamp: Date;
}

// Streaming Events
export interface StreamEvent {
  type: 'thought' | 'action' | 'output' | 'error' | 'done';
  data: unknown;
  timestamp: number;
}
