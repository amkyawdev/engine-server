import type { Skill, SkillTrigger } from '../../shared/types/skill.js';
export interface MatchResult {
    skill: Skill;
    trigger: SkillTrigger;
    score: number;
    matchedPattern?: string;
}
export declare class SkillMatcher {
    match(input: string, skills: Skill[]): MatchResult[];
    matchBest(input: string, skills: Skill[]): MatchResult | null;
    private matchTrigger;
    private matchKeyword;
    private matchRegex;
    private matchIntent;
    private matchEvent;
}
export declare const skillMatcher: SkillMatcher;
//# sourceMappingURL=matcher.d.ts.map