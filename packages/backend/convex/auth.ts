import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth";

const siteUrl = process.env.SITE_URL!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),

    // Email/Password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true, // ✅ Habilitado para segurança
      sendVerificationEmail: async ({ user, url }) => {
        // ✅ Email verification implementado
        if (process.env.RESEND_API_KEY) {
          // Produção: enviar email real via Resend
          try {
            const { sendVerificationEmail } = await import(
              "../../../apps/web/src/lib/email"
            );
            await sendVerificationEmail(user.email, url);
          } catch (error) {
            console.error("Failed to send verification email:", error);
            // Fallback para console em caso de erro
            console.log(`Verification email for ${user.email}: ${url}`);
          }
        } else {
          // Desenvolvimento: apenas log
          console.log(`[DEV] Verification email for ${user.email}:`);
          console.log(`[DEV] Click here: ${url}`);
        }
      },
      sendResetPasswordEmail: async ({ user, url }) => {
        // ✅ Password reset email implementado
        if (process.env.RESEND_API_KEY) {
          try {
            const { sendPasswordResetEmail } = await import(
              "../../../apps/web/src/lib/email"
            );
            await sendPasswordResetEmail(user.email, url);
          } catch (error) {
            console.error("Failed to send password reset email:", error);
            console.log(`Reset password email for ${user.email}: ${url}`);
          }
        } else {
          console.log(`[DEV] Reset password email for ${user.email}:`);
          console.log(`[DEV] Click here: ${url}`);
        }
      },
    },

    // Google OAuth
    socialProviders: {
      google: {
        enabled: true,
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },

    // Session configuration
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Update session every 24 hours
    },

    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
    ],
  });
};

// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});