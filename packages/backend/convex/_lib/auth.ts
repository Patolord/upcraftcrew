import type { GenericCtx } from "@convex-dev/better-auth";
import type { DataModel } from "../_generated/dataModel";
import type { QueryCtx, MutationCtx } from "../_generated/server";
import { authComponent } from "../auth";

type UserRole = "admin" | "member" | "viewer";

// Context type that has database access (queries and mutations only)
type DbCtx = QueryCtx | MutationCtx;

/**
 * Helper to require authentication in queries and mutations
 * Throws an error if user is not authenticated
 */
export async function requireAuth(ctx: DbCtx) {
	const authUser = await authComponent.getAuthUser(ctx);
	if (!authUser) {
		throw new Error("Unauthorized: Authentication required");
	}

	// Get full user data from database
	const user = await ctx.db
		.query("users")
		.withIndex("by_email", (q) => q.eq("email", authUser.email))
		.first();

	if (!user) {
		throw new Error("User not found in database");
	}

	return { ...authUser, role: user.role, userId: user._id };
}

/**
 * Helper to get authenticated user (optional)
 * Returns null if user is not authenticated
 */
export async function getAuthUser(ctx: DbCtx) {
	const authUser = await authComponent.getAuthUser(ctx);
	if (!authUser) return null;

	const user = await ctx.db
		.query("users")
		.withIndex("by_email", (q) => q.eq("email", authUser.email))
		.first();

	if (!user) return null;

	return { ...authUser, role: user.role, userId: user._id };
}

/**
 * Require admin role
 * Admin can do everything
 */
export async function requireAdmin(ctx: DbCtx) {
	const user = await requireAuth(ctx);
	if (user.role !== "admin") {
		throw new Error("Forbidden: Admin access required");
	}
	return user;
}

/**
 * Require at least member role (admin or member)
 * Member can view/edit everything except they need specific permissions for finance
 */
export async function requireMember(ctx: DbCtx) {
	const user = await requireAuth(ctx);
	if (user.role === "viewer") {
		throw new Error("Forbidden: Member or Admin access required");
	}
	return user;
}

/**
 * Require write permission (admin or member)
 * Viewers can only read
 */
export async function requireWrite(ctx: DbCtx) {
	const user = await requireAuth(ctx);
	if (user.role === "viewer") {
		throw new Error("Forbidden: You don't have write permissions");
	}
	return user;
}
