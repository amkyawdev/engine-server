// Skill Parser
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('skills:parser');
export class SkillParser {
    parse(content) {
        const errors = [];
        try {
            const lines = content.split('\n');
            let currentSection = '';
            const skill = {};
            const triggers = [];
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('# ') && !trimmed.startsWith('# ')) {
                    // Skip markdown headers for now
                    continue;
                }
                if (trimmed.startsWith('Name:')) {
                    skill.name = trimmed.replace('Name:', '').trim();
                    skill.id = skill.name.toLowerCase().replace(/\s+/g, '-');
                }
                else if (trimmed.startsWith('Description:')) {
                    skill.description = trimmed.replace('Description:', '').trim();
                }
                else if (trimmed.startsWith('Version:')) {
                    skill.version = trimmed.replace('Version:', '').trim();
                }
                else if (trimmed.startsWith('Author:')) {
                    skill.author = trimmed.replace('Author:', '').trim();
                }
                else if (trimmed.startsWith('Tags:')) {
                    skill.tags = trimmed
                        .replace('Tags:', '')
                        .split(',')
                        .map((t) => t.trim());
                }
                else if (trimmed.startsWith('Trigger:')) {
                    const trigger = trimmed.replace('Trigger:', '').trim();
                    triggers.push({
                        type: 'keyword',
                        pattern: trigger,
                        priority: 1,
                    });
                }
                else if (trimmed.startsWith('---')) {
                    currentSection = trimmed;
                }
            }
            if (!skill.name) {
                errors.push('Skill name is required');
            }
            if (errors.length > 0) {
                return { success: false, errors };
            }
            return {
                success: true,
                skill: {
                    id: skill.id || '',
                    name: skill.name || '',
                    description: skill.description || '',
                    version: skill.version || '1.0.0',
                    author: skill.author,
                    tags: skill.tags || [],
                    triggers: triggers.length > 0 ? triggers : [{ type: 'keyword', pattern: skill.name || '' }],
                    actions: [],
                    metadata: {},
                },
                errors: [],
            };
        }
        catch (error) {
            return {
                success: false,
                errors: [`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`],
            };
        }
    }
    validate(content) {
        const result = this.parse(content);
        return { valid: result.success, errors: result.errors };
    }
}
export const skillParser = new SkillParser();
//# sourceMappingURL=parser.js.map