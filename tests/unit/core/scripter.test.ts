// Scripter Tests
import { scriptParser } from '../../src/core/scripter/parser.js';
import { scriptValidator } from '../../src/core/scripter/validator.js';

describe('ScriptParser', () => {
  describe('parse', () => {
    it('should parse a simple script with thoughts', () => {
      const script = `THOUGHT: First thought
THOUGHT: Second thought`;

      const result = scriptParser.parse(script);

      expect(result.steps).toHaveLength(2);
      expect(result.steps[0].type).toBe('thought');
      expect(result.steps[0].content).toBe('First thought');
    });

    it('should parse script with actions', () => {
      const script = `THOUGHT: I need to calculate
ACTION: calculator expression="2+2"
OBSERVATION: Result is 4`;

      const result = scriptParser.parse(script);

      expect(result.steps).toHaveLength(3);
      expect(result.steps[1].type).toBe('action');
      expect(result.steps[1].content).toBe('calculator expression="2+2"');
    });
  });

  describe('validate', () => {
    it('should validate a valid script', () => {
      const script = `THOUGHT: A thought
ACTION: An action`;

      const result = scriptParser.validate(script);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty script', () => {
      const result = scriptParser.validate('');

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});

describe('ScriptValidator', () => {
  describe('validateScript', () => {
    it('should validate script with all step types', () => {
      const script = `THOUGHT: Some thought
ACTION: Some action
OBSERVATION: Some observation
RESULT: Some result`;

      const result = scriptValidator.validateScript(script);

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBe(0);
    });

    it('should warn about missing RESULT', () => {
      const script = `THOUGHT: Some thought
ACTION: Some action`;

      const result = scriptValidator.validateScript(script);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContain(
        expect.stringContaining('RESULT')
      );
    });
  });
});
