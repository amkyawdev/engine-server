import { z } from 'zod';
export declare const createValidator: <T extends z.ZodType>(schema: T) => {
    parse: (data: unknown) => any;
    safeParse: (data: unknown) => z.SafeParseReturnType<any, any>;
};
export declare const isValidUrl: (url: string) => boolean;
export declare const isValidEmail: (email: string) => boolean;
export declare const sanitizeString: (str: string) => string;
export declare const validateRange: (value: number, min: number, max: number) => boolean;
//# sourceMappingURL=validator.d.ts.map