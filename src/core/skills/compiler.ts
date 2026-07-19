// Skill Compiler
import { createLogger } from '../../shared/utils/logger.js';
import type { Skill, SkillContext, SkillResult } from '../../shared/types/skill.js';

const logger = createLogger('skills:compiler');

export interface CompiledSkill {
  skill: Skill;
  compiled: CompiledAction[];
}

export interface CompiledAction {
  id: string;
  name: string;
  execute: (context: SkillContext) => Promise<SkillResult>;
}

export class SkillCompiler {
  compile(skill: Skill): CompiledSkill {
    logger.debug({ skillId: skill.id }, 'Compiling skill');

    const compiled: CompiledAction[] = skill.actions.map((action) => ({
      id: action.id,
      name: action.name,
      execute: this.wrapAction(action, skill),
    }));

    return { skill, compiled };
  }

  private wrapAction(
    action: Skill['actions'][0],
    skill: Skill
  ): (context: SkillContext) => Promise<SkillResult> {
    return async (context: SkillContext) => {
      try {
        logger.debug({ skillId: skill.id, action: action.name }, 'Executing action');
        const result = await action.execute(context);
        return result;
      } catch (error) {
        logger.error(
          { skillId: skill.id, action: action.name, error },
          'Action execution failed'
        );
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    };
  }

  async execute(
    compiled: CompiledSkill,
    actionName: string,
    context: SkillContext
  ): Promise<SkillResult> {
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
