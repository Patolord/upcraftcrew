/**
 * Validate required environment variables
 * Throws error if any required variables are missing
 */
export function validateEnv() {
	const required = [
		"SITE_URL",
		"CONVEX_SITE_URL",
	];

	const missing: string[] = [];

	for (const varName of required) {
		if (!process.env[varName]) {
			missing.push(varName);
		}
	}

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}\n` +
			`Please set these variables in your .env file or deployment configuration.`
		);
	}

	// Validate URL formats
	const siteUrl = process.env.SITE_URL;
	if (siteUrl && !siteUrl.startsWith("http")) {
		throw new Error(
			`SITE_URL must be a valid URL starting with http:// or https://. Got: ${siteUrl}`
		);
	}

	// Warn if using HTTP in production
	if (process.env.NODE_ENV === "production" && siteUrl && siteUrl.startsWith("http://")) {
		console.warn(
			"⚠️  WARNING: Using HTTP in production is not secure. Please use HTTPS."
		);
	}

	console.log("✅ Environment variables validated successfully");
}
