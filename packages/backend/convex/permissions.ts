/**
 * Role-Based Access Control (RBAC) System
 *
 * Sistema de permissões baseado em roles com hierarquia:
 * - admin: Acesso total ao sistema
 * - manager: Gerenciar projetos e equipes
 * - member: Acesso básico a projetos atribuídos
 * - guest: Apenas leitura
 */

import { query } from "./_generated/server";
import { v } from "convex/values";

// Definição de roles e hierarquia
export const ROLES = {
  admin: "admin",
  manager: "manager",
  member: "member",
  guest: "guest",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Hierarquia de roles (roles superiores herdam permissões dos inferiores)
const ROLE_HIERARCHY: Record<Role, number> = {
  admin: 4,
  manager: 3,
  member: 2,
  guest: 1,
};

// Definição de permissões
export const PERMISSIONS = {
  // Usuários
  "users.view": ["admin", "manager"],
  "users.create": ["admin"],
  "users.edit": ["admin"],
  "users.delete": ["admin"],

  // Projetos
  "projects.view": ["admin", "manager", "member"],
  "projects.create": ["admin", "manager"],
  "projects.edit": ["admin", "manager"],
  "projects.delete": ["admin"],

  // Tasks
  "tasks.view": ["admin", "manager", "member"],
  "tasks.create": ["admin", "manager", "member"],
  "tasks.edit": ["admin", "manager", "member"],
  "tasks.delete": ["admin", "manager"],

  // Eventos
  "events.view": ["admin", "manager", "member"],
  "events.create": ["admin", "manager"],
  "events.edit": ["admin", "manager"],
  "events.delete": ["admin", "manager"],

  // Finanças
  "finance.view": ["admin", "manager"],
  "finance.create": ["admin", "manager"],
  "finance.edit": ["admin"],
  "finance.delete": ["admin"],

  // Configurações
  "settings.view": ["admin", "manager", "member"],
  "settings.edit": ["admin"],

  // Auditoria
  "audit.view": ["admin"],
  "audit.export": ["admin"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Verificar se um role tem uma permissão específica
 */
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles.includes(userRole);
}

/**
 * Verificar se um role é superior ou igual a outro
 */
export function hasRoleLevel(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Verificar permissões do usuário atual
 */
export const checkUserPermission = query({
  args: {
    userId: v.string(),
    permission: v.string(),
  },
  handler: async (ctx, args) => {
    // Buscar role do usuário no BetterAuth
    // Como BetterAuth gerencia users, precisamos acessar via authComponent
    // Por ora, assumimos que temos o role nos additionalFields

    // TODO: Integrar com authComponent.getAuthUser
    // const user = await authComponent.getAuthUser(ctx);
    // const userRole = user?.role as Role || "guest";

    // Por enquanto, retornamos true (implementar após integração completa)
    const userRole = "member" as Role; // Placeholder
    const hasAccess = hasPermission(userRole, args.permission as Permission);

    return {
      hasAccess,
      userRole,
    };
  },
});

/**
 * Buscar todas as permissões de um role
 */
export const getRolePermissions = query({
  args: {
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const userRole = args.role as Role;
    const permissions: string[] = [];

    for (const [permission, allowedRoles] of Object.entries(PERMISSIONS)) {
      if (allowedRoles.includes(userRole)) {
        permissions.push(permission);
      }
    }

    return {
      role: userRole,
      permissions,
      level: ROLE_HIERARCHY[userRole],
    };
  },
});

/**
 * Helper: Verificar se usuário pode acessar recurso
 */
export function canAccessResource(
  userRole: Role,
  resourceOwnerId: string,
  userId: string,
  requiredPermission: Permission
): boolean {
  // Admin sempre pode acessar
  if (userRole === "admin") return true;

  // Se tem a permissão E (é o dono OU é manager+)
  if (hasPermission(userRole, requiredPermission)) {
    return resourceOwnerId === userId || hasRoleLevel(userRole, "manager");
  }

  return false;
}

/**
 * Listar todos os roles disponíveis
 */
export const listRoles = query({
  args: {},
  handler: async () => {
    return Object.entries(ROLE_HIERARCHY).map(([role, level]) => ({
      role,
      level,
      label: role.charAt(0).toUpperCase() + role.slice(1),
    }));
  },
});
