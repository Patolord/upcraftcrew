import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gradient-to-br from-orange-500 to-orange-600 items-center justify-center p-8">
      {/* Logo Area */}
      <View className="items-center mb-12">
        {/* Placeholder para logo - substituir com imagem real */}
        <View className="w-64 h-64
        ">
          <Image source={require("@/assets/logo/logo-light.png")} className="w-full h-full" />
        </View>

       
      </View>

   

      {/* CTA Button */}
      <View className="w-full max-w-md">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className=" py-4 rounded-xl  mb-2"
        >
          <Text className="text-white bg-orange-500 rounded-xl p-3 text-center text-lg font-bold">
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          className="border-2 border-orange-500 py-2 rounded-xl"
        >
          <Text className="text-orange-500 bg-white text-center text-sm font-semibold">
            Criar Conta
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="absolute bottom-8">
        <Text className="text-orange-500 text-sm">
          © 2024 UpCraft Crew. Todos os direitos reservados.
        </Text>
      </View>
    </View>
  );
}
