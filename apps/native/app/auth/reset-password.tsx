import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function ResetPasswordPage() {
	const router = useRouter();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleResetPassword = () => {
		if (password !== confirmPassword) {
			alert("Passwords don't match!");
			return;
		}
		// TODO: Implement reset password logic
		console.log("Reset password:", password);
		router.push("/auth/login");
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1 bg-white"
		>
			<ScrollView className="flex-1" contentContainerClassName="p-6">
				{/* Header */}
				<View className="items-center mt-12 mb-8">
					<Text className="text-3xl font-bold text-gray-800">
						Reset Password
					</Text>
					<Text className="text-gray-500 mt-2 text-center">
						Enter your new password below
					</Text>
				</View>

				{/* Password Field */}
				<View className="mb-4">
					<Text className="text-sm font-medium text-gray-700 mb-2">
						New Password
					</Text>
					<View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
						<Ionicons name="key-outline" size={20} color="#6b7280" />
						<TextInput
							className="flex-1 ml-3 text-gray-800"
							placeholder="New Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry={!showPassword}
						/>
						<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
							<Ionicons
								name={showPassword ? "eye-off-outline" : "eye-outline"}
								size={20}
								color="#6b7280"
							/>
						</TouchableOpacity>
					</View>
				</View>

				{/* Confirm Password Field */}
				<View className="mb-6">
					<Text className="text-sm font-medium text-gray-700 mb-2">
						Confirm Password
					</Text>
					<View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
						<Ionicons name="key-outline" size={20} color="#6b7280" />
						<TextInput
							className="flex-1 ml-3 text-gray-800"
							placeholder="Confirm Password"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry={!showConfirmPassword}
						/>
						<TouchableOpacity
							onPress={() => setShowConfirmPassword(!showConfirmPassword)}
						>
							<Ionicons
								name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
								size={20}
								color="#6b7280"
							/>
						</TouchableOpacity>
					</View>
				</View>

				{/* Reset Password Button */}
				<TouchableOpacity
					onPress={handleResetPassword}
					className="bg-blue-600 py-4 rounded-lg flex-row items-center justify-center mb-4"
				>
					<Ionicons name="checkmark-circle-outline" size={20} color="white" />
					<Text className="text-white font-semibold text-lg ml-2">
						Reset Password
					</Text>
				</TouchableOpacity>

				{/* Login Link */}
				<View className="flex-row justify-center mt-4">
					<Text className="text-gray-600">Back to </Text>
					<Link href="/auth/login" asChild>
						<TouchableOpacity>
							<Text className="text-blue-600 font-semibold">Login</Text>
						</TouchableOpacity>
					</Link>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
