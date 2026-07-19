export interface FallbackOption<T> {
    name: string;
    fn: () => Promise<T>;
    weight?: number;
}
export declare class FallbackHandler {
    execute<T>(options: FallbackOption<T>[], defaultValue?: T): Promise<T>;
}
export declare const fallbackHandler: FallbackHandler;
//# sourceMappingURL=fallback.d.ts.map