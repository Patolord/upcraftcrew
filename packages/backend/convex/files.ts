/**
 * File Storage System
 *
 * Gerenciamento de upload de arquivos (avatares, documentos, etc.)
 * usando Convex File Storage.
 */

import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Gerar URL de upload para avatar
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    // Convex permite gerar URLs de upload temporárias
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Salvar avatar do usuário após upload
 */
export const saveUserAvatar = mutation({
  args: {
    userId: v.string(),
    storageId: v.string(), // ID do arquivo no Convex Storage
  },
  handler: async (ctx, args) => {
    // Obter URL permanente do arquivo
    const avatarUrl = await ctx.storage.getUrl(args.storageId as any);

    if (!avatarUrl) {
      throw new Error("Failed to get avatar URL");
    }

    // TODO: Atualizar campo `image` do usuário no BetterAuth
    // BetterAuth gerencia a tabela de users, então precisamos usar
    // a API do BetterAuth para atualizar o avatar
    // Por enquanto, retornamos a URL

    return {
      storageId: args.storageId,
      url: avatarUrl,
    };
  },
});

/**
 * Deletar arquivo antigo do storage
 */
export const deleteFile = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.storage.delete(args.storageId as any);
    return { success: true };
  },
});
