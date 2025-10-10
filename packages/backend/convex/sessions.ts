/**
 * Session Management System
 *
 * Gerenciamento de múltiplas sessões com IP tracking,
 * geolocation e informações de dispositivo.
 */

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
      // Marcar como inativa se expirou
      if (session.isActive) {
        await ctx.db.patch(session._id, { isActive: false });
      }
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
 */
export const getActiveSessions = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const sessions = await ctx.db
      .query("activeSessions")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", args.userId).eq("isActive", true)
      )
      .collect();

    // Filtrar sessões expiradas
    const activeSessions = sessions.filter((s) => s.expiresAt > now);

    // Marcar sessões expiradas como inativas (fazer em mutation separada)
    const expiredSessions = sessions.filter((s) => s.expiresAt <= now);
    for (const session of expiredSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    return activeSessions;
  },
});

/**
 * Revogar uma sessão específica
 */
export const revokeSession = mutation({
  args: {
    sessionToken: v.string(),
    userId: v.string(), // Para segurança, verificar que é do usuário correto
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("activeSessions")
      .withIndex("by_session_token", (q) =>
        q.eq("sessionToken", args.sessionToken)
      )
      .first();

    if (!session) {
      throw new Error("Session not found");
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
 */
export const revokeOtherSessions = mutation({
  args: {
    userId: v.string(),
    currentSessionToken: v.string(),
  },
  handler: async (ctx, args) => {
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
 */
export const revokeAllSessions = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
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
 */
export const getSessionStats = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
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
