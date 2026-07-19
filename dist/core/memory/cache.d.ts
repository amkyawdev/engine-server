export interface CacheOptions {
    ttl?: number;
    maxSize?: number;
}
export declare class MemoryCache<T = unknown> {
    private cache;
    private ttl;
    private maxSize;
    private hits;
    private misses;
    constructor(options?: CacheOptions);
    set(key: string, value: T, ttl?: number): void;
    get(key: string): T | undefined;
    has(key: string): boolean;
    delete(key: string): boolean;
    clear(): void;
    private evict;
    size(): number;
    stats(): {
        hits: number;
        misses: number;
        hitRate: number;
    };
    cleanup(): number;
}
export declare const globalCache: MemoryCache<unknown>;
//# sourceMappingURL=cache.d.ts.map