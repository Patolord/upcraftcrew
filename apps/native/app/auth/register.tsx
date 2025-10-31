import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = () => {
    // TODO: Implement register logic with Convex
    console.log("Register:", { firstName, lastName, username, email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1" contentContainerClassName="p-6">
        {/* Header */}
        <View className="items-center mt-12 mb-8">
          <Text className="text-3xl font-bold text-gray-800">Create Account</Text>
          <Text className="text-gray-500 mt-2 text-center">
            Join us today and start managing your projects
          </Text>
        </View>

        {/* Name Fields */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-2">First Name</Text>
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-800"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-700 mb-2">Last Name</Text>
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
              <Ionicons name="person-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-3 text-gray-800"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
        </View>

        {/* Username Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Username</Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Ionicons name="at-outline" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-800"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
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

        {/* Password Field */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
            <Ionicons name="key-outline" size={20} color="#6b7280" />
            <TextInput
              className="flex-1 ml-3 text-gray-800"
              placeholder="Password"
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

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          className="bg-blue-600 py-4 rounded-lg flex-row items-center justify-center mb-4"
          disabled={!agreeTerms}
        >
          <Ionicons name="person-add-outline" size={20} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">Register</Text>
        </TouchableOpacity>

        {/* Google Register */}
        <TouchableOpacity className="bg-white border border-gray-300 py-4 rounded-lg flex-row items-center justify-center mb-4">
          <Ionicons name="logo-google" size={20} color="#4285f4" />
          <Text className="text-gray-700 font-semibold text-lg ml-2">Register with Google</Text>
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
