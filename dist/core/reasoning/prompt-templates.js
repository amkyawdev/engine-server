// Prompt Templates for Reasoning
const templates = {
    CHAIN_OF_THOUGHT: {
        name: 'chain-of-thought',
        template: `Think through this step by step:

Problem: {problem}
Context: {context}

Think aloud about the problem, breaking it down into smaller parts.
Consider alternatives and their implications.
Conclude with your reasoning and answer.`,
        variables: ['problem', 'context'],
    },
    TREE_OF_THOUGHT: {
        name: 'tree-of-thought',
        template: `Explore multiple approaches to solve this problem:

Problem: {problem}
Approaches to consider: {approaches}

For each approach:
1. Explore the solution space
2. Evaluate pros and cons
3. Consider branching paths
4. Select the best option

Provide your final solution and reasoning.`,
        variables: ['problem', 'approaches'],
    },
    STATE_MACHINE: {
        name: 'state-machine',
        template: `Analyze and solve using structured states:

Current State: {currentState}
Input: {input}
Goal: {goal}

{history}

Next steps:
1. Analyze current state
2. Determine appropriate action
3. Execute and observe
4. Reason about results
5. Update state or finish`,
        variables: ['currentState', 'input', 'goal', 'history'],
    },
    REFLECTION: {
        name: 'reflection',
        template: `Reflect on the following reasoning:

Initial Thoughts: {initialThoughts}
Actions Taken: {actions}
Results Observed: {results}

What went well?
{whatWentWell}

What could be improved?
{improvements}

Final conclusions: {conclusions}`,
        variables: ['initialThoughts', 'actions', 'results', 'whatWentWell', 'improvements', 'conclusions'],
    },
    SYSTEM_PROMPT: {
        name: 'system',
        template: `You are an AI agent with access to various tools.

Guidelines:
- Think step by step before taking action
- Use tools efficiently and appropriately
- If a tool fails, try alternative approaches
- Provide clear and concise responses
- Ask clarifying questions when needed

Available context:
{context}`,
        variables: ['context'],
    },
};
export const PROMPT_TEMPLATES = Object.fromEntries(Object.values(templates).map(t => [t.name, t]));
export class PromptTemplateEngine {
    templates;
    constructor() {
        this.templates = new Map();
        for (const template of Object.values(PROMPT_TEMPLATES)) {
            this.templates.set(template.name, template);
        }
    }
    render(name, variables) {
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template '${name}' not found`);
        }
        let rendered = template.template;
        for (const [key, value] of Object.entries(variables)) {
            if (!template.variables.includes(key)) {
                console.warn(`Variable '${key}' not defined in template '${name}'`);
            }
            rendered = rendered.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        }
        return rendered;
    }
    addTemplate(name, template) {
        const variables = this.extractVariables(template);
        this.templates.set(name, { name, template, variables });
    }
    extractVariables(template) {
        const matches = template.matchAll(/\{(\w+)\}/g);
        return [...matches].map((m) => m[1]);
    }
    listTemplates() {
        return [...this.templates.keys()];
    }
}
export const promptEngine = new PromptTemplateEngine();
//# sourceMappingURL=prompt-templates.js.map