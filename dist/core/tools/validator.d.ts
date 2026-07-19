export interface ValidationResult {
    valid: boolean;
    errors: string[];
}
export declare class ToolValidator {
    validateParameters(params: unknown, schema: Array<{
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
    }>): ValidationResult;
    validateToolId(id: string): ValidationResult;
    private validateType;
}
export declare const toolValidator: ToolValidator;
//# sourceMappingURL=validator.d.ts.map