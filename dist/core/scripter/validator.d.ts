export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export declare class ScriptValidator {
    validateScript(content: string): ValidationResult;
    validateStep(step: unknown): ValidationResult;
    validateMetadata(metadata: unknown): ValidationResult;
}
export declare const scriptValidator: ScriptValidator;
//# sourceMappingURL=validator.d.ts.map