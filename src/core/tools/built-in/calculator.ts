// Calculator Tool
import type { Tool, ToolContext, ToolResult } from '../../../shared/types/tool.js';

interface CalculatorInput {
  expression: string;
}

export const calculatorTool: Tool = {
  id: 'calculator',
  name: 'calculator',
  description: 'Evaluate mathematical expressions',
  version: '1.0.0',
  category: 'calculator',
  parameters: [
    {
      name: 'expression',
      type: 'string',
      required: true,
      description: 'Mathematical expression to evaluate',
    },
  ],
  returns: {
    type: 'number',
    description: 'Result of the calculation',
  },
  permissions: [
    { type: 'calculator', level: 'all' },
  ],
  execute: async (input: unknown, _context: ToolContext): Promise<ToolResult> => {
    const startTime = Date.now();
    const { expression } = input as CalculatorInput;

    try {
      // Safe evaluation using Function constructor
      // In production, use a proper math parser like mathjs
      const sanitized = expression.replace(/[^0-9+\-*/().%^sqrtabsinlog,]/gi, '');
      const result = new Function(`return ${sanitized}`)();

      return {
        success: true,
        output: typeof result === 'number' && !isNaN(result) ? result : parseFloat(result),
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: `Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime,
      };
    }
  },
};
