export const createValidator = (schema) => {
    return {
        parse: (data) => schema.parse(data),
        safeParse: (data) => schema.safeParse(data),
    };
};
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const sanitizeString = (str) => {
    return str.replace(/[<>\"'&]/g, (char) => {
        const entities = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '&': '&amp;',
        };
        return entities[char] || char;
    });
};
export const validateRange = (value, min, max) => {
    return value >= min && value <= max;
};
//# sourceMappingURL=validator.js.map