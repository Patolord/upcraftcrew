import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Updates an existing user to have admin privileges
 * The user must already be registered through the normal sign-up flow
 *
 * NOTE: This function is currently not implemented due to Better Auth component architecture.
 * Better Auth manages its own user table through a component, which is not directly accessible
 * through the standard Convex database API.
 *
 * TODO: Implement this using Better Auth's API once they provide a method for role updates,
 * or access the component's internal tables through the component API.
 *
 * Usage: npx convex run createAdminUser:makeAdmin '{"email":"user@example.com"}' --prod
 *
 * WARNING: This should only be run by system administrators with database access
 */
export const makeAdmin = mutation({
	args: {
		email: v.string(),
	},
	handler: async (_ctx, _args) => {
		// TODO: Implement user role update when Better Auth provides the API
		throw new Error(
			`This function is not yet implemented. ` +
				`The Better Auth component does not currently expose an API for updating user roles. ` +
				`Please update user roles directly in the database or wait for Better Auth to provide this functionality.`,
		);
	},
});
