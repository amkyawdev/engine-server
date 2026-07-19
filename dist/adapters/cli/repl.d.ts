export interface ReplOptions {
    prompt?: string;
    welcome?: string;
    onExit?: () => void;
}
export declare class Repl {
    private prompt;
    private welcome;
    private running;
    private history;
    private historyIndex;
    constructor(options?: ReplOptions);
    start(): Promise<void>;
    stop(): void;
    private readLine;
    private processInput;
    private addToHistory;
    getHistory(): string[];
}
export declare const repl: Repl;
//# sourceMappingURL=repl.d.ts.map