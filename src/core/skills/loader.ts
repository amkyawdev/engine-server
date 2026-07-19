// Skill Loader
import { createLogger } from '../../shared/utils/logger.js';
import type { Skill } from '../../shared/types/skill.js';

const logger = createLogger('skills:loader');

export interface SkillSource {
  type: 'file' | 'url' | 'inline';
  path?: string;
  content?: string;
}

export class SkillLoader {
  async load(source: SkillSource): Promise<Skill[]> {
    logger.info({ type: source.type }, 'Loading skills');

    switch (source.type) {
      case 'file':
        return this.loadFromFile(source.path!);
      case 'url':
        return this.loadFromUrl(source.path!);
      case 'inline':
        return this.parseInline(source.content!);
      default:
        throw new Error(`Unknown skill source type: ${source.type}`);
    }
  }

  private async loadFromFile(path: string): Promise<Skill[]> {
    // This would read from filesystem in production
    logger.debug({ path }, 'Loading skills from file');
    return [];
  }

  private async loadFromUrl(url: string): Promise<Skill[]> {
    logger.debug({ url }, 'Loading skills from URL');
    // This would fetch from a remote URL
    return [];
  }

  private parseInline(content: string): Skill[] {
    const skills: Skill[] = [];
    const lines = content.split('\n');
    let currentSkill: Partial<Skill> | null = null;
    let currentTriggers: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('# Skill:')) {
        if (currentSkill.id) {
          skills.push({
            ...currentSkill as Skill,
            triggers: currentTriggers.map((t) => ({
              type: 'keyword' as const,
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
      } else if (trimmed.startsWith('Description:')) {
        currentSkill!.description = trimmed.replace('Description:', '').trim();
      } else if (trimmed.startsWith('Triggers:')) {
        const triggers = trimmed.replace('Triggers:', '').trim();
        currentTriggers = triggers.split(',').map((t) => t.trim());
      }
    }

    // Add last skill
    if (currentSkill?.id) {
      skills.push({
        ...currentSkill as Skill,
        triggers: currentTriggers.map((t) => ({
          type: 'keyword' as const,
          pattern: t,
        })),
      });
    }

    return skills;
  }

  async loadFromDirectory(dirPath: string): Promise<Skill[]> {
    // This would recursively load all .md files from a directory
    logger.debug({ dirPath }, 'Loading skills from directory');
    return [];
  }
}

export const skillLoader = new SkillLoader();
