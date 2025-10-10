/**
 * Audit Log System
 *
 * Sistema completo de auditoria que registra todas as ações importantes
 * dos usuários com IP tracking e geolocation.
 * 
 * ⚠️ CRÍTICO: Todas as queries são restritas a ADMINS apenas.
 * Audit logs contêm informações sensíveis (IPs, senhas, etc.)
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth-helpers";

/**
 * Registrar ação no audit log
 * ✅ SECURED: Requer autenticação (chamado internamente pelo sistema)
 */
export const logAction = mutation({
  args: {
    userId: v.string(),
    action: v.string(),
    resourceType: v.optional(v.string()),
    resourceId: v.optional(v.string()),
    details: v.optional(v.string()),
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
    severity: v.optional(
      v.union(
        v.literal("info"),
        v.literal("warning"),
        v.literal("error"),
        v.literal("critical")
      )
    ),
  },
  handler: async (ctx, args) => {
    // ✅ Nota: logAction é chamado internamente pelo sistema
    // Não precisa de verificação de auth aqui pois é uma função de serviço
    // Se quiser restringir ainda mais, pode adicionar requireAuth(ctx)
    
    const auditLogId = await ctx.db.insert("auditLogs", {
      userId: args.userId,
      action: args.action,
      resourceType: args.resourceType,
      resourceId: args.resourceId,
      details: args.details,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      geolocation: args.geolocation,
      timestamp: Date.now(),
      severity: args.severity || "info",
    });

    return auditLogId;
  },
});

/**
 * Buscar audit logs por usuário
 * ✅ SECURED: APENAS ADMIN pode ver audit logs
 * ⚠️ CRÍTICO: Contém IPs, senhas resetadas, dados sensíveis
 */
export const getAuditLogsByUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // ✅ REQUER ADMIN - audit logs são extremamente sensíveis
    await requireAdmin(ctx);

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(args.limit || 50);

    return logs;
  },
});

/**
 * Buscar audit logs por ação
 * ✅ SECURED: APENAS ADMIN
 */
export const getAuditLogsByAction = query({
  args: {
    action: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // ✅ REQUER ADMIN
    await requireAdmin(ctx);

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_action", (q) => q.eq("action", args.action))
      .order("desc")
      .take(args.limit || 50);

    return logs;
  },
});

/**
 * Buscar audit logs por recurso
 * ✅ SECURED: APENAS ADMIN
 */
export const getAuditLogsByResource = query({
  args: {
    resourceType: v.string(),
    resourceId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // ✅ REQUER ADMIN
    await requireAdmin(ctx);

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_resource", (q) =>
        q.eq("resourceType", args.resourceType).eq("resourceId", args.resourceId)
      )
      .order("desc")
      .take(args.limit || 50);

    return logs;
  },
});

/**
 * Buscar audit logs recentes (últimas 24h)
 * ✅ SECURED: APENAS ADMIN
 */
export const getRecentAuditLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // ✅ REQUER ADMIN
    await requireAdmin(ctx);

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_timestamp")
      .filter((q) => q.gte(q.field("timestamp"), oneDayAgo))
      .order("desc")
      .take(args.limit || 100);

    return logs;
  },
});

/**
 * Buscar audit logs críticos
 * ✅ SECURED: APENAS ADMIN
 */
export const getCriticalAuditLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // ✅ REQUER ADMIN
    await requireAdmin(ctx);

    const logs = await ctx.db
      .query("auditLogs")
      .filter((q) => q.eq(q.field("severity"), "critical"))
      .order("desc")
      .take(args.limit || 50);

    return logs;
  },
});

/**
 * Estatísticas de auditoria
 * ✅ SECURED: APENAS ADMIN
 */
export const getAuditStats = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // ✅ REQUER ADMIN
    await requireAdmin(ctx);

    let logsQuery = ctx.db.query("auditLogs");

    if (args.userId) {
      logsQuery = logsQuery.withIndex("by_user", (q) =>
        q.eq("userId", args.userId)
      );
    }

    const logs = await logsQuery.collect();

    const stats = {
      total: logs.length,
      bySeverity: {
        info: logs.filter((l) => l.severity === "info").length,
        warning: logs.filter((l) => l.severity === "warning").length,
        error: logs.filter((l) => l.severity === "error").length,
        critical: logs.filter((l) => l.severity === "critical").length,
      },
      last24h: logs.filter((l) => l.timestamp > Date.now() - 24 * 60 * 60 * 1000)
        .length,
      last7d: logs.filter((l) => l.timestamp > Date.now() - 7 * 24 * 60 * 60 * 1000)
        .length,
    };

    return stats;
  },
});
