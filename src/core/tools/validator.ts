// Tool Validator
import { z } from 'zod';
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('tools:validator');

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class ToolValidator {
  validateParameters(
    params: unknown,
    schema: Array<{
      name: string;
      type: string;
      required: boolean;
      default?: unknown;
      validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        enum?: unknown[];
      };
    }>
  ): ValidationResult {
    const errors: string[] = [];
    const paramObj = params as Record<string, unknown>;

    for (const param of schema) {
      const value = paramObj[param.name];

      // Check required
      if (param.required && (value === undefined || value === null)) {
        errors.push(`Parameter '${param.name}' is required`);
        continue;
      }

      // Skip validation for undefined optional params
      if (value === undefined) continue;

      // Type validation
      const typeValid = this.validateType(value, param.type);
      if (!typeValid) {
        errors.push(`Parameter '${param.name}' must be of type ${param.type}`);
        continue;
      }

      // Custom validation
      if (param.validation) {
        if (param.validation.enum && !param.validation.enum.includes(value)) {
          errors.push(
            `Parameter '${param.name}' must be one of: ${param.validation.enum.join(', ')}`
          );
        }

        if (param.validation.min !== undefined && typeof value === 'number') {
          if (value < param.validation.min) {
            errors.push(`Parameter '${param.name}' must be >= ${param.validation.min}`);
          }
        }

        if (param.validation.max !== undefined && typeof value === 'number') {
          if (value > param.validation.max) {
            errors.push(`Parameter '${param.name}' must be <= ${param.validation.max}`);
          }
        }

        if (param.validation.pattern && typeof value === 'string') {
          const regex = new RegExp(param.validation.pattern);
          if (!regex.test(value)) {
            errors.push(`Parameter '${param.name}' does not match pattern`);
          }
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  validateToolId(id: string): ValidationResult {
    const errors: string[] = [];

    if (!id || typeof id !== 'string') {
      errors.push('Tool ID must be a non-empty string');
    }

    if (!/^[a-z0-9-]+$/.test(id)) {
      errors.push('Tool ID must contain only lowercase letters, numbers, and hyphens');
    }

    return { valid: errors.length === 0, errors };
  }

  private validateType(value: unknown, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'array':
        return Array.isArray(value);
      default:
        return true;
    }
  }
}

export const toolValidator = new ToolValidator();
