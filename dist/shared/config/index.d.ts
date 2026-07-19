export declare const env: {
    NODE_ENV: "development" | "production" | "test";
    PORT: string;
    HOST: string;
    LOG_LEVEL: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
    LOG_PRETTY: string;
    RATE_LIMIT_MAX: string;
    RATE_LIMIT_TIME_WINDOW: string;
    CORS_ORIGIN: string;
    JWT_EXPIRES_IN: string;
    JWT_SECRET?: string | undefined;
    REDIS_URL?: string | undefined;
    VECTOR_DB_URL?: string | undefined;
    WEBHOOK_SECRET?: string | undefined;
};
export declare const config: {
    server: {
        port: number;
        host: string;
        env: "development" | "production" | "test";
    };
    logging: {
        level: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
        pretty: boolean;
    };
    rateLimit: {
        max: number;
        timeWindow: number;
    };
    cors: {
        origin: string;
    };
    auth: {
        jwtSecret: string | undefined;
        jwtExpiresIn: string;
    };
    redis: {
        url: string | undefined;
    };
    vector: {
        url: string | undefined;
    };
    webhook: {
        secret: string | undefined;
    };
};
//# sourceMappingURL=index.d.ts.map