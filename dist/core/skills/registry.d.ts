import type { Skill } from '../../shared/types/skill.js';
export declare class SkillRegistry {
    private skills;
    register(skill: Skill): void;
    unregister(id: string): boolean;
    get(id: string): Skill | undefined;
    getByName(name: string): Skill | undefined;
    list(): Skill[];
    listByTag(tag: string): Skill[];
    search(query: string): Skill[];
    has(id: string): boolean;
    clear(): void;
}
export declare const skillRegistry: SkillRegistry;
//# sourceMappingURL=registry.d.ts.map