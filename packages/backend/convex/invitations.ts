import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./_lib/auth";

/**
 * Generate a unique invitation token
 */
function generateInvitationToken(): string {
	const timestamp = Date.now().toString(36);
	const randomStr = Math.random().toString(36).substring(2, 15);
	return `${timestamp}-${randomStr}`;
}

/**
 * Admin-only: Create invitation for new user
 * This creates a user record with invitation token
 * User will need this token to complete registration
 */
export const createInvitation = mutation({
	args: {
		email: v.string(),
		name: v.string(),
		role: v.union(v.literal("admin"), v.literal("member"), v.literal("viewer")),
		department: v.string(),
		skills: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		// Check if user already exists
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.first();

		if (existingUser) {
			throw new Error("User with this email already exists");
		}

		// Generate unique invitation token
		const invitationToken = generateInvitationToken();

		// Create user with pending invitation
		const userId = await ctx.db.insert("users", {
			email: args.email,
			name: args.name,
			role: args.role,
			department: args.department,
			skills: args.skills || [],
			status: "offline",
			joinedAt: Date.now(),
			lastActive: Date.now(),
			projectIds: [],
			invitationToken,
			invitationAccepted: false,
		});

		// Return invitation URL (frontend will construct full URL)
		return {
			userId,
			invitationToken,
			email: args.email,
		};
	},
});

/**
 * Validate invitation token and email
 * Called during registration to verify user is invited
 */
export const validateInvitation = query({
	args: {
		email: v.string(),
		token: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.first();

		if (!user) {
			return { valid: false, error: "No invitation found for this email" };
		}

		if (user.invitationAccepted) {
			return { valid: false, error: "Invitation already used" };
		}

		if (user.invitationToken !== args.token) {
			return { valid: false, error: "Invalid invitation token" };
		}

		return {
			valid: true,
			user: {
				email: user.email,
				name: user.name,
				role: user.role,
			},
		};
	},
});

/**
 * Mark invitation as accepted
 * Called after successful registration
 */
export const acceptInvitation = mutation({
	args: {
		email: v.string(),
		token: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.first();

		if (!user) {
			throw new Error("User not found");
		}

		if (user.invitationToken !== args.token) {
			throw new Error("Invalid invitation token");
		}

		if (user.invitationAccepted) {
			throw new Error("Invitation already accepted");
		}

		// Mark invitation as accepted
		await ctx.db.patch(user._id, {
			invitationAccepted: true,
			invitationToken: undefined,
		});

		return { success: true };
	},
});

/**
 * Admin-only: Get all pending invitations
 */
export const getPendingInvitations = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

		const users = await ctx.db.query("users").collect();

		return users.filter((user) => !user.invitationAccepted);
	},
});

/**
 * Admin-only: Resend/regenerate invitation
 */
export const regenerateInvitation = mutation({
	args: {
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const user = await ctx.db.get(args.userId);

		if (!user) {
			throw new Error("User not found");
		}

		if (user.invitationAccepted) {
			throw new Error("User has already accepted invitation");
		}

		const newToken = generateInvitationToken();

		await ctx.db.patch(args.userId, {
			invitationToken: newToken,
		});

		return {
			invitationToken: newToken,
			email: user.email,
		};
	},
});

/**
 * Admin-only: Cancel invitation (delete user)
 */
export const cancelInvitation = mutation({
	args: {
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const user = await ctx.db.get(args.userId);

		if (!user) {
			throw new Error("User not found");
		}

		if (user.invitationAccepted) {
			throw new Error("Cannot cancel invitation for registered user");
		}

		await ctx.db.delete(args.userId);

		return { success: true };
	},
});
