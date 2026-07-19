export const datetimeTool = {
    id: 'datetime',
    name: 'datetime',
    description: 'Date and time operations',
    version: '1.0.0',
    category: 'datetime',
    parameters: [
        {
            name: 'operation',
            type: 'string',
            required: true,
            description: 'Operation to perform',
            validation: {
                enum: ['now', 'format', 'parse', 'add', 'diff'],
            },
        },
    ],
    returns: {
        type: 'string',
        description: 'Result of the datetime operation',
    },
    permissions: [
        { type: 'datetime', level: 'all' },
    ],
    execute: async (input, _context) => {
        const startTime = Date.now();
        const { operation, value, format, amount, unit, from, to } = input;
        try {
            let result;
            switch (operation) {
                case 'now':
                    result = new Date().toISOString();
                    break;
                case 'format':
                    if (!value)
                        throw new Error('value is required for format operation');
                    const date = new Date(value);
                    result = format
                        ? date.toLocaleString(format)
                        : date.toISOString();
                    break;
                case 'parse':
                    if (!value)
                        throw new Error('value is required for parse operation');
                    result = new Date(value).getTime();
                    break;
                case 'add':
                    if (!value)
                        throw new Error('value is required for add operation');
                    const baseDate = new Date(value);
                    const ms = (amount ?? 1) * (unit === 'seconds' ? 1000 :
                        unit === 'minutes' ? 60000 :
                            unit === 'hours' ? 3600000 :
                                unit === 'days' ? 86400000 :
                                    unit === 'weeks' ? 604800000 :
                                        unit === 'months' ? 2592000000 :
                                            unit === 'years' ? 31536000000 : 1);
                    result = new Date(baseDate.getTime() + ms).toISOString();
                    break;
                case 'diff':
                    if (!from || !to)
                        throw new Error('from and to are required for diff operation');
                    const diff = Math.abs(new Date(to).getTime() - new Date(from).getTime());
                    result = diff;
                    break;
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }
            return {
                success: true,
                output: result,
                executionTime: Date.now() - startTime,
            };
        }
        catch (error) {
            return {
                success: false,
                error: `DateTime error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                executionTime: Date.now() - startTime,
            };
        }
    },
};
//# sourceMappingURL=datetime.js.map