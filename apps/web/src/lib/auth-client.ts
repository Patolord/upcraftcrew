import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

// Get base URL and enforce HTTPS in production
function getBaseURL() {
	const url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";

	// In production, ensure HTTPS (allow localhost/127.0.0.1 for development)
	if (process.env.NODE_ENV === "production") {
		try {
			const parsedUrl = new URL(url);
			const isLocalhost =
				parsedUrl.hostname === "localhost" ||
				parsedUrl.hostname === "127.0.0.1" ||
				parsedUrl.hostname.endsWith(".local");

			if (parsedUrl.protocol === "http:" && !isLocalhost) {
				const error = new Error(
					"Production environment must use HTTPS. Update NEXT_PUBLIC_SITE_URL to use https://",
				);
				console.error("❌ SECURITY ERROR: Production must use HTTPS");
				// Throw on both client and server to catch misconfigurations early
				throw error;
			}
		} catch (error) {
			// If URL parsing fails, log and allow (might be relative URL)
			if (error instanceof TypeError) {
				console.warn("⚠️ Could not parse URL for HTTPS validation:", url);
			} else {
				throw error;
			}
		}
	}

	return url;
}

export const authClient = createAuthClient({
	baseURL: getBaseURL(),
	plugins: [convexClient()],
});