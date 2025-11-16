import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
	// TODO: change to process.env.EXPO_PUBLIC_CONVEX_SITE_URL
	baseURL: "https://curious-rhinoceros-373.convex.site",
	plugins: [
		anonymousClient(),
		expoClient({
			scheme: Constants.expoConfig?.scheme as string,
			storagePrefix: Constants.expoConfig?.scheme as string,
			storage: SecureStore,
		}),
		convexClient(),
	],
});
