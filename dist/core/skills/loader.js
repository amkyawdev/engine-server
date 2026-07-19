// Skill Loader
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('skills:loader');
export class SkillLoader {
    async load(source) {
        logger.info({ type: source.type }, 'Loading skills');
        switch (source.type) {
            case 'file':
                return this.loadFromFile(source.path);
            case 'url':
                return this.loadFromUrl(source.path);
            case 'inline':
                return this.parseInline(source.content);
            default:
                throw new Error(`Unknown skill source type: ${source.type}`);
        }
    }
    async loadFromFile(path) {
        // This would read from filesystem in production
        logger.debug({ path }, 'Loading skills from file');
        return [];
    }
    async loadFromUrl(url) {
        logger.debug({ url }, 'Loading skills from URL');
        // This would fetch from a remote URL
        return [];
    }
    parseInline(content) {
        const skills = [];
        const lines = content.split('\n');
        let currentSkill = null;
        let currentTriggers = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('# Skill:')) {
                if (currentSkill?.id) {
                    skills.push({
                        ...currentSkill,
                        triggers: currentTriggers.map((t) => ({
                            type: 'keyword',
                            pattern: t,
                        })),
                    });
                }
                const name = trimmed.replace('# Skill:', '').trim();
                currentSkill = {
                    id: name.toLowerCase().replace(/\s+/g, '-'),
                    name,
                    description: '',
                    version: '1.0.0',
                    tags: [],
                    actions: [],
                };
                currentTriggers = [];
            }
            else if (trimmed.startsWith('Description:')) {
                if (currentSkill) {
                    currentSkill.description = trimmed.replace('Description:', '').trim();
                }
            }
            else if (trimmed.startsWith('Triggers:')) {
                const triggers = trimmed.replace('Triggers:', '').trim();
                currentTriggers = triggers.split(',').map((t) => t.trim());
            }
        }
        // Add last skill
        if (currentSkill?.id) {
            skills.push({
                ...currentSkill,
                triggers: currentTriggers.map((t) => ({
                    type: 'keyword',
                    pattern: t,
                })),
            });
        }
        return skills;
    }
    async loadFromDirectory(dirPath) {
        // This would recursively load all .md files from a directory
        logger.debug({ dirPath }, 'Loading skills from directory');
        return [];
    }
}
export const skillLoader = new SkillLoader();
//# sourceMappingURL=loader.js.map