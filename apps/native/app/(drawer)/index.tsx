import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { Card, Chip } from "heroui-native";
import { Text, View } from "react-native";
import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";

export default function Home() {
	const healthCheck = useQuery(api.healthCheck.get);
	const { isAuthenticated } = useConvexAuth();
	const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip");

	const isConnected = healthCheck === "OK";
	const isLoading = healthCheck === undefined;

	return (
		<Container className="p-6">
			<View className="py-4 mb-6">
				<Text className="text-4xl font-bold text-foreground mb-2">
					BETTER T STACK
				</Text>
			</View>

			{!isAuthenticated && (
				<View>
					<Text className="text-muted">
						Please sign in or create an account to continue.
					</Text>
					<SignIn />
				</View>
			)}

			{isAuthenticated && (
				<Card variant="secondary" className="p-4">
					<View className="flex-row items-center justify-between">
						<View>
							<Text className="text-foreground text-lg font-semibold">
								Welcome{user?.name ? `, ${user.name}` : ""}!
							</Text>
							<Text className="text-muted">
								Health: {isLoading ? "Checking..." : isConnected ? "OK" : "Down"}
							</Text>
						</View>
						<Chip color={isConnected ? "success" : "danger"} size="sm">
							<Chip.Label>{isConnected ? "Connected" : "Offline"}</Chip.Label>
						</Chip>
					</View>
				</Card>
			)}
		</Container>
	);
}
