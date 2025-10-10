import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requirePermission } from "./auth-helpers";

// Query: Get all transactions
// ✅ SECURED: Filtra transações baseado em acesso do usuário
export const getTransactions = query({
  args: {},
  handler: async (ctx) => {
    const user = await requirePermission(ctx, "finance.view");

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date")
      .order("desc")
      .collect();

    // Admin e Manager veem todas as transações
    // Outros usuários veem apenas suas próprias transações
    const accessibleTransactions =
      user.role === "admin" || user.role === "manager"
        ? transactions
        : transactions.filter((t) => t.createdBy === user.id);

    // Populate project data for each transaction
    const transactionsWithProject = await Promise.all(
      accessibleTransactions.map(async (transaction) => {
        if (transaction.projectId) {
          const project = await ctx.db.get(transaction.projectId);
          // Verificar se usuário tem acesso ao projeto
          if (
            project &&
            (user.role === "admin" ||
              user.role === "manager" ||
              project.teamIds.includes(user.id) ||
              project.createdBy === user.id)
          ) {
            return {
              ...transaction,
              project,
            };
          }
        }
        return transaction;
      })
    );

    return transactionsWithProject;
  },
});

// Query: Get transactions by type
// ✅ SECURED: Filtra por tipo com autorização
export const getTransactionsByType = query({
  args: {
    type: v.union(v.literal("income"), v.literal("expense")),
  },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, "finance.view");

    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();

    // Filtrar por acesso do usuário
    const accessibleTransactions =
      user.role === "admin" || user.role === "manager"
        ? transactions
        : transactions.filter((t) => t.createdBy === user.id);

    return accessibleTransactions;
  },
});

// Query: Get transactions by status
// ✅ SECURED: Filtra por status com autorização
export const getTransactionsByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, "finance.view");

    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();

    // Filtrar por acesso do usuário
    const accessibleTransactions =
      user.role === "admin" || user.role === "manager"
        ? transactions
        : transactions.filter((t) => t.createdBy === user.id);

    return accessibleTransactions;
  },
});

// Query: Get transactions by project
// ✅ SECURED: Verifica acesso ao projeto antes de retornar transações
export const getTransactionsByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, "finance.view");

    // Verificar se usuário tem acesso ao projeto
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Verificar acesso ao projeto
    if (user.role !== "admin" && user.role !== "manager") {
      if (
        !project.teamIds.includes(user.id) &&
        project.createdBy !== user.id
      ) {
        throw new Error(
          "Forbidden: You don't have access to this project's transactions"
        );
      }
    }

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return transactions;
  },
});

// Query: Get transactions by date range
// ✅ SECURED: Filtra por data com autorização
export const getTransactionsByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, "finance.view");

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_date")
      .filter(
        (q) =>
          q.and(
            q.gte(q.field("date"), args.startDate),
            q.lte(q.field("date"), args.endDate)
          )
      )
      .collect();

    // Filtrar por acesso do usuário
    const accessibleTransactions =
      user.role === "admin" || user.role === "manager"
        ? transactions
        : transactions.filter((t) => t.createdBy === user.id);

    return accessibleTransactions;
  },
});

// Query: Get financial summary
// ✅ SECURED: Summary apenas para Admin e Manager
export const getFinancialSummary = query({
  args: {},
  handler: async (ctx) => {
    const user = await requirePermission(ctx, "finance.view");

    const allTransactions = await ctx.db.query("transactions").collect();

    // Filtrar por acesso do usuário
    const transactions =
      user.role === "admin" || user.role === "manager"
        ? allTransactions
        : allTransactions.filter((t) => t.createdBy === user.id);

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingIncome = transactions
      .filter((t) => t.type === "income" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);

    const pendingExpense = transactions
      .filter((t) => t.type === "expense" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate by category
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense" && t.status === "completed")
      .forEach((t) => {
        expensesByCategory[t.category] =
          (expensesByCategory[t.category] || 0) + t.amount;
      });

    const incomeByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "income" && t.status === "completed")
      .forEach((t) => {
        incomeByCategory[t.category] =
          (incomeByCategory[t.category] || 0) + t.amount;
      });

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      pendingIncome,
      pendingExpense,
      expensesByCategory,
      incomeByCategory,
      transactionCount: transactions.length,
    };
  },
});

