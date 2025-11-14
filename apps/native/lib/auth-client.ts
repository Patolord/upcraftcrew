import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";

// Get base URL and enforce HTTPS in production
function getBaseURL() {
	const url = process.env.EXPO_PUBLIC_SITE_URL || "http://localhost:3001";

	// In production, ensure HTTPS
	if (process.env.NODE_ENV === "production" && url.startsWith("http://")) {
		console.error("❌ SECURITY ERROR: Production must use HTTPS");
		throw new Error(
			"Production environment must use HTTPS. Update EXPO_PUBLIC_SITE_URL to use https://"
		);
	}

	return url;
}

export const authClient = createAuthClient({
	baseURL: getBaseURL(),
	plugins: [expoClient()],
});

export { useSession } from "better-auth/react";
