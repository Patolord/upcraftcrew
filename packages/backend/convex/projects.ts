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

    // Populate team members for each project
    const projectsWithTeam = await Promise.all(
      projects.map(async (project) => {
        const team = await Promise.all(
          project.teamIds.map((userId) => ctx.db.get(userId))
        );

        return {
          ...project,
          team: team.filter((member) => member !== null),
        };
      })
    );

    return projectsWithTeam;
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

    // If teamIds are being updated, update users' projectIds
    if (updates.teamIds) {
      // Remove project from old team members
      for (const oldUserId of existingProject.teamIds) {
        const user = await ctx.db.get(oldUserId);
        if (user) {
          await ctx.db.patch(oldUserId, {
            projectIds: user.projectIds.filter((pid) => pid !== id),
          });
        }
      }

      // Add project to new team members
      for (const newUserId of updates.teamIds) {
        const user = await ctx.db.get(newUserId);
        if (user && !user.projectIds.includes(id)) {
          await ctx.db.patch(newUserId, {
            projectIds: [...user.projectIds, id],
          });
        }
      }
    }

    await ctx.db.patch(id, updates);

    return id;
  },
});

// Mutation: Delete project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    // Remove project from team members' projectIds
    for (const userId of project.teamIds) {
      const user = await ctx.db.get(userId);
      if (user) {
        await ctx.db.patch(userId, {
          projectIds: user.projectIds.filter((pid) => pid !== args.id),
        });
      }
    }

    // Delete related transactions
    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("projectId"), args.id))
      .collect();

    for (const transaction of transactions) {
      await ctx.db.delete(transaction._id);
    }

    // Delete related events
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("projectId"), args.id))
      .collect();

    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});
