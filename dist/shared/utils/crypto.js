import crypto from 'crypto';
export const generateId = () => {
    return crypto.randomUUID();
};
export const hashString = (str, algorithm = 'sha256') => {
    return crypto.createHash(algorithm).update(str).digest('hex');
};
export const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};
export const generateApiKey = () => {
    const prefix = 'ehs';
    const randomPart = crypto.randomBytes(24).toString('base64url');
    return `${prefix}_${randomPart}`;
};
export const timingSafeEqual = (a, b) => {
    if (a.length !== b.length) {
        return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};
export const hmacSign = (data, secret) => {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
};
export const verifyHmac = (data, signature, secret) => {
    const expected = hmacSign(data, secret);
    try {
        return timingSafeEqual(signature, expected);
    }
    catch {
        return false;
    }
};
//# sourceMappingURL=crypto.js.map