// Query: Get monthly financial summary
// ✅ SECURED: Summary mensal com autorização
export const getMonthlyFinancialSummary = query({
  args: {
    year: v.number(),
    month: v.number(), // 1-12
  },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, "finance.view");

    // Calculate start and end of month
    const startDate = new Date(args.year, args.month - 1, 1).getTime();
    const endDate = new Date(args.year, args.month, 0, 23, 59, 59).getTime();

    const allTransactions = await ctx.db
      .query("transactions")
      .withIndex("by_date")
      .filter(
        (q) =>
          q.and(q.gte(q.field("date"), startDate), q.lte(q.field("date"), endDate))
      )
      .collect();

    // Filtrar por acesso do usuário
    const transactions =
      user.role === "admin" || user.role === "manager"
        ? allTransactions
        : allTransactions.filter((t) => t.createdBy === user.id);

    const totalIncome = transactions
      .filter((t) => t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      year: args.year,
      month: args.month,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  },
});

// Mutation: Create transaction
// ✅ SECURED: Requer permissão de criar transações
export const createTransaction = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const user = await requirePermission(ctx, "finance.create");

    // Se está vinculado a um projeto, verificar acesso
    if (args.projectId) {
      const project = await ctx.db.get(args.projectId);
      if (!project) {
        throw new Error("Project not found");
      }

      // Verificar acesso ao projeto (exceto para Admin e Manager)
      if (user.role !== "admin" && user.role !== "manager") {
        if (
          !project.teamIds.includes(user.id) &&
          project.createdBy !== user.id
        ) {
          throw new Error(
            "Forbidden: You don't have access to create transactions for this project"
          );
        }
      }
    }

    const transactionId = await ctx.db.insert("transactions", {
      ...args,
      createdBy: user.id,
      createdAt: Date.now(),
    });

    // If transaction is linked to a project and is completed, update project budget
    if (args.projectId && args.status === "completed") {
      const project = await ctx.db.get(args.projectId);
      if (project) {
        const updatedBudget = {
          ...project.budget,
          spent:
            args.type === "expense"
              ? project.budget.spent + args.amount
              : project.budget.spent,
          remaining:
            args.type === "expense"
              ? project.budget.remaining - args.amount
              : project.budget.remaining,
        };

        await ctx.db.patch(args.projectId, {
          budget: updatedBudget,
        });
      }
    }

    return transactionId;
  },
});

// Mutation: Update transaction
// ✅ SECURED: Requer permissão de editar (apenas Admin pode editar qualquer transação)
export const updateTransaction = mutation({
  args: {
    id: v.id("transactions"),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
    category: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("completed"),
        v.literal("failed"),
        v.literal("cancelled")
      )
    ),
    date: v.optional(v.number()),
    clientId: v.optional(v.string()),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await requirePermission(ctx, "finance.edit");

    const existingTransaction = await ctx.db.get(id);
    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    // Apenas Admin pode editar transações (finance.edit é restrito a admin)
    // Verificação já feita pelo requirePermission

    // If status is changing to completed and transaction is linked to a project
    if (
      updates.status === "completed" &&
      existingTransaction.status !== "completed" &&
      existingTransaction.projectId
    ) {
      const project = await ctx.db.get(existingTransaction.projectId);
      if (project) {
        const amount = updates.amount ?? existingTransaction.amount;
        const type = updates.type ?? existingTransaction.type;

        const updatedBudget = {
          ...project.budget,
          spent:
            type === "expense"
              ? project.budget.spent + amount
              : project.budget.spent,
          remaining:
            type === "expense"
              ? project.budget.remaining - amount
              : project.budget.remaining,
        };

        await ctx.db.patch(existingTransaction.projectId, {
          budget: updatedBudget,
        });
      }
    }

    await ctx.db.patch(id, updates);

    return id;
  },
});

// Mutation: Delete transaction
// ✅ SECURED: Requer permissão de deletar (apenas Admin)
export const deleteTransaction = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    await requirePermission(ctx, "finance.delete");

    const transaction = await ctx.db.get(args.id);

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Apenas Admin pode deletar transações (finance.delete é restrito a admin)
    // Verificação já feita pelo requirePermission

    // If transaction was completed and linked to a project, revert budget changes
    if (
      transaction.status === "completed" &&
      transaction.projectId &&
      transaction.type === "expense"
    ) {
      const project = await ctx.db.get(transaction.projectId);
      if (project) {
        const updatedBudget = {
          ...project.budget,
          spent: project.budget.spent - transaction.amount,
          remaining: project.budget.remaining + transaction.amount,
        };

        await ctx.db.patch(transaction.projectId, {
          budget: updatedBudget,
        });
      }
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});
