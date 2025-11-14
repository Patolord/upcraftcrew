import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

// Get base URL and enforce HTTPS in production
function getBaseURL() {
	const url = process.env.EXPO_PUBLIC_SITE_URL || "http://localhost:3001";

	// In Expo, use __DEV__ for reliable production detection
	// process.env.NODE_ENV is unreliable in React Native/Expo
	const isProduction =
		typeof __DEV__ !== "undefined"
			? !__DEV__
			: process.env.NODE_ENV === "production";

	// In production, ensure HTTPS (allow localhost/127.0.0.1 for development)
	if (isProduction) {
		try {
			const parsedUrl = new URL(url);
			const isLocalhost =
				parsedUrl.hostname === "localhost" ||
				parsedUrl.hostname === "127.0.0.1" ||
				parsedUrl.hostname.endsWith(".local");

			if (parsedUrl.protocol === "http:" && !isLocalhost) {
				const error = new Error(
					"Production environment must use HTTPS. Update EXPO_PUBLIC_SITE_URL to use https://",
				);
				console.error("❌ SECURITY ERROR: Production must use HTTPS");
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
	plugins: [
		expoClient({
			scheme: "upcraft-crew",
			storage: SecureStore,
		}),
	],
});

export const { useSession } = authClient;
