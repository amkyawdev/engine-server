import type { Skill } from '../../shared/types/skill.js';
export interface SkillSource {
    type: 'file' | 'url' | 'inline';
    path?: string;
    content?: string;
}
export declare class SkillLoader {
    load(source: SkillSource): Promise<Skill[]>;
    private loadFromFile;
    private loadFromUrl;
    private parseInline;
    loadFromDirectory(dirPath: string): Promise<Skill[]>;
}
export declare const skillLoader: SkillLoader;
//# sourceMappingURL=loader.d.ts.map