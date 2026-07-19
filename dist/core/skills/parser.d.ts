import type { Skill } from '../../shared/types/skill.js';
export interface ParseResult {
    success: boolean;
    skill?: Skill;
    errors: string[];
}
export declare class SkillParser {
    parse(content: string): ParseResult;
    validate(content: string): {
        valid: boolean;
        errors: string[];
    };
}
export declare const skillParser: SkillParser;
//# sourceMappingURL=parser.d.ts.map