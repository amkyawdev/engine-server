import { z } from 'zod';

export const createValidator = <T extends z.ZodType>(schema: T) => {
  return {
    parse: (data: unknown) => schema.parse(data),
    safeParse: (data: unknown) => schema.safeParse(data),
  };
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeString = (str: string): string => {
  return str.replace(/[<>\"'&]/g, (char) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '&': '&amp;',
    };
    return entities[char] || char;
  });
};

export const validateRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max;
};
