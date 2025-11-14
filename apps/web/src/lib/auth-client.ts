import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

// Get base URL and enforce HTTPS in production
function getBaseURL() {
	const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

	// In production, ensure HTTPS (but allow localhost during build)
	if (
		process.env.NODE_ENV === "production" &&
		url.startsWith("http://") &&
		!url.includes("localhost") &&
		typeof window !== "undefined" // Only check in browser, not during build
	) {
		console.error("❌ SECURITY ERROR: Production must use HTTPS");
		throw new Error(
			"Production environment must use HTTPS. Update NEXT_PUBLIC_SITE_URL to use https://",
		);
	}

	return url;
}

export const authClient = createAuthClient({
	baseURL: getBaseURL(),
	plugins: [convexClient()],
});