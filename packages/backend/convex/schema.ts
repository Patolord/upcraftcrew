import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // BetterAuth gerencia as tabelas de usuários automaticamente
  // Não definimos manualmente users, sessions, accounts, etc.

  // ✅ Auditoria de ações (Audit Log)
  auditLogs: defineTable({
    userId: v.string(), // BetterAuth user ID
    action: v.string(), // e.g., "user.login", "project.created", "settings.updated"
    resourceType: v.optional(v.string()), // e.g., "project", "user", "team"
    resourceId: v.optional(v.string()), // ID do recurso afetado
    details: v.optional(v.string()), // JSON string com detalhes adicionais
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    geolocation: v.optional(
      v.object({
        country: v.optional(v.string()),
        city: v.optional(v.string()),
        region: v.optional(v.string()),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
      })
    ),
    timestamp: v.number(),
    severity: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("error"),
      v.literal("critical")
    ),
  })
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_action", ["action"])
    .index("by_resource", ["resourceType", "resourceId"]),

  // ✅ Sessões com tracking detalhado
  activeSessions: defineTable({
    userId: v.string(),
    sessionToken: v.string(),
    ipAddress: v.string(),
    userAgent: v.string(),
    geolocation: v.optional(
      v.object({
        country: v.optional(v.string()),
        city: v.optional(v.string()),
        region: v.optional(v.string()),
      })
    ),
    device: v.object({
      type: v.string(), // "desktop", "mobile", "tablet"
      browser: v.string(),
      os: v.string(),
    }),
    createdAt: v.number(),
    lastActivityAt: v.number(),
    expiresAt: v.number(),
    isActive: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_session_token", ["sessionToken"])
    .index("by_user_active", ["userId", "isActive"]),

  // Projetos
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("on_hold")
    ),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    budget: v.optional(v.number()),
    teamIds: v.array(v.string()), // IDs dos usuários do BetterAuth
    createdBy: v.string(), // ID do usuário criador
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  // Tasks
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    projectId: v.id("projects"),
    assignedTo: v.optional(v.string()), // BetterAuth user ID
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_assigned_to", ["assignedTo"])
    .index("by_status", ["status"]),

  // Events
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    type: v.union(
      v.literal("meeting"),
      v.literal("deadline"),
      v.literal("milestone")
    ),
    projectId: v.optional(v.id("projects")),
    attendeeIds: v.array(v.string()), // BetterAuth user IDs
    createdBy: v.string(),
    createdAt: v.optional(v.number()),
  }).index("by_start_time", ["startTime"]),

  // Financial Transactions
  transactions: defineTable({
    type: v.union(v.literal("income"), v.literal("expense")),
    amount: v.number(),
    category: v.string(),
    description: v.string(),
    projectId: v.optional(v.id("projects")),
    date: v.number(),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_project", ["projectId"])
    .index("by_date", ["date"])
    .index("by_type", ["type"]),
});
