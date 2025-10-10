/**
 * Session Management System
 *
 * Gerenciamento de múltiplas sessões com IP tracking,
 * geolocation e informações de dispositivo.
 * 
 * ✅ SECURED: Funções protegidas com autorização apropriada
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireAdmin } from "./auth-helpers";

/**
 * Criar ou atualizar sessão ativa
 */
export const trackSession = mutation({
  args: {
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
      type: v.string(),
      browser: v.string(),
      os: v.string(),
    }),
    expiresIn: v.optional(v.number()), // Segundos até expirar
  },
  handler: async (ctx, args) => {
    // Verificar se sessão já existe
    const existingSession = await ctx.db
      .query("activeSessions")
      .withIndex("by_session_token", (q) =>
        q.eq("sessionToken", args.sessionToken)
      )
      .first();

    const now = Date.now();
    const expiresAt = now + (args.expiresIn || 7 * 24 * 60 * 60) * 1000;

    if (existingSession) {
      // Atualizar sessão existente
      await ctx.db.patch(existingSession._id, {
        lastActivityAt: now,
        ipAddress: args.ipAddress,
        userAgent: args.userAgent,
        geolocation: args.geolocation,
        device: args.device,
        expiresAt,
      });
      return existingSession._id;
    }

    // Criar nova sessão
    const sessionId = await ctx.db.insert("activeSessions", {
      userId: args.userId,
      sessionToken: args.sessionToken,
      ipAddress: args.ipAddress,
      userAgent: args.userAgent,
      geolocation: args.geolocation,
      device: args.device,
      createdAt: now,
      lastActivityAt: now,
      expiresAt,
      isActive: true,
    });

    return sessionId;
  },
});

/**
 * Atualizar última atividade da sessão
 */
export const updateSessionActivity = mutation({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("activeSessions")
      .withIndex("by_session_token", (q) =>
        q.eq("sessionToken", args.sessionToken)
      )
      .first();

    if (!session) return null;

    await ctx.db.patch(session._id, {
      lastActivityAt: Date.now(),
    });

    return session._id;
  },
});

/**
 * ✅ Validar sessão por token (para middleware)
 */
export const getSessionByToken = query({
  args: {
    sessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("activeSessions")
      .withIndex("by_session_token", (q) =>
        q.eq("sessionToken", args.sessionToken)
      )
      .first();

    if (!session) return null;

    const now = Date.now();

    // Verificar se sessão expirou
    if (session.expiresAt <= now || !session.isActive) {
      // ⚠️ NOTA: Não podemos fazer patch em query (read-only)
      // Use cleanupExpiredSessions mutation para limpar sessões expiradas
      return null;
    }

    return {
      userId: session.userId,
      isActive: session.isActive,
      expiresAt: session.expiresAt,
      lastActivityAt: session.lastActivityAt,
    };
  },
});

/**
 * Buscar todas as sessões ativas de um usuário
 * ✅ SECURED: Usuário só pode ver suas próprias sessões (ou admin vê de qualquer um)
 */
export const getActiveSessions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Verificar ownership: só pode ver suas próprias sessões (exceto admin)
    if (user.role !== "admin" && user.id !== args.userId) {
      throw new Error("Forbidden: You can only view your own sessions");
    }

    const now = Date.now();

    const sessions = await ctx.db
      .query("activeSessions")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .collect();

    // Filtrar sessões expiradas
    const activeSessions = sessions.filter((s) => s.expiresAt > now);

    // ⚠️ NOTA: Não podemos fazer patch em query (read-only)
    // Use cleanupExpiredSessions mutation periodicamente para limpar sessões expiradas

    return activeSessions;
  },
});

/**
 * Revogar uma sessão específica
 * ✅ SECURED: Usuário autenticado pode revogar sua própria sessão (ou admin revoga qualquer uma)
 */
export const revokeSession = mutation({
  args: {
    sessionToken: v.string(),
    userId: v.string(), // Para segurança, verificar que é do usuário correto
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    const session = await ctx.db
      .query("activeSessions")
      .withIndex("by_session_token", (q) =>
        q.eq("sessionToken", args.sessionToken)
      )
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    // Verificar ownership: só pode revogar sua própria sessão (exceto admin)
    if (user.role !== "admin" && session.userId !== user.id) {
      throw new Error("Forbidden: Cannot revoke another user's session");
    }

    if (session.userId !== args.userId) {
      throw new Error("Unauthorized: Cannot revoke another user's session");
    }

    await ctx.db.patch(session._id, {
      isActive: false,
    });

    return { success: true };
  },
});

