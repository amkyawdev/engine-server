// Skill Matcher
import { createLogger } from '../../shared/utils/logger.js';
import type { Skill, SkillTrigger } from '../../shared/types/skill.js';

const logger = createLogger('skills:matcher');

export interface MatchResult {
  skill: Skill;
  trigger: SkillTrigger;
  score: number;
  matchedPattern?: string;
}

export class SkillMatcher {
  match(input: string, skills: Skill[]): MatchResult[] {
    const results: MatchResult[] = [];
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

  matchBest(input: string, skills: Skill[]): MatchResult | null {
    const matches = this.match(input, skills);
    return matches[0] || null;
  }

  private matchTrigger(
    input: string,
    trigger: SkillTrigger
  ): { score: number; pattern?: string } {
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

  private matchKeyword(
    input: string,
    patterns: string | string[]
  ): { score: number; pattern?: string } {
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

  private matchRegex(
    input: string,
    patterns: string | string[]
  ): { score: number; pattern?: string } {
    const regexes = (Array.isArray(patterns) ? patterns : [patterns]).map(
      (p) => new RegExp(p, 'i')
    );

    for (const regex of regexes) {
      if (regex.test(input)) {
        return { score: 1, pattern: regex.source };
      }
    }

    return { score: 0 };
  }

  private matchIntent(
    input: string,
    patterns: string | string[]
  ): { score: number; pattern?: string } {
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

  private matchEvent(
    input: string,
    patterns: string | string[]
  ): { score: number; pattern?: string } {
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
