import crypto from 'crypto';

export const generateId = (): string => {
  return crypto.randomUUID();
};

export const hashString = (str: string, algorithm = 'sha256'): string => {
  return crypto.createHash(algorithm).update(str).digest('hex');
};

export const generateToken = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateApiKey = (): string => {
  const prefix = 'ehs';
  const randomPart = crypto.randomBytes(24).toString('base64url');
  return `${prefix}_${randomPart}`;
};

export const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

export const hmacSign = (data: string, secret: string): string => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

export const verifyHmac = (data: string, signature: string, secret: string): boolean => {
  const expected = hmacSign(data, secret);
  try {
    return timingSafeEqual(signature, expected);
  } catch {
    return false;
  }
};