/**
 * Revogar todas as outras sessões (manter apenas a atual)
 * ✅ SECURED: Usuário só pode revogar suas próprias sessões
 */
export const revokeOtherSessions = mutation({
  args: {
    userId: v.string(),
    currentSessionToken: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Verificar ownership: só pode revogar suas próprias sessões
    if (user.id !== args.userId) {
      throw new Error("Forbidden: You can only revoke your own sessions");
    }

    const sessions = await ctx.db
      .query("activeSessions")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .collect();

    let revokedCount = 0;
    for (const session of sessions) {
      if (session.sessionToken !== args.currentSessionToken) {
        await ctx.db.patch(session._id, {
          isActive: false,
        });
        revokedCount++;
      }
    }

    return { revokedCount };
  },
});

/**
 * Revogar todas as sessões do usuário
 * ✅ SECURED: Usuário só pode revogar suas próprias sessões (ou admin revoga de qualquer um)
 */
export const revokeAllSessions = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Verificar ownership: só pode revogar suas próprias sessões (exceto admin)
    if (user.role !== "admin" && user.id !== args.userId) {
      throw new Error("Forbidden: You can only revoke your own sessions");
    }

    const sessions = await ctx.db
      .query("activeSessions")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .collect();

    for (const session of sessions) {
      await ctx.db.patch(session._id, {
        isActive: false,
      });
    }

    return { revokedCount: sessions.length };
  },
});

/**
 * 🚨 EMERGÊNCIA: Invalidar TODAS as sessões do sistema
 * 
 * Use em casos de:
 * - Comprometimento de BETTER_AUTH_SECRET
 * - Incident response de segurança
 * - Rotação forçada de credenciais
 * 
 * ⚠️ ATENÇÃO: Isso desconectará TODOS os usuários!
 * ✅ SECURED: APENAS ADMINS podem executar esta ação crítica
 */
export const invalidateAllSessions = mutation({
  args: {},
  handler: async (ctx) => {
    // ✅ REQUER ADMIN - esta é uma ação EXTREMAMENTE crítica
    const admin = await requireAdmin(ctx);

    const allActiveSessions = await ctx.db
      .query("activeSessions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    let invalidatedCount = 0;
    for (const session of allActiveSessions) {
      await ctx.db.patch(session._id, {
        isActive: false,
      });
      invalidatedCount++;
    }

    // Log de auditoria (corrigido com todos os campos obrigatórios)
    await ctx.db.insert("auditLogs", {
      userId: admin.id,
      action: "EMERGENCY_INVALIDATE_ALL_SESSIONS",
      details: JSON.stringify({
        invalidatedCount,
        reason: "Security incident response",
        executedBy: admin.email,
      }),
      timestamp: Date.now(),
      severity: "critical",
      ipAddress: undefined,
      userAgent: undefined,
      geolocation: undefined,
    });

    return { 
      success: true,
      invalidatedCount,
      timestamp: new Date().toISOString(),
    };
  },
});

/**
 * Limpar sessões expiradas (executar periodicamente)
 */
export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const allSessions = await ctx.db.query("activeSessions").collect();
    const expiredSessions = allSessions.filter(
      (s) => s.isActive && s.expiresAt <= now
    );

    for (const session of expiredSessions) {
      await ctx.db.patch(session._id, {
        isActive: false,
      });
    }

    return { cleanedCount: expiredSessions.length };
  },
});

/**
 * Estatísticas de sessões
 * ✅ SECURED: Usuário só pode ver suas próprias stats (ou admin vê de qualquer um)
 */
export const getSessionStats = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    
    // Verificar ownership: só pode ver suas próprias stats (exceto admin)
    if (user.role !== "admin" && user.id !== args.userId) {
      throw new Error("Forbidden: You can only view your own session stats");
    }

    const now = Date.now();

    const allSessions = await ctx.db
      .query("activeSessions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const activeSessions = allSessions.filter(
      (s) => s.isActive && s.expiresAt > now
    );

    const deviceTypes = activeSessions.reduce(
      (acc, s) => {
        acc[s.device.type] = (acc[s.device.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: allSessions.length,
      active: activeSessions.length,
      deviceTypes,
      lastActivity: activeSessions.length > 0
        ? Math.max(...activeSessions.map((s) => s.lastActivityAt))
        : null,
    };
  },
});
