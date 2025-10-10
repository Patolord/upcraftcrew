import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query: Get all projects
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();

    // BetterAuth gerencia users - não podemos popular team members diretamente
    // Retornar apenas IDs, o frontend pode buscar users via BetterAuth se necessário
    return projects;
  },
});

// Query: Get project by ID
export const getProjectById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      return null;
    }

    // BetterAuth gerencia users - retornar apenas o projeto com IDs
    return project;
  },
});

// Query: Get projects by status
// ✅ OTIMIZADO: BetterAuth gerencia users, retornamos apenas IDs
export const getProjectsByStatus = query({
  args: {
    status: v.union(
      v.literal("planning"),
      v.literal("in-progress"),
      v.literal("on-hold"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();

    // ✅ OTIMIZAÇÃO APLICADA: Evita N+1 ao não buscar users individualmente
    // BetterAuth gerencia users - frontend pode buscar detalhes via BetterAuth
    // Retornar projetos com teamIds (não popular team members)
    return projects;
  },
});

// Mutation: Create project
export const createProject = mutation({
  args: {
    name: v.string(),
    client: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("planning"),
      v.literal("in-progress"),
      v.literal("on-hold"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    startDate: v.number(),
    endDate: v.number(),
    progress: v.number(),
    budget: v.object({
      total: v.number(),
      spent: v.number(),
      remaining: v.number(),
    }),
    teamIds: v.array(v.string()), // BetterAuth user IDs
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = await ctx.db.insert("projects", args);

    // ✅ BetterAuth gerencia users - não atualizamos projectIds aqui
    // Se necessário, usar mutations em users.ts que usam BetterAuth

    return projectId;
  },
});

// Mutation: Update project
export const updateProject = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    client: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("planning"),
        v.literal("in-progress"),
        v.literal("on-hold"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("urgent")
      )
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    progress: v.optional(v.number()),
    budget: v.optional(
      v.object({
        total: v.number(),
        spent: v.number(),
        remaining: v.number(),
      })
    ),
    teamIds: v.optional(v.array(v.string())), // BetterAuth user IDs
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existingProject = await ctx.db.get(id);
    if (!existingProject) {
      throw new Error("Project not found");
    }

    // ✅ OTIMIZAÇÃO APLICADA: Evita N+1 ao não atualizar users individualmente
    // BetterAuth gerencia users - não podemos atualizar projectIds em users do BetterAuth
    // Se necessário, manter essa relação em uma tabela separada de junction no Convex
    
    // ⚠️ NOTA: Código original tentava atualizar projectIds nos users, mas isso
    // não funciona com BetterAuth. Considerar:
    // 1. Criar tabela "userProjects" no Convex para junction table
    // 2. Usar apenas teamIds nos projetos (abordagem atual)
    // 3. Gerenciar relação no frontend

    await ctx.db.patch(id, updates);

    return id;
  },
});

// Mutation: Delete project
// ✅ OTIMIZADO: Busca relacionamentos em paralelo e deleta em batch
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    // ✅ OTIMIZAÇÃO: Buscar todos os relacionamentos em paralelo (não sequencial)
    // Antes: 2 queries sequenciais
    // Depois: 2 queries em paralelo
    const [transactions, events] = await Promise.all([
      ctx.db
        .query("transactions")
        .filter((q) => q.eq(q.field("projectId"), args.id))
        .collect(),
      ctx.db
        .query("events")
        .filter((q) => q.eq(q.field("projectId"), args.id))
        .collect(),
    ]);

    // ✅ OTIMIZAÇÃO: Deletar todos os relacionamentos em paralelo
    // Antes: Loop sequencial de deletes (N+1)
    // Depois: Promise.all para paralelizar
    const deleteOperations: Promise<void>[] = [];

    // Delete related transactions
    for (const transaction of transactions) {
      deleteOperations.push(ctx.db.delete(transaction._id));
    }

    // Delete related events
    for (const event of events) {
      deleteOperations.push(ctx.db.delete(event._id));
    }

    // Execute all deletes in parallel
    await Promise.all(deleteOperations);

    // Delete project itself
    await ctx.db.delete(args.id);

    // ⚠️ NOTA: Não atualizamos users porque BetterAuth os gerencia
    // Se necessário, criar tabela junction "userProjects" no Convex

    return { success: true };
  },
});
