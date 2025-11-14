import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * Registers an admin user programmatically
 * DEVELOPMENT ONLY: This endpoint should be disabled in production
 *
 * Usage: Call this via HTTP endpoint
 * curl -X POST http://localhost:3000/registerAdmin \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"admin@example.com","password":"SecurePassword123!","name":"Admin User"}'
 */
export const registerAdminUser = httpAction(async (ctx, request) => {
	// CRITICAL: Only allow in development environment
	const isDevelopment =
		process.env.CONVEX_CLOUD_URL?.includes("localhost") ||
		process.env.NODE_ENV === "development";

	if (!isDevelopment) {
		return new Response(
			JSON.stringify({
				success: false,
				error: "This endpoint is only available in development mode",
			}),
			{
				status: 403,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	const body = await request.json();
	const { email, password, name } = body;

	// Validate required fields
	if (!email || typeof email !== "string") {
		return new Response(
			JSON.stringify({
				success: false,
				error: "Email is required and must be a string",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	if (!password || typeof password !== "string" || password.length < 8) {
		return new Response(
			JSON.stringify({
				success: false,
				error: "Password is required and must be at least 8 characters",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

	if (!name || typeof name !== "string") {
		return new Response(
			JSON.stringify({
				success: false,
				error: "Name is required and must be a string",
			}),
			{
				status: 400,
				headers: { "Content-Type": "application/json" },
			},
		);
	}

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

		// Don't include PII (email) in response to avoid logging sensitive data
		return new Response(
			JSON.stringify({
				success: true,
				message: `Admin user created successfully. Login should work now (email verification disabled in development).`,
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
