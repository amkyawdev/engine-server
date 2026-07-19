export declare const generateId: () => string;
export declare const hashString: (str: string, algorithm?: string) => string;
export declare const generateToken: (length?: number) => string;
export declare const generateApiKey: () => string;
export declare const timingSafeEqual: (a: string, b: string) => boolean;
export declare const hmacSign: (data: string, secret: string) => string;
export declare const verifyHmac: (data: string, signature: string, secret: string) => boolean;
//# sourceMappingURL=crypto.d.ts.map