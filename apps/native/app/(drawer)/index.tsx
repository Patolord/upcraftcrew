import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Container } from "@/components/container";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
	const healthCheck = useQuery(api.healthCheck.get);

	return (
		<Container>
			<ScrollView showsVerticalScrollIndicator={false} className="flex-1">
				<Text className="mb-4 font-bold font-mono text-3xl text-foreground">
					UPCRAFT CREW
				</Text>
				<View className="mb-6 rounded-xl border border-border bg-card p-6 shadow-sm">
					<View className="flex-row items-center gap-3">
						<View
							className={`h-3 w-3 rounded-full ${
								healthCheck ? "bg-green-500" : "bg-orange-500"
							}`}
						/>
						<View className="flex-1">
							<Text className="font-medium text-card-foreground text-sm">
								Convex
							</Text>
							<Text className="text-muted-foreground text-xs">
								{healthCheck === undefined
									? "Checking connection..."
									: healthCheck === "OK"
										? "All systems operational"
										: "Service unavailable"}
							</Text>
						</View>
					</View>
				</View>

				{/* Quick Links */}
				<View className="space-y-3">
					<Text className="text-lg font-semibold text-foreground mb-2">Quick Access</Text>

					<Link href="/(admin)/dashboard" asChild>
						<TouchableOpacity className="bg-card border border-border p-4 rounded-lg flex-row items-center">
							<Ionicons name="grid-outline" size={24} color="#3b82f6" />
							<View className="ml-3 flex-1">
								<Text className="font-semibold text-card-foreground">Admin Dashboard</Text>
								<Text className="text-sm text-muted-foreground">Manage projects, team & finances</Text>
							</View>
							<Ionicons name="chevron-forward" size={20} color="#9ca3af" />
						</TouchableOpacity>
					</Link>

					<Link href="/auth/login" asChild>
						<TouchableOpacity className="bg-card border border-border p-4 rounded-lg flex-row items-center">
							<Ionicons name="log-in-outline" size={24} color="#3b82f6" />
							<View className="ml-3 flex-1">
								<Text className="font-semibold text-card-foreground">Login</Text>
								<Text className="text-sm text-muted-foreground">Access your account</Text>
							</View>
							<Ionicons name="chevron-forward" size={20} color="#9ca3af" />
						</TouchableOpacity>
					</Link>

					<Link href="/auth/register" asChild>
						<TouchableOpacity className="bg-card border border-border p-4 rounded-lg flex-row items-center">
							<Ionicons name="person-add-outline" size={24} color="#3b82f6" />
							<View className="ml-3 flex-1">
								<Text className="font-semibold text-card-foreground">Register</Text>
								<Text className="text-sm text-muted-foreground">Create a new account</Text>
							</View>
							<Ionicons name="chevron-forward" size={20} color="#9ca3af" />
						</TouchableOpacity>
					</Link>
				</View>
			</ScrollView>
		</Container>
	);
}
