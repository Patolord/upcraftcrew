/**
 * Client-side Permission Utilities
 *
 * Helpers para verificar permissões no frontend.
 */

export const ROLES = {
  admin: "admin",
  manager: "manager",
  member: "member",
  guest: "guest",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Permission =
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "projects.view"
  | "projects.create"
  | "projects.edit"
  | "projects.delete"
  | "tasks.view"
  | "tasks.create"
  | "tasks.edit"
  | "tasks.delete"
  | "events.view"
  | "events.create"
  | "events.edit"
  | "events.delete"
  | "finance.view"
  | "finance.create"
  | "finance.edit"
  | "finance.delete"
  | "settings.view"
  | "settings.edit"
  | "audit.view"
  | "audit.export";

const PERMISSIONS: Record<Permission, Role[]> = {
  "users.view": ["admin", "manager"],
  "users.create": ["admin"],
  "users.edit": ["admin"],
  "users.delete": ["admin"],
  "projects.view": ["admin", "manager", "member"],
  "projects.create": ["admin", "manager"],
  "projects.edit": ["admin", "manager"],
  "projects.delete": ["admin"],
  "tasks.view": ["admin", "manager", "member"],
  "tasks.create": ["admin", "manager", "member"],
  "tasks.edit": ["admin", "manager", "member"],
  "tasks.delete": ["admin", "manager"],
  "events.view": ["admin", "manager", "member"],
  "events.create": ["admin", "manager"],
  "events.edit": ["admin", "manager"],
  "events.delete": ["admin", "manager"],
  "finance.view": ["admin", "manager"],
  "finance.create": ["admin", "manager"],
  "finance.edit": ["admin"],
  "finance.delete": ["admin"],
  "settings.view": ["admin", "manager", "member"],
  "settings.edit": ["admin"],
  "audit.view": ["admin"],
  "audit.export": ["admin"],
};

const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 4,
  manager: 3,
  member: 2,
  guest: 1,
};

/**
 * Verificar se role tem permissão
 */
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

/**
 * Verificar se role é superior ou igual
 */
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Hook para usar permissões com user context
 */
export function usePermissions(user: any) {
  const userRole = (user?.role as Role) || "guest";

  return {
    role: userRole,
    hasPermission: (permission: Permission) =>
      hasPermission(userRole, permission),
    hasRoleLevel: (requiredRole: Role) => hasRoleLevel(userRole, requiredRole),
    isAdmin: userRole === "admin",
    isManager: userRole === "manager" || userRole === "admin",
    isMember: userRole !== "guest",
  };
}

/**
 * Componente de proteção de UI baseado em permissão
 */
interface ProtectedProps {
  permission?: Permission;
  role?: Role;
  userRole: Role;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function Protected({
  permission,
  role,
  userRole,
  fallback = null,
  children,
}: ProtectedProps) {
  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(userRole, permission);
  } else if (role) {
    hasAccess = hasRoleLevel(userRole, role);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
