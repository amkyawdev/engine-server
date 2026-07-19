// Tool Permissions
import { createLogger } from '../../shared/utils/logger.js';
import type { ToolPermission } from '../../shared/types/tool.js';

const logger = createLogger('tools:permissions');

export interface PermissionContext {
  userId?: string;
  sessionId: string;
  toolId: string;
  requestedPermissions: ToolPermission[];
}

export class PermissionManager {
  private permissions: Map<string, Map<string, ToolPermission[]>> = new Map();
  private defaultPermissions: ToolPermission[] = [
    { type: 'calculator', level: 'all' },
    { type: 'datetime', level: 'all' },
  ];

  grant(toolId: string, permissions: ToolPermission[], userId?: string): void {
    const key = userId ?? 'global';
    if (!this.permissions.has(key)) {
      this.permissions.set(key, new Map());
    }

    const userPerms = this.permissions.get(key)!;
    userPerms.set(toolId, permissions);

    logger.info({ toolId, permissions, userId }, 'Permissions granted');
  }

  revoke(toolId: string, userId?: string): boolean {
    const key = userId ?? 'global';
    const userPerms = this.permissions.get(key);

    if (!userPerms) return false;

    const deleted = userPerms.delete(toolId);
    if (deleted) {
      logger.info({ toolId, userId }, 'Permissions revoked');
    }

    return deleted;
  }

  check(context: PermissionContext): { allowed: boolean; denied: string[] } {
    const { toolId, userId, requestedPermissions } = context;

    const userPerms = this.getUserPermissions(toolId, userId);
    const denied: string[] = [];

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

  getUserPermissions(toolId: string, userId?: string): ToolPermission[] {
    // Check user-specific permissions first
    if (userId) {
      const userPerms = this.permissions.get(userId)?.get(toolId);
      if (userPerms) return userPerms;
    }

    // Check global permissions
    const globalPerms = this.permissions.get('global')?.get(toolId);
    if (globalPerms) return globalPerms;

    // Check default permissions
    return this.defaultPermissions.filter(
      (p) => p.type === toolId.split('-')[0]
    );
  }

  private hasPermission(
    requested: ToolPermission,
    userPerms: ToolPermission[]
  ): boolean {
    for (const userPerm of userPerms) {
      if (userPerm.type !== requested.type) continue;

      const levelOrder = ['none', 'read', 'write', 'all'];
      const userLevel = levelOrder.indexOf(userPerm.level);
      const requestedLevel = levelOrder.indexOf(requested.level);

      if (userLevel >= requestedLevel) return true;
    }

    return false;
  }

  listPermissions(toolId: string, userId?: string): ToolPermission[] {
    return this.getUserPermissions(toolId, userId);
  }
}

export const permissionManager = new PermissionManager();
