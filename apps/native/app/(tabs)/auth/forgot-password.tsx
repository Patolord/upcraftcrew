import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSendResetLink = () => {
    // TODO: Implement forgot password logic
    console.log("Send reset link to:", email);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Header */}
        <View className="items-center mt-12 mb-8">
          <Text className="text-3xl font-bold text-gray-800">Forgot Password</Text>
          <Text className="text-gray-500 mt-2 text-center">
            Seamless Access, Secure Connection: Your Gateway to a Personalized Experience
          </Text>
        </View>

        {/* Email Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email Address</Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Ionicons name="mail-outline" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-800"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Terms Checkbox */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => setAgreeTerms(!agreeTerms)}
            className="mr-3"
          >
            <View className={`w-5 h-5 rounded border-2 items-center justify-center ${
              agreeTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
            }`}>
              {agreeTerms && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
          </TouchableOpacity>
          <Text className="text-sm text-gray-600">
            I agree with{" "}
            <Text className="text-blue-600">terms and conditions</Text>
          </Text>
        </View>

        {/* Send Reset Link Button */}
        <TouchableOpacity
          onPress={handleSendResetLink}
          className="bg-blue-600 py-4 rounded-lg flex-row items-center justify-center mb-4"
          disabled={!agreeTerms}
        >
          <Ionicons name="mail-open-outline" size={20} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">Send a reset link</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-gray-600">I have already to </Text>
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
