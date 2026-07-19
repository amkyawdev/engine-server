// Skill Compiler
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('skills:compiler');
export class SkillCompiler {
    compile(skill) {
        logger.debug({ skillId: skill.id }, 'Compiling skill');
        const compiled = skill.actions.map((action) => ({
            id: action.id,
            name: action.name,
            execute: this.wrapAction(action, skill),
        }));
        return { skill, compiled };
    }
    wrapAction(action, skill) {
        return async (context) => {
            try {
                logger.debug({ skillId: skill.id, action: action.name }, 'Executing action');
                const result = await action.execute(context);
                return result;
            }
            catch (error) {
                logger.error({ skillId: skill.id, action: action.name, error }, 'Action execution failed');
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        };
    }
    async execute(compiled, actionName, context) {
        const action = compiled.compiled.find((a) => a.name === actionName);
        if (!action) {
            return {
                success: false,
                error: `Action '${actionName}' not found`,
            };
        }
        return action.execute(context);
    }
}
export const skillCompiler = new SkillCompiler();
//# sourceMappingURL=compiler.js.map