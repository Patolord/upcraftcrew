/**
 * Database Seed
 *
 * ⚠️ IMPORTANTE: Este seed NÃO cria users!
 * Users são gerenciados pelo BetterAuth via registro (/auth/register).
 *
 * Este seed cria apenas:
 * - Projects (com teamIds vazios - adicionar manualmente depois)
 * - Transactions
 * - Events
 */

import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if database already has data
    const existingProjects = await ctx.db.query("projects").collect();
    if (existingProjects.length > 0) {
      console.log("Database already seeded, skipping...");
      return { success: false, message: "Database already has data" };
    }

    console.log("Starting database seed...");

    // ❌ NÃO SEED USERS - BetterAuth gerencia isso
    // Para adicionar users: Use /auth/register na aplicação

    // ✅ Seed Projects (teamIds vazios por enquanto)
    const projects = [
      {
        name: "Website Redesign",
        client: "Tech Corp",
        description: "Complete overhaul of company website with modern UI/UX",
        status: "in_progress" as const,
        priority: "high" as const,
        startDate: new Date("2025-09-01").getTime(),
        endDate: new Date("2025-12-15").getTime(),
        progress: 65,
        budget: {
          total: 45000,
          spent: 22500,
          remaining: 22500,
        },
        teamIds: [], // Adicionar user IDs manualmente depois do registro
        tags: ["web", "design", "development"],
      },
      {
        name: "Mobile App Development",
        client: "Retail Solutions Inc",
        description: "iOS and Android app for customer engagement",
        status: "in_progress" as const,
        priority: "urgent" as const,
        startDate: new Date("2025-08-15").getTime(),
        endDate: new Date("2026-01-30").getTime(),
        progress: 45,
        budget: {
          total: 80000,
          spent: 35000,
          remaining: 45000,
        },
        teamIds: [],
        tags: ["mobile", "ios", "android"],
      },
      {
        name: "Brand Identity",
        client: "StartUp XYZ",
        description: "Create comprehensive brand guidelines and assets",
        status: "completed" as const,
        priority: "medium" as const,
        startDate: new Date("2025-06-01").getTime(),
        endDate: new Date("2025-08-30").getTime(),
        progress: 100,
        budget: {
          total: 25000,
          spent: 24500,
          remaining: 500,
        },
        teamIds: [],
        tags: ["branding", "design"],
      },
      {
        name: "E-commerce Platform",
        client: "Fashion Outlet",
        description: "Full-stack e-commerce solution with payment integration",
        status: "planning" as const,
        priority: "high" as const,
        startDate: new Date("2026-01-15").getTime(),
        endDate: new Date("2026-06-30").getTime(),
        progress: 10,
        budget: {
          total: 120000,
          spent: 0,
          remaining: 120000,
        },
        teamIds: [],
        tags: ["e-commerce", "web", "backend"],
      },
      {
        name: "Marketing Campaign",
        client: "Local Business",
        description: "Q1 2026 digital marketing campaign across all channels",
        status: "on-hold" as const,
        priority: "low" as const,
        startDate: new Date("2025-11-01").getTime(),
        endDate: new Date("2026-02-28").getTime(),
        progress: 20,
        budget: {
          total: 30000,
          spent: 5000,
          remaining: 25000,
        },
        teamIds: [],
        tags: ["marketing", "social-media"],
      },
      {
        name: "Internal CRM System",
        client: "UpCraft Crew",
        description: "Custom CRM for tracking clients and projects",
        status: "in_progress" as const,
        priority: "medium" as const,
        startDate: new Date("2025-09-15").getTime(),
        endDate: new Date("2025-11-30").getTime(),
        progress: 55,
        budget: {
          total: 55000,
          spent: 28000,
          remaining: 27000,
        },
        teamIds: [],
        tags: ["internal", "crm", "development"],
      },
    ];

    const projectIds = await Promise.all(
      projects.map((project) => ctx.db.insert("projects", project))
    );

    console.log(`Seeded ${projectIds.length} projects`);

    // ✅ Seed Transactions
    const transactions = [
      {
        description: "Final milestone payment from Tech Corp",
        amount: 15000,
        type: "income" as const,
        category: "project-payment",
        status: "completed" as const,
        date: new Date("2025-10-01").getTime(),
        clientId: "Tech Corp",
        projectId: projectIds[0],
      },
      {
        description: "First phase payment",
        amount: 25000,
        type: "income" as const,
        category: "project-payment",
        status: "completed" as const,
        date: new Date("2025-09-28").getTime(),
        clientId: "Retail Solutions Inc",
        projectId: projectIds[1],
      },
      {
        description: "Monthly payroll for all team members",
        amount: 45000,
        type: "expense" as const,
        category: "salary",
        status: "completed" as const,
        date: new Date("2025-10-01").getTime(),
      },
      {
        description: "Annual subscription renewal",
        amount: 599,
        type: "expense" as const,
        category: "software",
        status: "completed" as const,
        date: new Date("2025-10-03").getTime(),
      },
      {
        description: "Monthly cloud infrastructure costs",
        amount: 1250,
        type: "expense" as const,
        category: "software",
        status: "completed" as const,
        date: new Date("2025-10-05").getTime(),
      },
      {
        description: "Initial deposit for new project",
        amount: 30000,
        type: "income" as const,
        category: "project-payment",
        status: "pending" as const,
        date: new Date("2025-10-15").getTime(),
        clientId: "Fashion Outlet",
        projectId: projectIds[3],
      },
      {
        description: "Monthly office space rental",
        amount: 3500,
        type: "expense" as const,
        category: "office",
        status: "completed" as const,
        date: new Date("2025-10-01").getTime(),
      },
      {
        description: "Q4 digital marketing budget",
        amount: 2500,
        type: "expense" as const,
        category: "marketing",
        status: "completed" as const,
        date: new Date("2025-10-02").getTime(),
      },
      {
        description: "Equipment for new developer",
        amount: 3200,
        type: "expense" as const,
        category: "equipment",
        status: "completed" as const,
        date: new Date("2025-09-25").getTime(),
      },
      {
        description: "Final payment for branding project",
        amount: 8500,
        type: "income" as const,
        category: "project-payment",
        status: "completed" as const,
        date: new Date("2025-09-20").getTime(),
        clientId: "StartUp XYZ",
        projectId: projectIds[2],
      },
      {
        description: "External UX consultant for mobile app",
        amount: 4500,
        type: "expense" as const,
        category: "consultant",
        status: "pending" as const,
        date: new Date("2025-10-10").getTime(),
        projectId: projectIds[1],
      },
      {
        description: "Design tool subscription",
        amount: 450,
        type: "expense" as const,
        category: "software",
        status: "completed" as const,
        date: new Date("2025-10-04").getTime(),
      },
      {
        description: "First milestone for internal project",
        amount: 12000,
        type: "income" as const,
        category: "project-payment",
        status: "pending" as const,
        date: new Date("2025-10-20").getTime(),
        projectId: projectIds[5],
      },
      {
        description: "Team tickets for tech conference",
        amount: 1800,
        type: "expense" as const,
        category: "other",
        status: "completed" as const,
        date: new Date("2025-09-30").getTime(),
      },
      {
        description: "Development platform subscription",
        amount: 210,
        type: "expense" as const,
        category: "software",
        status: "completed" as const,
        date: new Date("2025-10-01").getTime(),
      },
    ];

    const transactionIds = await Promise.all(
      transactions.map((transaction) => ctx.db.insert("transactions", transaction))
    );

    console.log(`Seeded ${transactionIds.length} transactions`);

    // ✅ Seed Events (sem attendeeIds por enquanto)
    const events = [
      {
        title: "Team Standup",
        description: "Daily standup meeting with engineering team",
        type: "meeting",
        startTime: new Date("2025-10-06T09:00:00").getTime(),
        endTime: new Date("2025-10-06T09:30:00").getTime(),
        location: "Zoom - Meeting Room 1",
        attendeeIds: [], // Adicionar user IDs depois
        priority: "medium" as const,
      },
      {
        title: "Client Presentation",
        description: "Present Q4 progress to Tech Corp client",
        type: "meeting",
        startTime: new Date("2025-10-06T14:00:00").getTime(),
        endTime: new Date("2025-10-06T15:30:00").getTime(),
        location: "Conference Room A",
        attendeeIds: [],
        projectId: projectIds[0],
        priority: "high" as const,
      },
      {
        title: "Website Redesign Deadline",
        description: "Final delivery date for website redesign project",
        type: "deadline",
        startTime: new Date("2025-10-15T00:00:00").getTime(),
        endTime: new Date("2025-10-15T23:59:59").getTime(),
        attendeeIds: [],
        projectId: projectIds[0],
        priority: "high" as const,
      },
      {
        title: "Design Review",
        description: "Review mobile app designs with team",
        type: "task",
        startTime: new Date("2025-10-07T10:00:00").getTime(),
        endTime: new Date("2025-10-07T11:30:00").getTime(),
        attendeeIds: [],
        projectId: projectIds[1],
        priority: "medium" as const,
      },
      {
        title: "Sprint Planning",
        description: "Plan sprint for next 2 weeks",
        type: "meeting",
        startTime: new Date("2025-10-08T13:00:00").getTime(),
        endTime: new Date("2025-10-08T15:00:00").getTime(),
        location: "Office - Room 3",
        attendeeIds: [],
        priority: "high" as const,
      },
    ];

    const eventIds = await Promise.all(
      events.map((event) => ctx.db.insert("events", event))
    );

    console.log(`Seeded ${eventIds.length} events`);

    console.log("Database seed completed successfully!");
    console.log("⚠️  NOTA: Para adicionar users, use /auth/register");
    console.log("⚠️  NOTA: Depois adicione user IDs aos projects manualmente");

    return {
      success: true,
      message: "Database seeded successfully (without users)",
      stats: {
        users: 0, // Users são criados via BetterAuth registration
        projects: projectIds.length,
        transactions: transactionIds.length,
        events: eventIds.length,
      },
    };
  },
});
