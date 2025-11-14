import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./_lib/auth";

/**
 * Generate a cryptographically secure invitation token
 */
function generateInvitationToken(): string {
	// Use crypto.randomUUID() for cryptographically secure tokens
	const token = crypto.randomUUID();
	const timestamp = Date.now().toString(36);
	return `${timestamp}-${token}`;
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

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(args.email)) {
			throw new Error("Invalid email format");
		}

		// Check if user already exists (prevents race condition)
		const existingUser = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.first();

		if (existingUser) {
			throw new Error("User with this email already exists");
		}

		// Generate cryptographically secure invitation token
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

		// Return invitation data (frontend will construct full URL)
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
 * Note: This should only be called in the registration flow, not exposed publicly
 */
export const validateInvitation = query({
	args: {
		email: v.string(),
		token: v.string(),
	},
	handler: async (ctx, args) => {
		// Validate token format to prevent timing attacks
		if (!args.token || args.token.length < 10) {
			return { valid: false, error: "Invalid invitation" };
		}

		const user = await ctx.db
			.query("users")
			.withIndex("by_email", (q) => q.eq("email", args.email))
			.first();

		if (!user) {
			return { valid: false, error: "Invalid invitation" };
		}

		if (user.invitationAccepted) {
			return { valid: false, error: "Invalid invitation" };
		}

		if (user.invitationToken !== args.token) {
			return { valid: false, error: "Invalid invitation" };
		}

		// Only return minimal information - no role disclosure
		return {
			valid: true,
			user: {
				email: user.email,
				name: user.name,
			},
		};
	},
});

/**
 * Mark invitation as accepted
 * Called after successful registration
 * Uses optimistic locking to prevent race conditions
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

		// Check again right before patching to prevent race conditions
		if (user.invitationAccepted) {
			throw new Error("Invitation already accepted");
		}

		// Re-fetch to ensure we have the latest state
		const latestUser = await ctx.db.get(user._id);
		if (!latestUser || latestUser.invitationAccepted) {
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
 * Returns only users with pending invitations (not yet accepted)
 * TODO: Add an index on invitationAccepted for better performance
 */
export const getPendingInvitations = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);

		// Query all users and filter by invitationAccepted
		// This is less efficient than an index but works for moderate user counts
		const users = await ctx.db.query("users").collect();

		// Filter to only include users with pending invitations
		return users.filter(
			(user) => user.invitationToken && !user.invitationAccepted,
		);
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
