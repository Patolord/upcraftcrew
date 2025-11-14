import { View, Text, ActivityIndicator } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";

interface AuthWrapperProps {
	children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
	const { data: session, isPending } = useSession();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		if (isPending) return;

		const inAuthGroup = segments[0] === "(auth)";

		if (!session && !inAuthGroup) {
			// Redirect to login if not authenticated and trying to access app
			router.replace("/(auth)/login");
		} else if (session && inAuthGroup) {
			// Redirect to app if authenticated and in auth pages
			router.replace("/(app)/dashboard");
		}
	}, [session, segments, isPending]);

	// Loading state
	if (isPending) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size="large" color="#FF5722" />
				<Text className="mt-4 text-gray-600">Loading...</Text>
			</View>
		);
	}

	// Show content
	return <>{children}</>;
}
