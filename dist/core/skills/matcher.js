// Skill Matcher
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('skills:matcher');
export class SkillMatcher {
    match(input, skills) {
        const results = [];
        const lowerInput = input.toLowerCase();
        for (const skill of skills) {
            for (const trigger of skill.triggers) {
                const match = this.matchTrigger(input, trigger);
                if (match.score > 0) {
                    results.push({
                        skill,
                        trigger,
                        score: match.score,
                        matchedPattern: match.pattern,
                    });
                }
            }
        }
        // Sort by score descending
        return results.sort((a, b) => b.score - a.score);
    }
    matchBest(input, skills) {
        const matches = this.match(input, skills);
        return matches[0] || null;
    }
    matchTrigger(input, trigger) {
        const lowerInput = input.toLowerCase();
        switch (trigger.type) {
            case 'keyword':
                return this.matchKeyword(lowerInput, trigger.pattern);
            case 'pattern':
                return this.matchRegex(input, trigger.pattern);
            case 'intent':
                return this.matchIntent(input, trigger.pattern);
            case 'event':
                return this.matchEvent(input, trigger.pattern);
            default:
                return { score: 0 };
        }
    }
    matchKeyword(input, patterns) {
        const keywords = Array.isArray(patterns) ? patterns : [patterns];
        for (const keyword of keywords) {
            const lowerKeyword = keyword.toLowerCase();
            if (input.includes(lowerKeyword)) {
                // Score based on position and length
                const index = input.indexOf(lowerKeyword);
                const positionScore = 1 - index / input.length;
                const lengthScore = lowerKeyword.length / input.length;
                return {
                    score: Math.min(1, positionScore + lengthScore),
                    pattern: keyword,
                };
            }
        }
        return { score: 0 };
    }
    matchRegex(input, patterns) {
        const regexes = (Array.isArray(patterns) ? patterns : [patterns]).map((p) => new RegExp(p, 'i'));
        for (const regex of regexes) {
            if (regex.test(input)) {
                return { score: 1, pattern: regex.source };
            }
        }
        return { score: 0 };
    }
    matchIntent(input, patterns) {
        // Simplified intent matching
        // In production, use NLP/embedding-based matching
        const intents = Array.isArray(patterns) ? patterns : [patterns];
        for (const intent of intents) {
            const lowerIntent = intent.toLowerCase();
            if (lowerIntent.includes(input.toLowerCase()) ||
                input.toLowerCase().includes(lowerIntent)) {
                return { score: 0.8, pattern: intent };
            }
        }
        return { score: 0 };
    }
    matchEvent(input, patterns) {
        // Event matching for webhook/trigger events
        const events = Array.isArray(patterns) ? patterns : [patterns];
        const lowerInput = input.toLowerCase();
        for (const event of events) {
            if (lowerInput.includes(event.toLowerCase())) {
                return { score: 1, pattern: event };
            }
        }
        return { score: 0 };
    }
}
export const skillMatcher = new SkillMatcher();
//# sourceMappingURL=matcher.js.map