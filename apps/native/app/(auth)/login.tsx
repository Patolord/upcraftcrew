import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Image,
	Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert("Erro", "Por favor, preencha todos os campos");
			return;
		}

		setIsLoading(true);

		try {
			await authClient.signIn.email({
				email,
				password,
			});

			// Router will automatically redirect via AuthWrapper
		} catch (error: any) {
			Alert.alert(
				"Erro no Login",
				error?.message || "Credenciais inválidas. Tente novamente."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="flex-1"
		>
			<ScrollView className="flex-1 bg-white">
				<View className="flex-1 p-6 justify-center min-h-screen">
					{/* Header */}
					<View className="items-center mb-12">
						<View className="w-24 h-24 rounded-2xl items-center justify-center mb-6">
							<Image
								source={require("@/assets/logo/logo-light.png")}
								className="w-full h-full"
							/>
						</View>
						<Text className="text-3xl font-bold text-gray-800 mb-2">
							Bem-vindo de volta!
						</Text>
						<Text className="text-gray-500 text-center">
							Entre com suas credenciais para continuar
						</Text>
					</View>

					{/* Form */}
					<View className="space-y-4">
						{/* Email Input */}
						<View>
							<Text className="text-sm font-medium text-gray-700 mb-2">
								Email
							</Text>
							<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
								<Ionicons name="mail-outline" size={20} color="#9ca3af" />
								<TextInput
									className="flex-1 ml-3 text-gray-800"
									placeholder="seu@email.com"
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
									autoComplete="email"
								/>
							</View>
						</View>

						{/* Password Input */}
						<View>
							<Text className="text-sm font-medium text-gray-700 mb-2">
								Senha
							</Text>
							<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
								<Ionicons
									name="lock-closed-outline"
									size={20}
									color="#9ca3af"
								/>
								<TextInput
									className="flex-1 ml-3 text-gray-800"
									placeholder="********"
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
									autoCapitalize="none"
									autoComplete="password"
								/>
								<TouchableOpacity
									onPress={() => setShowPassword(!showPassword)}
								>
									<Ionicons
										name={showPassword ? "eye-outline" : "eye-off-outline"}
										size={20}
										color="#9ca3af"
									/>
								</TouchableOpacity>
							</View>
						</View>

						{/* Forgot Password */}
						<TouchableOpacity className="self-end">
							<Text className="text-orange-500 font-medium">
								Esqueceu a senha?
							</Text>
						</TouchableOpacity>

						{/* Login Button */}
						<TouchableOpacity
							onPress={handleLogin}
							disabled={isLoading}
							className={`bg-orange-500 py-4 rounded-xl mt-6 ${isLoading ? "opacity-50" : ""}`}
						>
							<Text className="text-white text-center text-lg font-bold">
								{isLoading ? "Entrando..." : "Entrar"}
							</Text>
						</TouchableOpacity>

						{/* Divider */}
						<View className="flex-row items-center my-6">
							<View className="flex-1 h-px bg-gray-300" />
							<Text className="mx-4 text-gray-500">ou continue com</Text>
							<View className="flex-1 h-px bg-gray-300" />
						</View>

						{/* Social Login */}
						<View className="flex-row gap-4">
							<TouchableOpacity className="flex-1 flex-row items-center justify-center bg-gray-50 py-3 rounded-xl border border-gray-200">
								<Ionicons name="logo-google" size={20} color="#FF5722" />
								<Text className="ml-2 text-gray-700 font-medium">Google</Text>
							</TouchableOpacity>
							<TouchableOpacity className="flex-1 flex-row items-center justify-center bg-gray-50 py-3 rounded-xl border border-gray-200">
								<Ionicons name="logo-apple" size={20} color="#000" />
								<Text className="ml-2 text-gray-700 font-medium">Apple</Text>
							</TouchableOpacity>
						</View>

					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
