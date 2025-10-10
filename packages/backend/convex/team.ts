/**
 * Team Management
 *
 * Gerenciamento de membros da equipe usando BetterAuth para users.
 * NÃO criamos/atualizamos users diretamente - BetterAuth cuida disso.
 */

import { v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Get all team members
 * Busca usuários do BetterAuth e enriquece com dados de projetos
 */
export const getTeamMembers = query({
  args: {},
  handler: async (ctx) => {
    // Verificar se usuário está autenticado
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // BetterAuth não expõe query para listar todos os users
    // Alternativas:
    // 1. Manter cache de user IDs em tabela separada
    // 2. Buscar apenas membros de projetos do usuário atual
    // 3. Usar API do BetterAuth (se disponível)

    // Por enquanto, retornar apenas o usuário atual
    // TODO: Implementar cache de team members quando necessário
    return [
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
        role: currentUser.role,
        department: currentUser.department,
        status: currentUser.status,
      },
    ];
  },
});

/**
 * Get team member by ID
 */
export const getTeamMemberById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // Se está buscando o próprio usuário
    if (args.userId === currentUser.id) {
      return {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
        role: currentUser.role,
        department: currentUser.department,
        status: currentUser.status,
        bio: currentUser.bio,
        location: currentUser.location,
        website: currentUser.website,
        skills: currentUser.skills ? JSON.parse(currentUser.skills as string) : [],
      };
    }

    // Para outros usuários, BetterAuth não expõe query direta
    // Retornar dados básicos se disponível
    return null;
  },
});

/**
 * Get team members by department
 */
export const getTeamMembersByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // BetterAuth não permite filtrar users por department
    // Retornar apenas se o usuário atual pertence ao department
    if (currentUser.department === args.department) {
      return [
        {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          department: currentUser.department,
        },
      ];
    }

    return [];
  },
});

/**
 * Get team members by status
 */
export const getTeamMembersByStatus = query({
  args: {
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away"),
      v.literal("busy")
    ),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // Retornar apenas se o status corresponde
    if (currentUser.status === args.status) {
      return [
        {
          id: currentUser.id,
          name: currentUser.name,
          status: currentUser.status,
        },
      ];
    }

    return [];
  },
});

// ❌ REMOVIDO: createTeamMember
// Users são criados via BetterAuth registration (authClient.signUp.email)

// ❌ REMOVIDO: updateTeamMember
// Users são atualizados via BetterAuth ou mutations em users.ts

// ❌ REMOVIDO: deleteTeamMember
// Users são deletados via BetterAuth admin API

// ❌ REMOVIDO: updateLastActive
// Usar mutation updateLastActive em users.ts que usa BetterAuth
