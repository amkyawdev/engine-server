// Skill Types
export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  author?: string;
  tags: string[];
  triggers: SkillTrigger[];
  actions: SkillAction[];
  metadata?: Record<string, unknown>;
}

export interface SkillTrigger {
  type: 'keyword' | 'pattern' | 'intent' | 'event';
  pattern: string | string[];
  priority?: number;
}

export interface SkillAction {
  id: string;
  name: string;
  description: string;
  parameters?: SkillParameter[];
  execute: (context: SkillContext) => Promise<SkillResult>;
}

export interface SkillParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  default?: unknown;
  description?: string;
}

export interface SkillContext {
  input: string;
  variables: Record<string, unknown>;
  sessionId: string;
  userId?: string;
  metadata: Record<string, unknown>;
}

export interface SkillResult {
  success: boolean;
  output?: string;
  data?: unknown;
  error?: string;
  nextActions?: string[];
}
