import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  HOST: z.string().default('0.0.0.0'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  LOG_PRETTY: z.string().default('true'),
  RATE_LIMIT_MAX: z.string().default('100'),
  RATE_LIMIT_TIME_WINDOW: z.string().default('60000'),
  CORS_ORIGIN: z.string().default('*'),
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  REDIS_URL: z.string().optional(),
  VECTOR_DB_URL: z.string().optional(),
  WEBHOOK_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export const config = {
  server: {
    port: parseInt(env.PORT, 10),
    host: env.HOST,
    env: env.NODE_ENV,
  },
  logging: {
    level: env.LOG_LEVEL,
    pretty: env.LOG_PRETTY === 'true',
  },
  rateLimit: {
    max: parseInt(env.RATE_LIMIT_MAX, 10),
    timeWindow: parseInt(env.RATE_LIMIT_TIME_WINDOW, 10),
  },
  cors: {
    origin: env.CORS_ORIGIN,
  },
  auth: {
    jwtSecret: env.JWT_SECRET,
    jwtExpiresIn: env.JWT_EXPIRES_IN,
  },
  redis: {
    url: env.REDIS_URL,
  },
  vector: {
    url: env.VECTOR_DB_URL,
  },
  webhook: {
    secret: env.WEBHOOK_SECRET,
  },
};
