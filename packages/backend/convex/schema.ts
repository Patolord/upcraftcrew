import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ⚠️ Tabela "users" REMOVIDA - agora gerenciada pelo BetterAuth
  // Campos customizados foram adicionados em auth.ts via user.additionalFields
  // BetterAuth cria automaticamente: betterAuth/users, betterAuth/sessions, etc.

  projects: defineTable({
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
    teamIds: v.array(v.string()), // User IDs do BetterAuth (strings)
    tags: v.array(v.string()),
  }),

  transactions: defineTable({
    description: v.string(),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    date: v.number(),
    clientId: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
  })
    .index("by_date", ["date"])
    .index("by_project", ["projectId"]),

  events: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    attendeeIds: v.array(v.string()), // User IDs do BetterAuth (strings)
    projectId: v.optional(v.id("projects")),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
  })
    .index("by_start_time", ["startTime"])
    .index("by_project", ["projectId"]),
});
