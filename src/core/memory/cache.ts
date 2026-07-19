// In-Memory Cache
import { createLogger } from '../../shared/utils/logger.js';

const logger = createLogger('memory:cache');

export interface CacheOptions {
  ttl?: number;
  maxSize?: number;
}

export class MemoryCache<T = unknown> {
  private cache: Map<string, { value: T; expiresAt: number }> = new Map();
  private ttl: number;
  private maxSize: number;
  private hits = 0;
  private misses = 0;

  constructor(options: CacheOptions = {}) {
    this.ttl = options.ttl ?? 300;
    this.maxSize = options.maxSize ?? 1000;
  }

  set(key: string, value: T, ttl?: number): void {
    if (this.cache.size >= this.maxSize) {
      this.evict();
    }

    const expiresAt = Date.now() + (ttl ?? this.ttl) * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);

    if (!item) {
      this.misses++;
      return undefined;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }

    this.hits++;
    return item.value;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  private evict(): void {
    // Remove expired items first
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }

    // If still at capacity, remove oldest
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }

  stats(): { hits: number; misses: number; hitRate: number } {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  cleanup(): number {
    let count = 0;
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }
}

export const globalCache = new MemoryCache();
