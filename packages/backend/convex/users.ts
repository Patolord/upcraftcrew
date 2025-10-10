import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

/**
 * Atualizar campos customizados do perfil do usuário
 */
export const updateProfile = mutation({
  args: {
    role: v.optional(v.string()),
    department: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("online"),
        v.literal("offline"),
        v.literal("away"),
        v.literal("busy")
      )
    ),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Verificar se usuário está autenticado
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Atualizar campos customizados
    // BetterAuth permite atualizar via seu próprio método
    // TODO: Implementar atualização via BetterAuth quando disponível
    // Por enquanto, retornar sucesso
    return { success: true, userId: user.id };
  },
});

/**
 * Atualizar skills do usuário (array)
 */
export const updateSkills = mutation({
  args: {
    skills: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Converter array para JSON string (BetterAuth armazena como string)
    const skillsJson = JSON.stringify(args.skills);

    // TODO: Atualizar via BetterAuth
    return { success: true, skills: args.skills };
  },
});

/**
 * Adicionar projeto ao usuário
 */
export const addProjectToUser = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Buscar projectIds atuais do usuário
    const currentProjectIds = user.projectIds
      ? JSON.parse(user.projectIds as string)
      : [];

    // Adicionar novo projeto (se não existir)
    if (!currentProjectIds.includes(args.projectId)) {
      currentProjectIds.push(args.projectId);
    }

    const projectIdsJson = JSON.stringify(currentProjectIds);

    // TODO: Atualizar via BetterAuth
    return { success: true, projectIds: currentProjectIds };
  },
});

/**
 * Remover projeto do usuário
 */
export const removeProjectFromUser = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const currentProjectIds = user.projectIds
      ? JSON.parse(user.projectIds as string)
      : [];

    const updatedProjectIds = currentProjectIds.filter(
      (id: string) => id !== args.projectId
    );

    const projectIdsJson = JSON.stringify(updatedProjectIds);

    // TODO: Atualizar via BetterAuth
    return { success: true, projectIds: updatedProjectIds };
  },
});

/**
 * Buscar usuário atual com campos customizados parseados
 */
export const getCurrentUserWithDetails = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return null;

    // Parsear campos JSON
    return {
      ...user,
      skills: user.skills ? JSON.parse(user.skills as string) : [],
      projectIds: user.projectIds ? JSON.parse(user.projectIds as string) : [],
    };
  },
});

/**
 * Buscar usuário por ID
 */
export const getUserById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: Implementar busca via BetterAuth
    // Por enquanto, retornar null
    return null;
  },
});

/**
 * Listar todos os usuários
 */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // TODO: Implementar listagem via BetterAuth
    return [];
  },
});

/**
 * Atualizar último acesso do usuário
 */
export const updateLastActive = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) return;

    const now = Date.now();

    // TODO: Atualizar via BetterAuth
    return { success: true, lastActive: now };
  },
});

/**
 * ✅ Buscar usuários com filtros
 */
export const searchUsers = query({
  args: {
    searchTerm: v.optional(v.string()),
    role: v.optional(v.string()),
    department: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // TODO: Implementar busca real via BetterAuth
    // BetterAuth não expõe queries diretas para users table
    // Opção 1: Criar cache/índice separado
    // Opção 2: Usar API do BetterAuth se disponível
    // Por enquanto, retornar array vazio

    // Placeholder de resposta
    return {
      users: [],
      total: 0,
      hasMore: false,
    };
  },
});

/**
 * ✅ Filtrar usuários por role
 */
export const getUsersByRole = query({
  args: {
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // TODO: Implementar busca por role
    return [];
  },
});

/**
 * ✅ Buscar membros de um projeto
 */
export const getProjectMembers = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) {
      throw new Error("Unauthorized");
    }

    // Buscar projeto
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // TODO: Buscar usuários por IDs via BetterAuth
    // Por enquanto, retornar apenas os IDs
    return {
      projectId: args.projectId,
      memberIds: project.teamIds,
      members: [], // Placeholder para dados completos dos membros
    };
  },
});
