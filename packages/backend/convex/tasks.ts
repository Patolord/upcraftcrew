import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query: Get all tasks
export const getTasks = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    // Populate assigned user and project
    const tasksWithDetails = await Promise.all(
      tasks.map(async (task) => {
        const assignedUser = task.assignedTo
          ? await ctx.db.get(task.assignedTo)
          : null;
        const project = task.projectId ? await ctx.db.get(task.projectId) : null;

        return {
          ...task,
          assignedUser,
          project,
        };
      })
    );

    return tasksWithDetails;
  },
});

// Query: Get task by ID
export const getTaskById = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);

    if (!task) {
      return null;
    }

    const assignedUser = task.assignedTo
      ? await ctx.db.get(task.assignedTo)
      : null;
    const project = task.projectId ? await ctx.db.get(task.projectId) : null;

    return {
      ...task,
      assignedUser,
      project,
    };
  },
});

// Query: Get tasks by status
export const getTasksByStatus = query({
  args: {
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();

    return tasks;
  },
});

// Query: Get tasks by project
export const getTasksByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Populate assigned user
    const tasksWithUser = await Promise.all(
      tasks.map(async (task) => {
        const assignedUser = task.assignedTo
          ? await ctx.db.get(task.assignedTo)
          : null;

        return {
          ...task,
          assignedUser,
        };
      })
    );

    return tasksWithUser;
  },
});

// Query: Get tasks assigned to user
export const getTasksByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_assigned", (q) => q.eq("assignedTo", args.userId))
      .collect();

    return tasks;
  },
});

// Mutation: Create task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    assignedTo: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const taskId = await ctx.db.insert("tasks", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    return taskId;
  },
});

// Mutation: Update task
export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in-progress"),
        v.literal("review"),
        v.literal("done"),
        v.literal("blocked")
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
    assignedTo: v.optional(v.id("users")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existingTask = await ctx.db.get(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Mutation: Delete task
export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);

    if (!task) {
      throw new Error("Task not found");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation: Update task status (for drag & drop)
export const updateTaskStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("blocked")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
