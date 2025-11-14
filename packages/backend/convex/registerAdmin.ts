import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * Registers an admin user programmatically
 * This creates a complete user with email and password
 *
 * Usage: Call this via HTTP endpoint
 * curl -X POST http://localhost:3000/registerAdmin \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"paloma.sq@hotmail.com","password":"Qaz-963?","name":"Paloma","force":true}'
 */
export const registerAdminUser = httpAction(async (ctx, request) => {
	const { email, password, name } = await request.json();

	const auth = createAuth(ctx);

	try {
		// Register the user using Better Auth
		const result = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name,
			},
		});

		if (!result) {
			throw new Error("Failed to create user");
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: `Admin user ${name} created successfully. Login should work now (email verification disabled in development).`,
				email: email,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			},
		);
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "Failed to create admin user";
		return new Response(
			JSON.stringify({
				success: false,
				error: errorMessage,
			}),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			},
		);
	}
});
