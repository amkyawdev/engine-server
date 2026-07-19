export interface CommandDefinition {
    name: string;
    description: string;
    usage: string;
    execute: (args: string[]) => Promise<CommandResult>;
}
export interface CommandResult {
    success: boolean;
    output?: string;
    error?: string;
}
export declare class CommandHandler {
    private commands;
    constructor();
    register(definition: CommandDefinition): void;
    unregister(name: string): boolean;
    execute(input: string): Promise<CommandResult>;
    list(): CommandDefinition[];
    get(name: string): CommandDefinition | undefined;
}
export declare const commandHandler: CommandHandler;
//# sourceMappingURL=commands.d.ts.map