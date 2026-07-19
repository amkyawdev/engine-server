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
export declare class ScriptParser {
    parse(script: string): ParsedScript;
    validate(script: string): {
        valid: boolean;
        errors: string[];
    };
}
export declare const scriptParser: ScriptParser;
//# sourceMappingURL=parser.d.ts.map