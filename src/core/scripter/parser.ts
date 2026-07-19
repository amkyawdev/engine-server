// Script Parser
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('scripter:parser');

export interface ParsedStep {
  type: 'thought' | 'action' | 'observation' | 'result';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface ParsedScript {
  steps: ParsedStep[];
  variables: Record<string, unknown>;
  metadata: {
    name?: string;
    version?: string;
    author?: string;
  };
}

const THOUGHT_PATTERN = /^THOUGHT:\s*(.+)$/im;
const ACTION_PATTERN = /^ACTION:\s*(.+)$/im;
const OBSERVATION_PATTERN = /^OBSERVATION:\s*(.+)$/im;
const RESULT_PATTERN = /^RESULT:\s*(.+)$/im;
const METADATA_PATTERN = /^#\s*(\w+):\s*(.+)$/gm;

export class ScriptParser {
  parse(script: string): ParsedScript {
    const lines = script.split('\n');
    const steps: ParsedStep[] = [];
    const variables: Record<string, unknown> = {};
    const metadata: Record<string, string> = {};

    let currentStep: ParsedStep | null = null;

    for (const line of lines) {
      // Check for metadata
      const metaMatch = line.match(/^#\s*(\w+):\s*(.+)$/);
      if (metaMatch) {
        metadata[metaMatch[1].toLowerCase()] = metaMatch[2];
        continue;
      }

      // Check for step types
      const thoughtMatch = line.match(THOUGHT_PATTERN);
      const actionMatch = line.match(ACTION_PATTERN);
      const observationMatch = line.match(OBSERVATION_PATTERN);
      const resultMatch = line.match(RESULT_PATTERN);

      if (thoughtMatch) {
        if (currentStep) steps.push(currentStep);
        currentStep = { type: 'thought', content: thoughtMatch[1] };
      } else if (actionMatch) {
        if (currentStep) steps.push(currentStep);
        currentStep = { type: 'action', content: actionMatch[1] };
      } else if (observationMatch) {
        if (currentStep) steps.push(currentStep);
        currentStep = { type: 'observation', content: observationMatch[1] };
      } else if (resultMatch) {
        if (currentStep) steps.push(currentStep);
        currentStep = { type: 'result', content: resultMatch[1] };
      } else if (currentStep) {
        // Continuation of previous step
        currentStep.content += '\n' + line;
      }
    }

    if (currentStep) {
      steps.push(currentStep);
    }

    logger.debug({ stepCount: steps.length }, 'Parsed script');

    return {
      steps,
      variables,
      metadata: {
        name: metadata.name,
        version: metadata.version,
        author: metadata.author,
      },
    };
  }

  validate(script: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!script || script.trim().length === 0) {
      errors.push('Script cannot be empty');
    }

    const hasSteps = /^(THOUGHT|ACTION|OBSERVATION|RESULT):/im.test(script);
    if (!hasSteps) {
      errors.push('Script must contain at least one step (THOUGHT, ACTION, OBSERVATION, or RESULT)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const scriptParser = new ScriptParser();
