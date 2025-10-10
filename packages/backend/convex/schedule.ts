import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query: Get all events
export const getEvents = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .order("desc")
      .collect();

    // Populate project data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const project = event.projectId
          ? await ctx.db.get(event.projectId)
          : null;

        return {
          ...event,
          project,
        };
      })
    );

    return eventsWithDetails;
  },
});

// Query: Get event by ID
export const getEventById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);

    if (!event) {
      return null;
    }

    const project = event.projectId ? await ctx.db.get(event.projectId) : null;

    return {
      ...event,
      project,
    };
  },
});

// Query: Get events by month
export const getEventsByMonth = query({
  args: {
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    // Calculate start and end of month
    const startDate = new Date(args.year, args.month - 1, 1).getTime();
    const endDate = new Date(args.year, args.month, 0, 23, 59, 59).getTime();

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .filter(
        (q) =>
          q.and(
            q.gte(q.field("startTime"), startDate),
            q.lte(q.field("startTime"), endDate)
          )
      )
      .collect();

    // Populate project data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const project = event.projectId
          ? await ctx.db.get(event.projectId)
          : null;

        return {
          ...event,
          project,
        };
      })
    );

    return eventsWithDetails;
  },
});

// Query: Get events by date range
export const getEventsByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .filter(
        (q) =>
          q.and(
            q.gte(q.field("startTime"), args.startDate),
            q.lte(q.field("startTime"), args.endDate)
          )
      )
      .collect();

    // Populate project data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const project = event.projectId
          ? await ctx.db.get(event.projectId)
          : null;

        return {
          ...event,
          project,
        };
      })
    );

    return eventsWithDetails;
  },
});

// Query: Get events by project
export const getEventsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return events;
  },
});

// Query: Get events by type
export const getEventsByType = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();

    return events;
  },
});

// Query: Get events for a user
export const getEventsByUser = query({
  args: { userId: v.string() }, // BetterAuth user ID
  handler: async (ctx, args) => {
    const events = await ctx.db.query("events").collect();

    const userEvents = events.filter((event) =>
      event.attendeeIds.includes(args.userId)
    );

    // Populate project data
    const eventsWithProject = await Promise.all(
      userEvents.map(async (event) => {
        const project = event.projectId
          ? await ctx.db.get(event.projectId)
          : null;

        return {
          ...event,
          project,
        };
      })
    );

    return eventsWithProject;
  },
});

// Query: Get upcoming events
export const getUpcomingEvents = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = args.limit ?? 10;

    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .filter((q) => q.gte(q.field("startTime"), now))
      .order("asc")
      .take(limit);

    // Populate project data
    const eventsWithDetails = await Promise.all(
      events.map(async (event) => {
        const project = event.projectId
          ? await ctx.db.get(event.projectId)
          : null;

        return {
          ...event,
          project,
        };
      })
    );

    return eventsWithDetails;
  },
});

// Mutation: Create event
export const createEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("meeting"),
      v.literal("deadline"),
      v.literal("milestone"),
      v.literal("task")
    ),
    startTime: v.number(),
    endTime: v.number(),
    location: v.optional(v.string()),
    attendeeIds: v.array(v.string()), // BetterAuth user IDs
    projectId: v.optional(v.id("projects")),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      )
    ),
  },
  handler: async (ctx, args) => {
    const eventId = await ctx.db.insert("events", args);

    return eventId;
  },
});

// Mutation: Update event
export const updateEvent = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("meeting"),
        v.literal("deadline"),
        v.literal("milestone"),
        v.literal("task")
      )
    ),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    location: v.optional(v.string()),
    attendeeIds: v.optional(v.array(v.string())), // BetterAuth user IDs
    projectId: v.optional(v.id("projects")),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high")
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    const existingEvent = await ctx.db.get(id);
    if (!existingEvent) {
      throw new Error("Event not found");
    }

    await ctx.db.patch(id, updates);

    return id;
  },
});

// Mutation: Delete event
export const deleteEvent = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);

    if (!event) {
      throw new Error("Event not found");
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

// Mutation: Add attendee to event
export const addAttendeeToEvent = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.string(), // BetterAuth user ID
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    // Check if user is already an attendee
    if (event.attendeeIds.includes(args.userId)) {
      return { success: false, message: "User is already an attendee" };
    }

    await ctx.db.patch(args.eventId, {
      attendeeIds: [...event.attendeeIds, args.userId],
    });

    return { success: true };
  },
});

// Mutation: Remove attendee from event
export const removeAttendeeFromEvent = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.string(), // BetterAuth user ID
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    await ctx.db.patch(args.eventId, {
      attendeeIds: event.attendeeIds.filter((id) => id !== args.userId),
    });

    return { success: true };
  },
});
