import { type ParsedStep } from './parser.js';
import { type ExecutionContext } from './context.js';
export interface ExecutionResult {
    success: boolean;
    output?: string;
    steps: number;
    duration: number;
    error?: string;
}
export interface ExecutorOptions {
    maxSteps?: number;
    timeout?: number;
    onStep?: (step: ParsedStep, stepNumber: number) => Promise<void>;
}
export declare class ScriptExecutor {
    private options;
    constructor(options?: ExecutorOptions);
    execute(script: string, context: ExecutionContext): Promise<ExecutionResult>;
}
export declare const scriptExecutor: ScriptExecutor;
//# sourceMappingURL=executor.d.ts.map