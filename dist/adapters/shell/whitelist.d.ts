export interface WhitelistRule {
    command: string;
    args?: string[];
    description?: string;
}
export declare class ShellWhitelist {
    private rules;
    private blockedPatterns;
    constructor(rules?: WhitelistRule[]);
    add(command: string): void;
    remove(command: string): boolean;
    isAllowed(command: string): boolean;
    list(): string[];
}
export declare const shellWhitelist: ShellWhitelist;
//# sourceMappingURL=whitelist.d.ts.map