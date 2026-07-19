// Tools Tests
import { toolRegistry } from '../../src/core/tools/registry.js';
import { calculatorTool } from '../../src/core/tools/built-in/calculator.js';
import { datetimeTool } from '../../src/core/tools/built-in/datetime.js';

describe('ToolRegistry', () => {
  beforeEach(() => {
    toolRegistry.clear();
  });

  describe('register', () => {
    it('should register a tool', () => {
      toolRegistry.register(calculatorTool);

      const tool = toolRegistry.get(calculatorTool.id);

      expect(tool).toBeDefined();
      expect(tool!.id).toBe(calculatorTool.id);
    });
  });

  describe('execute', () => {
    beforeEach(() => {
      toolRegistry.register(calculatorTool);
    });

    it('should execute a tool successfully', async () => {
      const result = await toolRegistry.execute(
        'calculator',
        { expression: '2 + 2' },
        { sessionId: 'test', timeout: 5000 }
      );

      expect(result.success).toBe(true);
    });

    it('should return error for non-existent tool', async () => {
      const result = await toolRegistry.execute(
        'non-existent',
        {},
        { sessionId: 'test', timeout: 5000 }
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });
  });
});

describe('CalculatorTool', () => {
  it('should evaluate basic arithmetic', async () => {
    const result = await calculatorTool.execute(
      { expression: '2 + 2' },
      { sessionId: 'test', timeout: 5000 }
    );

    expect(result.success).toBe(true);
  });
});

describe('DateTimeTool', () => {
  it('should return current time', async () => {
    const result = await datetimeTool.execute(
      { operation: 'now' },
      { sessionId: 'test', timeout: 5000 }
    );

    expect(result.success).toBe(true);
  });

  it('should format a date', async () => {
    const result = await datetimeTool.execute(
      { operation: 'format', value: '2024-01-01', format: 'en-US' },
      { sessionId: 'test', timeout: 5000 }
    );

    expect(result.success).toBe(true);
  });
});
