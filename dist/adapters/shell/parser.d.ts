export interface ParsedOutput {
    stdout: string;
    stderr: string;
    exitCode: number;
    duration: number;
    lines: string[];
}
export declare class ShellParser {
    parse(output: string): ParsedOutput;
    parseWithExitCode(output: string, exitCode: number): ParsedOutput;
    extractErrors(output: string): string[];
    formatForDisplay(output: string, options?: {
        maxLines?: number;
        maxWidth?: number;
    }): string;
}
export declare const shellParser: ShellParser;
//# sourceMappingURL=parser.d.ts.map