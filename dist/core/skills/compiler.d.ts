import type { Skill, SkillContext, SkillResult } from '../../shared/types/skill.js';
export interface CompiledSkill {
    skill: Skill;
    compiled: CompiledAction[];
}
export interface CompiledAction {
    id: string;
    name: string;
    execute: (context: SkillContext) => Promise<SkillResult>;
}
export declare class SkillCompiler {
    compile(skill: Skill): CompiledSkill;
    private wrapAction;
    execute(compiled: CompiledSkill, actionName: string, context: SkillContext): Promise<SkillResult>;
}
export declare const skillCompiler: SkillCompiler;
//# sourceMappingURL=compiler.d.ts.map