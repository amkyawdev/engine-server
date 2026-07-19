// Script Validator
import { z } from 'zod';
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('scripter:validator');

const scriptSchema = z.object({
  content: z.string().min(1, 'Script content cannot be empty'),
  metadata: z
    .object({
      name: z.string().optional(),
      version: z.string().optional(),
      author: z.string().optional(),
    })
    .optional(),
});

const stepSchema = z.object({
  type: z.enum(['thought', 'action', 'observation', 'result']),
  content: z.string().min(1),
});

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class ScriptValidator {
  validateScript(content: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if empty
    if (!content || content.trim().length === 0) {
      errors.push('Script content is empty');
      return { valid: false, errors, warnings };
    }

    // Check for required patterns
    const hasThought = /^THOUGHT:/gim.test(content);
    const hasAction = /^ACTION:/gim.test(content);
    const hasObservation = /^OBSERVATION:/gim.test(content);
    const hasResult = /^RESULT:/gim.test(content);

    if (!hasThought && !hasAction) {
      errors.push('Script must contain at least one THOUGHT or ACTION step');
    }

    // Warnings for best practices
    if (!hasResult) {
      warnings.push('Script does not have a RESULT step');
    }

    if (!hasObservation) {
      warnings.push('Script does not have an OBSERVATION step');
    }

    // Check for very long steps
    const lines = content.split('\n');
    const veryLongLines = lines.filter((l) => l.length > 1000);
    if (veryLongLines.length > 0) {
      warnings.push(`${veryLongLines.length} line(s) are very long (>1000 characters)`);
    }

    logger.debug({ errors: errors.length, warnings: warnings.length }, 'Script validation complete');

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  validateStep(step: unknown): ValidationResult {
    const errors: string[] = [];

    const result = stepSchema.safeParse(step);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(issue.message);
      }
      return { valid: false, errors, warnings: [] };
    }

    return { valid: true, errors: [], warnings: [] };
  }

  validateMetadata(metadata: unknown): ValidationResult {
    const errors: string[] = [];

    const result = scriptSchema.shape.metadata.safeParse(metadata);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(issue.message);
      }
      return { valid: false, errors, warnings: [] };
    }

    return { valid: true, errors: [], warnings: [] };
  }
}

export const scriptValidator = new ScriptValidator();
