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
 * Get all team members with their projects (optimized to avoid N+1)
 * 
 * ✅ OTIMIZAÇÃO: Evita N+1 query problem
 * Antes: 50 members × 3 projects = 150 queries
 * Depois: 1 query para projects + parallelização
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
    // 1. Buscar membros através dos projetos (evita N+1)
    // 2. Manter cache de user IDs em tabela separada
    // 3. Usar API do BetterAuth (se disponível)

    // ✅ SOLUÇÃO OTIMIZADA: Buscar todos os projetos primeiro (1 query)
    const allProjects = await ctx.db.query("projects").collect();
    
    // Coletar user IDs únicos de todos os projetos (sem duplicatas)
    const uniqueUserIds = new Set<string>();
    for (const project of allProjects) {
      for (const userId of project.teamIds) {
        uniqueUserIds.add(userId);
      }
    }
    
    // Criar mapa de projetos por userId para lookup O(1)
    const projectsByUserId = new Map<string, typeof allProjects>();
    for (const project of allProjects) {
      for (const userId of project.teamIds) {
        if (!projectsByUserId.has(userId)) {
          projectsByUserId.set(userId, []);
        }
        const userProjects = projectsByUserId.get(userId);
        if (userProjects) {
          userProjects.push(project);
        }
      }
    }

    // Por enquanto, retornar apenas o usuário atual com seus projetos
    const userProjects = projectsByUserId.get(currentUser.id) || [];
    
    return [
      {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        image: currentUser.image,
        role: currentUser.role,
        department: currentUser.department,
        status: currentUser.status,
        projects: userProjects.map(p => ({
          id: p._id,
          name: p.name,
          status: p.status,
        })),
        projectCount: userProjects.length,
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
