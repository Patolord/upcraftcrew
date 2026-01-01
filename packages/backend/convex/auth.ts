import { expo } from "@better-auth/expo";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { validateEnv } from "./_lib/env";

// Validate environment variables on module load
validateEnv();

const siteUrl = process.env.SITE_URL || "";
const nativeAppUrl = process.env.NATIVE_APP_URL || "upcraftcrew-os://";

export const authComponent = createClient<DataModel>(
	// biome-ignore lint/suspicious/noExplicitAny: Better Auth types
	(components as any).betterAuth,
);

function createAuth(
	ctx: GenericCtx<DataModel>,
	{ optionsOnly: _optionsOnly = false }: { optionsOnly?: boolean } = {},
) {
	// Determine if we're in production environment
	const isProduction = process.env.NODE_ENV === "production";

	const googleClientId = process.env.GOOGLE_CLIENT_ID;
	const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

	// Build trusted origins list - include localhost variations for development
	const trustedOriginsList = [siteUrl, nativeAppUrl];
	if (siteUrl.includes("localhost")) {
		// Add common localhost variations for development
		trustedOriginsList.push("http://localhost:3001", "http://127.0.0.1:3001");
	}

	const config: Parameters<typeof betterAuth>[0] = {
		logger: {
			disabled: false, // Enable logging to debug 403 errors
		},
		baseURL: siteUrl,
		trustedOrigins: trustedOriginsList,
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			// Require email verification in production, disable in development
			requireEmailVerification: isProduction,
		},
		plugins: [expo(), convex()],
	};

	// Add Google OAuth if credentials are available
	if (googleClientId && googleClientSecret) {
		config.socialProviders = {
			google: {
				clientId: googleClientId,
				clientSecret: googleClientSecret,
			},
		};
	}

	return betterAuth(config);
}

export { createAuth };

export const getCurrentUser = query({
	args: {},
	returns: v.any(),
	handler: async (ctx) => authComponent.getAuthUser(ctx),
});

/**
 * Ensure the authenticated user exists in the Convex users table
 * This mutation can be called to sync a user from Better Auth to Convex
 * Useful when a user was created directly in Better Auth (e.g., via registerAdminUser)
 */
export const ensureUserExists = mutation({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.getAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized: Authentication required");
		}

		// Check if user already exists
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", authUser.email))
			.first();

		if (existingUser) {
			return { userId: existingUser._id, created: false };
		}

		// Extract name from authUser (fallback to email if not available)
		const name = authUser.name || authUser.email.split("@")[0] || "User";
		
		// Extract department from email domain or use default
		const emailDomain = authUser.email.split("@")[1] || "";
		const department = emailDomain 
			? emailDomain.split(".")[0].charAt(0).toUpperCase() + emailDomain.split(".")[0].slice(1) 
			: "General";

		// Create user with default member role (not admin for security)
		const userId = await ctx.db.insert("users", {
			email: authUser.email,
			name,
			role: "member",
			department,
			status: "offline",
			joinedAt: Date.now(),
			lastActive: Date.now(),
			skills: [],
			projectIds: [],
		});

		return { userId, created: true };
	},
});
