export interface PromptTemplate {
    name: string;
    template: string;
    variables: readonly string[];
}
export declare const PROMPT_TEMPLATES: Record<string, PromptTemplate>;
export declare class PromptTemplateEngine {
    private templates;
    constructor();
    render(name: string, variables: Record<string, string>): string;
    addTemplate(name: string, template: string): void;
    private extractVariables;
    listTemplates(): string[];
}
export declare const promptEngine: PromptTemplateEngine;
//# sourceMappingURL=prompt-templates.d.ts.map