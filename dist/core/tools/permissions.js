// Tool Permissions
import { createLogger } from '../../shared/utils/logger.js';
const logger = createLogger('tools:permissions');
export class PermissionManager {
    permissions = new Map();
    defaultPermissions = [
        { type: 'calculator', level: 'all' },
        { type: 'datetime', level: 'all' },
    ];
    grant(toolId, permissions, userId) {
        const key = userId ?? 'global';
        if (!this.permissions.has(key)) {
            this.permissions.set(key, new Map());
        }
        const userPerms = this.permissions.get(key);
        userPerms.set(toolId, permissions);
        logger.info({ toolId, permissions, userId }, 'Permissions granted');
    }
    revoke(toolId, userId) {
        const key = userId ?? 'global';
        const userPerms = this.permissions.get(key);
        if (!userPerms)
            return false;
        const deleted = userPerms.delete(toolId);
        if (deleted) {
            logger.info({ toolId, userId }, 'Permissions revoked');
        }
        return deleted;
    }
    check(context) {
        const { toolId, userId, requestedPermissions } = context;
        const userPerms = this.getUserPermissions(toolId, userId);
        const denied = [];
        for (const requested of requestedPermissions) {
            const hasPermission = this.hasPermission(requested, userPerms);
            if (!hasPermission) {
                denied.push(`${requested.type}:${requested.level}`);
            }
        }
        return {
            allowed: denied.length === 0,
            denied,
        };
    }
    getUserPermissions(toolId, userId) {
        // Check user-specific permissions first
        if (userId) {
            const userPerms = this.permissions.get(userId)?.get(toolId);
            if (userPerms)
                return userPerms;
        }
        // Check global permissions
        const globalPerms = this.permissions.get('global')?.get(toolId);
        if (globalPerms)
            return globalPerms;
        // Check default permissions
        return this.defaultPermissions.filter((p) => p.type === toolId.split('-')[0]);
    }
    hasPermission(requested, userPerms) {
        for (const userPerm of userPerms) {
            if (userPerm.type !== requested.type)
                continue;
            const levelOrder = ['none', 'read', 'write', 'all'];
            const userLevel = levelOrder.indexOf(userPerm.level);
            const requestedLevel = levelOrder.indexOf(requested.level);
            if (userLevel >= requestedLevel)
                return true;
        }
        return false;
    }
    listPermissions(toolId, userId) {
        return this.getUserPermissions(toolId, userId);
    }
}
export const permissionManager = new PermissionManager();
//# sourceMappingURL=permissions.js.map