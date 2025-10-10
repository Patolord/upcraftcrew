/**
 * Client-side Permission Utilities
 *
 * Helpers para verificar permissões no frontend.
 * 
 * ⚠️ IMPORTANTE: Lógica de permissões está centralizada no backend.
 * Este arquivo apenas re-exporta do backend e adiciona React-specific utilities.
 */

import type { ReactNode } from "react";
import type { Role, Permission } from "@upcraftcrew-os/backend";
import { hasPermission, hasRoleLevel } from "@upcraftcrew-os/backend";

// Re-export tudo do backend para manter compatibilidade com imports existentes
export {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasRoleLevel,
  type Role,
  type Permission,
} from "@upcraftcrew-os/backend";

/**
 * Hook para usar permissões com user context
 */
export function usePermissions(user: { role?: Role } | null | undefined) {
  const userRole = user?.role || "guest";

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
  fallback?: ReactNode;
  children: ReactNode;
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

  return hasAccess ? children : fallback;
}
