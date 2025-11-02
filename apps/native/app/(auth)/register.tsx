import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    // TODO: Implementar lógica de registro
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(app)/dashboard");
    }, 1000);
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
            <Image source={require("@/assets/logo/logo-light.png")} className="w-full h-full" />
            </View>
            <Text className="text-3xl font-bold text-gray-800 mb-2">Criar Conta</Text>
            <Text className="text-gray-500 text-center">
              Preencha os dados para começar
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Nome Completo</Text>
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
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
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
              <Text className="text-sm font-medium text-gray-700 mb-2">Senha</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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
              <Text className="text-sm font-medium text-gray-700 mb-2">Confirmar Senha</Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Confirme sua senha"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
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
                <Text className="text-orange-500 font-medium">Termos de Uso</Text>
                {" "}e a{" "}
                <Text className="text-orange-500 font-medium">Política de Privacidade</Text>
              </Text>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className={`bg-orange-500 py-4 rounded-xl mt-6 ${isLoading ? 'opacity-50' : ''}`}
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
    </KeyboardAvoidingView>
  );
}
