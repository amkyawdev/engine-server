export const calculatorTool = {
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
    execute: async (input, _context) => {
        const startTime = Date.now();
        const { expression } = input;
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
        }
        catch (error) {
            return {
                success: false,
                error: `Calculation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                executionTime: Date.now() - startTime,
            };
        }
    },
};
//# sourceMappingURL=calculator.js.map