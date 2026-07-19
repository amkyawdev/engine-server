export type OutputFormat = 'text' | 'json' | 'table';
export interface OutputOptions {
    format?: OutputFormat;
    color?: boolean;
    verbose?: boolean;
}
export declare class OutputFormatter {
    format(data: unknown, options?: OutputOptions): string;
    private formatJson;
    private formatText;
    private formatTable;
    success(message: string): string;
    error(message: string): string;
    warning(message: string): string;
    info(message: string): string;
}
export declare const outputFormatter: OutputFormatter;
//# sourceMappingURL=output.d.ts.map