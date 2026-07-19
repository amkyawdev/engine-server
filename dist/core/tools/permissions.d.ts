import type { ToolPermission } from '../../shared/types/tool.js';
export interface PermissionContext {
    userId?: string;
    sessionId: string;
    toolId: string;
    requestedPermissions: ToolPermission[];
}
export declare class PermissionManager {
    private permissions;
    private defaultPermissions;
    grant(toolId: string, permissions: ToolPermission[], userId?: string): void;
    revoke(toolId: string, userId?: string): boolean;
    check(context: PermissionContext): {
        allowed: boolean;
        denied: string[];
    };
    getUserPermissions(toolId: string, userId?: string): ToolPermission[];
    private hasPermission;
    listPermissions(toolId: string, userId?: string): ToolPermission[];
}
export declare const permissionManager: PermissionManager;
//# sourceMappingURL=permissions.d.ts.map