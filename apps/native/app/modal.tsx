import { Text, View } from "react-native";
import { Container } from "@/components/container";
import { router } from "expo-router";
import { Button } from "@/components/ui/button";

export default function Modal() {
	return (
		<Container>
			<View className="flex-1 p-6">
				<View className="mb-8 flex-row items-center justify-between">
					<Text className="font-bold text-2xl text-foreground">Modal</Text>
					<Button
						title="dashboard"
						onPress={() => router.push("/dashboard")}
					/>
				</View>
			</View>
		</Container>
	);
}
