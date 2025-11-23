import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);

	const handleRegister = async () => {
		// Validações
		if (!name || !email || !password) {
			Alert.alert("Erro", "Por favor, preencha todos os campos");
			return;
		}

		if (password.length < 8) {
			Alert.alert("Erro", "A senha deve ter no mínimo 8 caracteres");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Erro", "As senhas não coincidem");
			return;
		}

		setIsLoading(true);

		try {
			await authClient.signUp.email({
				email,
				password,
				name,
			});

			Alert.alert(
				"Sucesso",
				"Conta criada com sucesso! Você já pode fazer login.",
				[
					{
						text: "OK",
						onPress: () => router.replace("/(auth)/login"),
					},
				],
			);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Não foi possível criar a conta. Tente novamente.";
			Alert.alert("Erro no Registro", errorMessage);
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
					<View className="items-center mb-8 mt-12">
						<View className="w-24 h-24 rounded-2xl items-center justify-center mb-6">
							<Image
								source={require("@/assets/logo/logo-light.png")}
								className="w-full h-full"
							/>
						</View>
						<Text className="text-3xl font-bold text-gray-800 mb-2">
							Criar Conta
						</Text>
						<Text className="text-gray-500 text-center">
							Preencha os dados para começar
						</Text>
					</View>

					{/* Form */}
					<View className="space-y-4">
						{/* Name Input */}
						<View>
							<Text className="text-sm font-medium text-gray-700 mb-2">
								Nome Completo
							</Text>
							<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
								<Ionicons name="person-outline" size={20} color="#9ca3af" />
								<TextInput
									className="flex-1 ml-3 text-gray-800"
									placeholder="Seu nome completo"
									value={name}
									onChangeText={setName}
									autoCapitalize="words"
									autoComplete="name"
								/>
							</View>
						</View>

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
									placeholder="Mínimo 8 caracteres"
									value={password}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
									autoCapitalize="none"
									autoComplete="password-new"
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

						{/* Confirm Password Input */}
						<View>
							<Text className="text-sm font-medium text-gray-700 mb-2">
								Confirmar Senha
							</Text>
							<View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
								<Ionicons
									name="lock-closed-outline"
									size={20}
									color="#9ca3af"
								/>
								<TextInput
									className="flex-1 ml-3 text-gray-800"
									placeholder="Confirme sua senha"
									value={confirmPassword}
									onChangeText={setConfirmPassword}
									secureTextEntry={!showConfirmPassword}
									autoCapitalize="none"
									autoComplete="password-new"
								/>
								<TouchableOpacity
									onPress={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									<Ionicons
										name={
											showConfirmPassword ? "eye-outline" : "eye-off-outline"
										}
										size={20}
										color="#9ca3af"
									/>
								</TouchableOpacity>
							</View>
						</View>

						{/* Terms and Conditions */}
						<View className="flex-row items-start mt-4">
							<View className="w-5 h-5 border-2 border-gray-300 rounded mt-0.5 mr-3" />
							<Text className="flex-1 text-sm text-gray-600">
								Eu aceito os{" "}
								<TouchableOpacity onPress={() => setShowTermsModal(true)}>
									<Text className="text-orange-500 font-medium">
										Termos de Uso
									</Text>
								</TouchableOpacity>{" "}
								e a{" "}
								<TouchableOpacity onPress={() => setShowPrivacyModal(true)}>
									<Text className="text-orange-500 font-medium">
										Política de Privacidade
									</Text>
								</TouchableOpacity>
							</Text>
						</View>

						{/* Register Button */}
						<TouchableOpacity
							onPress={handleRegister}
							disabled={isLoading}
							className={`bg-orange-500 py-4 rounded-xl mt-6 ${isLoading ? "opacity-50" : ""}`}
						>
							<Text className="text-white text-center text-lg font-bold">
								{isLoading ? "Criando conta..." : "Criar Conta"}
							</Text>
						</TouchableOpacity>

						{/* Divider */}
						<View className="flex-row items-center my-6">
							<View className="flex-1 h-px bg-gray-300" />
							<Text className="mx-4 text-gray-500">ou cadastre-se com</Text>
							<View className="flex-1 h-px bg-gray-300" />
						</View>

						{/* Social Register */}
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

						{/* Login Link */}
						<View className="flex-row justify-center mt-6 mb-8">
							<Text className="text-gray-600">Já tem uma conta? </Text>
							<TouchableOpacity onPress={() => router.push("/(auth)/login")}>
								<Text className="text-orange-500 font-semibold">Entrar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ScrollView>

			{/* Terms of Service Modal */}
			<Modal
				visible={showTermsModal}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setShowTermsModal(false)}
			>
				<View className="flex-1 bg-white">
					<View className="flex-row items-center justify-between p-4 border-b border-gray-200">
						<Text className="text-xl font-bold text-gray-800">
							Terms of Service
						</Text>
						<TouchableOpacity onPress={() => setShowTermsModal(false)}>
							<Ionicons name="close" size={24} color="#374151" />
						</TouchableOpacity>
					</View>
					<ScrollView className="flex-1 p-6">
						<Text className="text-sm text-gray-600 mb-4">
							Last updated: {new Date().toLocaleDateString("en-US")}
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							1. Acceptance of Terms
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							By accessing and using Upcraft Crew, you accept and agree to be
							bound by the terms and provision of this agreement.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							2. Use License
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							Permission is granted to temporarily use Upcraft Crew for personal
							or commercial construction project management purposes. This is the
							grant of a license, not a transfer of title.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							3. User Account
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							You are responsible for maintaining the confidentiality of your
							account and password. You agree to accept responsibility for all
							activities that occur under your account.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							4. Service Availability
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							We strive to provide continuous service availability but do not
							guarantee uninterrupted access. We reserve the right to modify or
							discontinue the service at any time.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							5. Intellectual Property
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							All content, features, and functionality of Upcraft Crew are owned
							by us and are protected by international copyright, trademark, and
							other intellectual property laws.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							6. Limitation of Liability
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							Upcraft Crew shall not be liable for any indirect, incidental,
							special, consequential, or punitive damages resulting from your use
							or inability to use the service.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							7. Changes to Terms
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							We reserve the right to modify these terms at any time. Continued
							use of the service after changes constitutes acceptance of the new
							terms.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							8. Contact Information
						</Text>
						<Text className="text-sm text-gray-600 mb-6">
							For questions about these Terms of Service, please contact us
							through the app support section.
						</Text>
					</ScrollView>
				</View>
			</Modal>

			{/* Privacy Policy Modal */}
			<Modal
				visible={showPrivacyModal}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => setShowPrivacyModal(false)}
			>
				<View className="flex-1 bg-white">
					<View className="flex-row items-center justify-between p-4 border-b border-gray-200">
						<Text className="text-xl font-bold text-gray-800">
							Privacy Policy
						</Text>
						<TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
							<Ionicons name="close" size={24} color="#374151" />
						</TouchableOpacity>
					</View>
					<ScrollView className="flex-1 p-6">
						<Text className="text-sm text-gray-600 mb-4">
							Last updated: {new Date().toLocaleDateString("en-US")}
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							1. Information We Collect
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							We collect information you provide directly to us, including name,
							email address, and project-related data. We also collect usage
							information and device data to improve our services.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							2. How We Use Your Information
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							Your information is used to provide and maintain our services,
							improve user experience, communicate with you about updates, and
							ensure platform security.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							3. Data Security
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							We implement appropriate technical and organizational measures to
							protect your personal information. However, no method of
							transmission over the internet is 100% secure.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							4. Data Sharing
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							We do not sell your personal information. We may share data with
							service providers who assist in operating our platform, subject to
							confidentiality agreements.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							5. Your Rights
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							You have the right to access, correct, or delete your personal
							information. You may also request data portability or object to
							certain data processing activities.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							6. Cookies and Tracking
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							We use cookies and similar tracking technologies to track activity
							and store certain information to improve your experience and
							analyze usage patterns.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							7. Data Retention
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							We retain your information for as long as necessary to provide our
							services and comply with legal obligations. You may request
							deletion of your account at any time.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							8. Changes to Privacy Policy
						</Text>
						<Text className="text-sm text-gray-600 mb-4">
							We may update this Privacy Policy periodically. We will notify you
							of any material changes through the app or via email.
						</Text>

						<Text className="text-base font-semibold text-gray-800 mb-2">
							9. Contact Us
						</Text>
						<Text className="text-sm text-gray-600 mb-6">
							If you have questions about this Privacy Policy, please contact us
							through the app support section.
						</Text>
					</ScrollView>
				</View>
			</Modal>
		</KeyboardAvoidingView>
	);
}
