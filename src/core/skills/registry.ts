// Skill Registry
import { createLogger } from '../../shared/utils/logger.js';
import type { Skill } from '../../shared/types/skill.js';

const logger = createLogger('skills:registry');

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  register(skill: Skill): void {
    if (this.skills.has(skill.id)) {
      logger.warn({ skillId: skill.id }, 'Skill already registered');
    }
    this.skills.set(skill.id, skill);
    logger.info({ skillId: skill.id, name: skill.name }, 'Skill registered');
  }

  unregister(id: string): boolean {
    return this.skills.delete(id);
  }

  get(id: string): Skill | undefined {
    return this.skills.get(id);
  }

  getByName(name: string): Skill | undefined {
    for (const skill of this.skills.values()) {
      if (skill.name.toLowerCase() === name.toLowerCase()) {
        return skill;
      }
    }
    return undefined;
  }

  list(): Skill[] {
    return [...this.skills.values()];
  }

  listByTag(tag: string): Skill[] {
    return [...this.skills.values()].filter((s) => s.tags.includes(tag));
  }

  search(query: string): Skill[] {
    const lower = query.toLowerCase();
    return [...this.skills.values()].filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.description.toLowerCase().includes(lower) ||
        s.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }

  has(id: string): boolean {
    return this.skills.has(id);
  }

  clear(): void {
    this.skills.clear();
    logger.info('All skills cleared');
  }
}

export const skillRegistry = new SkillRegistry();
