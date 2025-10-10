/**
 * Authorization Helpers
 * 
 * Funções reutilizáveis para implementar autorização em queries e mutations.
 * SEMPRE use estas funções para proteger recursos sensíveis.
 */

import type { QueryCtx, MutationCtx } from "./_generated/server";
import { authComponent } from "./auth";
import { PERMISSIONS, hasPermission, type Permission, type Role } from "./permissions";

/**
 * Tipo de contexto genérico que suporta tanto Query quanto Mutation
 */
type AuthContext = QueryCtx | MutationCtx;

/**
 * Interface de usuário autenticado com role
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  [key: string]: any;
}

/**
 * ✅ Require Authentication
 * Garante que o usuário está autenticado
 * 
 * @throws Error se usuário não estiver autenticado
 * @returns Usuário autenticado com role
 */
export async function requireAuth(ctx: AuthContext): Promise<AuthenticatedUser> {
  const user = await authComponent.getAuthUser(ctx);
  
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }

  // Garantir que o role existe (default: member)
  const userRole = (user.role as Role) || "member";

  return {
    ...user,
    role: userRole,
  } as AuthenticatedUser;
}

/**
 * ✅ Require Permission
 * Garante que o usuário tem a permissão específica
 * 
 * @throws Error se usuário não tiver a permissão
 * @returns Usuário autenticado
 */
export async function requirePermission(
  ctx: AuthContext,
  permission: Permission
): Promise<AuthenticatedUser> {
  const user = await requireAuth(ctx);

  if (!hasPermission(user.role, permission)) {
    throw new Error(
      `Forbidden: Permission '${permission}' required. Your role: ${user.role}`
    );
  }

  return user;
}

/**
 * ✅ Require Admin
 * Garante que o usuário é um administrador
 * 
 * @throws Error se usuário não for admin
 * @returns Usuário autenticado
 */
export async function requireAdmin(ctx: AuthContext): Promise<AuthenticatedUser> {
  const user = await requireAuth(ctx);

  if (user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  return user;
}

/**
 * ✅ Require Manager or Above
 * Garante que o usuário é manager ou admin
 * 
 * @throws Error se usuário não for manager+
 * @returns Usuário autenticado
 */
export async function requireManager(ctx: AuthContext): Promise<AuthenticatedUser> {
  const user = await requireAuth(ctx);

  if (user.role !== "admin" && user.role !== "manager") {
    throw new Error("Forbidden: Manager access required");
  }

  return user;
}

/**
 * ✅ Require Ownership
 * Garante que o usuário é dono do recurso OU tem permissão superior
 * 
 * @param ctx - Contexto da query/mutation
 * @param ownerId - ID do dono do recurso
 * @param permission - Permissão necessária para acesso não-owner
 * @throws Error se usuário não for dono E não tiver permissão
 * @returns Usuário autenticado
 */
export async function requireOwnership(
  ctx: AuthContext,
  ownerId: string,
  permission?: Permission
): Promise<AuthenticatedUser> {
  const user = await requireAuth(ctx);

  // Admin sempre pode acessar
  if (user.role === "admin") {
    return user;
  }

  // Se é o dono, pode acessar
  if (user.id === ownerId) {
    return user;
  }

  // Se tem permissão específica E é manager+, pode acessar
  if (permission && hasPermission(user.role, permission)) {
    if (user.role === "manager") {
      return user;
    }
  }

  throw new Error("Forbidden: You don't have access to this resource");
}

/**
 * ✅ Require Team Member
 * Garante que o usuário é membro da equipe do projeto OU tem permissão superior
 * 
 * @param ctx - Contexto da query/mutation
 * @param teamIds - IDs dos membros da equipe
 * @param permission - Permissão necessária para acesso não-member
 * @throws Error se usuário não for membro E não tiver permissão
 * @returns Usuário autenticado
 */
export async function requireTeamMember(
  ctx: AuthContext,
  teamIds: string[],
  permission?: Permission
): Promise<AuthenticatedUser> {
  const user = await requireAuth(ctx);

  // Admin sempre pode acessar
  if (user.role === "admin") {
    return user;
  }

  // Se é membro da equipe, pode acessar
  if (teamIds.includes(user.id)) {
    return user;
  }

  // Se tem permissão específica E é manager+, pode acessar
  if (permission && hasPermission(user.role, permission)) {
    if (user.role === "manager") {
      return user;
    }
  }

  throw new Error("Forbidden: You must be a team member to access this resource");
}

/**
 * ✅ Check Permission (não lança erro)
 * Verifica se o usuário tem a permissão, mas não lança erro
 * 
 * @returns true se tiver permissão, false caso contrário
 */
export async function checkPermission(
  ctx: AuthContext,
  permission: Permission
): Promise<boolean> {
  try {
    await requirePermission(ctx, permission);
    return true;
  } catch {
    return false;
  }
}

/**
 * ✅ Get User or Null
 * Retorna o usuário autenticado ou null (não lança erro)
 */
export async function getUserOrNull(ctx: AuthContext): Promise<AuthenticatedUser | null> {
  try {
    return await requireAuth(ctx);
  } catch {
    return null;
  }
}

/**
 * ✅ Filter Accessible Resources
 * Filtra recursos baseado no acesso do usuário
 * 
 * @param user - Usuário autenticado
 * @param resources - Array de recursos com createdBy ou teamIds
 * @param permission - Permissão necessária para ver todos
 * @returns Recursos filtrados
 */
export function filterAccessibleResources<T extends { createdBy?: string; teamIds?: string[] }>(
  user: AuthenticatedUser,
  resources: T[],
  permission?: Permission
): T[] {
  // Admin vê tudo
  if (user.role === "admin") {
    return resources;
  }

  // Manager com permissão vê tudo
  if (permission && user.role === "manager" && hasPermission(user.role, permission)) {
    return resources;
  }

  // Outros usuários veem apenas recursos que criaram ou que fazem parte do time
  return resources.filter((resource) => {
    // Se é criador
    if (resource.createdBy === user.id) {
      return true;
    }

    // Se é membro da equipe
    if (resource.teamIds?.includes(user.id)) {
      return true;
    }

    return false;
  });
}

