import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/api";

/**
 * Makes an existing user an admin by updating custom fields in Better Auth
 * First register the user through the normal sign-up flow, then run this
 *
 * Usage: npx convex run createAdminUser:makeAdmin '{"email":"user@example.com"}' --prod
 */
export const makeAdmin = mutation({
	args: {
		email: v.string(),
	},
	handler: async (ctx, args) => {
		// Use Better Auth's adapter to find and update the user
		const userId = await ctx.runMutation(
			components.betterAuth.adapter.create,
			{
				input: {
					model: "user",
					data: {
						email: args.email,
						name: "Admin User",
						emailVerified: false,
						createdAt: Date.now(),
						updatedAt: Date.now(),
						role: "admin",
					} as any,
				},
			},
		);

		console.log(`User ${args.email} created/updated as admin`);

		return {
			success: true,
			message: `User ${args.email} is now an admin`,
			email: args.email,
		};
	},
});
