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
 * Auto-creates user in Convex database if authenticated but not found (mutations only)
 */
export async function requireAuth(ctx: DbCtx) {
	const authUser = await authComponent.getAuthUser(ctx);
	if (!authUser) {
		throw new Error("Unauthorized: Authentication required");
	}

	// Get full user data from database
	let user = await ctx.db
		.query("users")
		.withIndex("by_email", (q) => q.eq("email", authUser.email))
		.first();

	// If user doesn't exist in Convex but is authenticated in Better Auth,
	// auto-create them with sensible defaults (only in mutation context)
	if (!user) {
		// Check if we're in a mutation context (has insert method)
		const isMutation = "insert" in ctx.db && typeof (ctx.db as { insert?: unknown }).insert === "function";
		
		if (isMutation) {
			// Extract name from authUser (fallback to email if not available)
			const name = authUser.name || authUser.email.split("@")[0] || "User";
			
			// Extract department from email domain or use default
			const emailDomain = authUser.email.split("@")[1] || "";
			const department = emailDomain ? emailDomain.split(".")[0].charAt(0).toUpperCase() + emailDomain.split(".")[0].slice(1) : "General";

			// Create user with default member role (not admin for security)
			const userId = await (ctx.db as MutationCtx["db"]).insert("users", {
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

			// Fetch the newly created user
			user = await ctx.db.get(userId);
			if (!user) {
				throw new Error("Failed to create user in database");
			}
		} else {
			// In query context, throw a more helpful error
			throw new Error("User not found in database. Please complete your registration or contact an administrator.");
		}
	}

	return { ...authUser, role: user.role, userId: user._id };
}

/**
 * Helper to get authenticated user (optional)
 * Returns null if user is not authenticated
 * Auto-creates user in Convex database if authenticated but not found (mutations only)
 */
export async function getAuthUser(ctx: DbCtx) {
	const authUser = await authComponent.getAuthUser(ctx);
	if (!authUser) return null;

	let user = await ctx.db
		.query("users")
		.withIndex("by_email", (q) => q.eq("email", authUser.email))
		.first();

	// If user doesn't exist in Convex but is authenticated in Better Auth,
	// auto-create them with sensible defaults (only in mutation context)
	if (!user) {
		// Check if we're in a mutation context (has insert method)
		const isMutation = "insert" in ctx.db && typeof (ctx.db as { insert?: unknown }).insert === "function";
		
		if (isMutation) {
			// Extract name from authUser (fallback to email if not available)
			const name = authUser.name || authUser.email.split("@")[0] || "User";
			
			// Extract department from email domain or use default
			const emailDomain = authUser.email.split("@")[1] || "";
			const department = emailDomain ? emailDomain.split(".")[0].charAt(0).toUpperCase() + emailDomain.split(".")[0].slice(1) : "General";

			// Create user with default member role (not admin for security)
			const userId = await (ctx.db as MutationCtx["db"]).insert("users", {
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

			// Fetch the newly created user
			user = await ctx.db.get(userId);
			if (!user) {
				return null;
			}
		} else {
			// In query context, return null (user doesn't exist)
			return null;
		}
	}

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
