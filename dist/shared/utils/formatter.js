export const formatDuration = (ms) => {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(1)}s`;
    if (ms < 3600000)
        return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
    return `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}m`;
};
export const formatBytes = (bytes) => {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
export const formatTimestamp = (date = new Date()) => {
    return date.toISOString();
};
export const truncate = (str, maxLength) => {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - 3) + '...';
};
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
export const slugify = (str) => {
    return str
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};
//# sourceMappingURL=formatter.js.map