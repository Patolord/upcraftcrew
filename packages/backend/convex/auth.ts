import { expo } from "@better-auth/expo";
import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { validateEnv } from "./_lib/env";

// Validate environment variables on module load
validateEnv();

const siteUrl = process.env.SITE_URL!;
const nativeAppUrl = process.env.NATIVE_APP_URL || "upcraftcrew-os://";

export const authComponent = createClient<DataModel>(
	(components as any).betterAuth,
);

function createAuth(
	ctx: GenericCtx<DataModel>,
	{ optionsOnly }: { optionsOnly?: boolean } = { optionsOnly: false },
) {
	// Determine if we're in production environment
	const isProduction = process.env.NODE_ENV === "production";

	return betterAuth({
		logger: {
			disabled: optionsOnly,
		},
		baseURL: siteUrl,
		trustedOrigins: [siteUrl, nativeAppUrl],
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			// Require email verification in production, disable in development
			requireEmailVerification: isProduction,
		},
		plugins: [expo(), convex()],
	});
}

export { createAuth };

export const getCurrentUser = query({
	args: {},
	returns: v.any(),
	handler: async (ctx, args) => authComponent.getAuthUser(ctx),
});
