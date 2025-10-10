import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import {
  requireAuth,
  requirePermission,
  requireOwnership,
  requireTeamMember,
  filterAccessibleResources,
} from "./auth-helpers";

// Query: Get all projects
// ✅ SECURED: Filtra projetos baseado em acesso do usuário
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const user = await requirePermission(ctx, "projects.view");

    const projects = await ctx.db.query("projects").collect();

    // Filtrar projetos baseado no acesso do usuário
    // Admin e Manager veem todos, outros veem apenas os que participam
    const accessibleProjects = filterAccessibleResources(
      user,
      projects,
      "projects.view"
    );

    return accessibleProjects;
  },
});

// Query: Get project by ID
// ✅ SECURED: Verifica se usuário tem acesso ao projeto
export const getProjectById = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, "projects.view");

    const project = await ctx.db.get(args.id);

    if (!project) {
      return null;
    }

    // Verificar acesso: Admin, Manager, ou membro da equipe
    if (user.role !== "admin" && user.role !== "manager") {
      if (!project.teamIds.includes(user.id) && project.createdBy !== user.id) {
        throw new Error("Forbidden: You don't have access to this project");
      }
    }

    return project;
  },
});

// Query: Get projects by status
// ✅ SECURED: Filtra projetos por status com base no acesso do usuário
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
    const user = await requirePermission(ctx, "projects.view");

    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();

    // Filtrar projetos baseado no acesso do usuário
    const accessibleProjects = filterAccessibleResources(
      user,
      projects,
      "projects.view"
    );

    return accessibleProjects;
  },
});

// Mutation: Create project
// ✅ SECURED: Requer permissão de criar projetos
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
    const user = await requirePermission(ctx, "projects.create");

    const projectId = await ctx.db.insert("projects", {
      ...args,
      createdBy: user.id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

// Mutation: Update project
// ✅ SECURED: Requer permissão de editar E (ser dono OU membro da equipe)
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

    const user = await requirePermission(ctx, "projects.edit");

    const existingProject = await ctx.db.get(id);
    if (!existingProject) {
      throw new Error("Project not found");
    }

    // Verificar acesso: Admin, Manager, ou membro da equipe/criador
    if (user.role !== "admin" && user.role !== "manager") {
      if (
        !existingProject.teamIds.includes(user.id) &&
        existingProject.createdBy !== user.id
      ) {
        throw new Error("Forbidden: You don't have access to edit this project");
      }
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Mutation: Delete project
// ✅ SECURED: Requer permissão de deletar (apenas Admin)
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, "projects.delete");

    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    // ✅ OTIMIZAÇÃO: Buscar todos os relacionamentos em paralelo (não sequencial)
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

    return { success: true };
  },
});
