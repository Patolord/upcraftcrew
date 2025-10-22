import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    role: v.string(),
    department: v.string(),
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away"),
      v.literal("busy")
    ),
    joinedAt: v.number(),
    lastActive: v.number(),
    skills: v.array(v.string()),
    projectIds: v.array(v.id("projects")),
  }).index("by_email", ["email"]),

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
    teamIds: v.array(v.id("users")),
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
    files: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          size: v.number(),
          uploadedAt: v.number(),
        })
      )
    ),
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
    attendeeIds: v.array(v.id("users")),
    projectId: v.optional(v.id("projects")),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
  })
    .index("by_start_time", ["startTime"])
    .index("by_project", ["projectId"]),

  budgets: defineTable({
    title: v.string(),
    client: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("expired")
    ),
    totalAmount: v.number(),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        total: v.number(),
      })
    ),
    validUntil: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    projectId: v.optional(v.id("projects")),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_client", ["client"])
    .index("by_created_at", ["createdAt"]),

  tasks: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_assigned", ["assignedTo"])
    .index("by_project", ["projectId"])
    .index("by_created_at", ["createdAt"]),
});
