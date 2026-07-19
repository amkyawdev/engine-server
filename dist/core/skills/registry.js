// Skill Registry
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('skills:registry');
export class SkillRegistry {
    skills = new Map();
    register(skill) {
        if (this.skills.has(skill.id)) {
            logger.warn({ skillId: skill.id }, 'Skill already registered');
        }
        this.skills.set(skill.id, skill);
        logger.info({ skillId: skill.id, name: skill.name }, 'Skill registered');
    }
    unregister(id) {
        return this.skills.delete(id);
    }
    get(id) {
        return this.skills.get(id);
    }
    getByName(name) {
        for (const skill of this.skills.values()) {
            if (skill.name.toLowerCase() === name.toLowerCase()) {
                return skill;
            }
        }
        return undefined;
    }
    list() {
        return [...this.skills.values()];
    }
    listByTag(tag) {
        return [...this.skills.values()].filter((s) => s.tags.includes(tag));
    }
    search(query) {
        const lower = query.toLowerCase();
        return [...this.skills.values()].filter((s) => s.name.toLowerCase().includes(lower) ||
            s.description.toLowerCase().includes(lower) ||
            s.tags.some((t) => t.toLowerCase().includes(lower)));
    }
    has(id) {
        return this.skills.has(id);
    }
    clear() {
        this.skills.clear();
        logger.info('All skills cleared');
    }
}
export const skillRegistry = new SkillRegistry();
//# sourceMappingURL=registry.js.map