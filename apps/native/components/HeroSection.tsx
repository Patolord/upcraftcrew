import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function HeroSection() {
  const scrollToSection = () => {
    // Navigation will be handled by tabs in React Native
    console.log("Navigate to services");
  };

  return (
    <View className="flex-1 bg-background justify-center items-center px-6 relative">
      {/* Background animated elements */}
      <View className="absolute inset-0 opacity-30">
        <View
          className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full"
          style={{
            shadowColor: "#7C3AED",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
          }}
        />
        <View
          className="absolute top-40 right-8 w-24 h-24 bg-accent/20 rounded-full"
          style={{
            shadowColor: "#F59E0B",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
          }}
        />
        <View
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary/20 rounded-full"
          style={{
            shadowColor: "#7C3AED",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 25,
          }}
        />
      </View>

      {/* Main Content */}
      <View className="z-10 items-center">
        {/* Badge */}
        <View className="mb-6 px-4 py-2 bg-card/50 rounded-full border border-border/20 flex-row items-center">
          <MaterialIcons name="code" size={16} color="#7C3AED" />
          <Text className="text-sm text-foreground ml-2">
            Transformando Ideias em Realidade
          </Text>
        </View>

        {/* Main Title */}
        <View className="mb-6 items-center">
          <Text className="text-4xl md:text-6xl font-bold text-center text-foreground mb-2">
            Soluções
          </Text>
          <LinearGradient
            colors={["#7C3AED", "#9333EA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text className="text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text px-1">
              Digitais
            </Text>
          </LinearGradient>
          <Text className="text-4xl md:text-6xl font-bold text-center text-foreground">
            Completas
          </Text>
        </View>

        {/* Subtitle */}
        <Text className="text-lg text-center text-muted-foreground mb-8 max-w-md leading-relaxed">
          Criamos experiências digitais extraordinárias que conectam marcas e
          pessoas, impulsionando resultados através de inovação e tecnologia.
        </Text>

        {/* CTA Buttons */}
        <View className="flex-row space-x-4 items-center mb-8">
          <TouchableOpacity onPress={scrollToSection}>
            <LinearGradient
              colors={["#7C3AED", "#9333EA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="px-8 py-4 rounded-lg"
            >
              <Text className="text-white font-semibold text-lg">
                Conhecer Serviços
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity className="px-6 py-4 border border-border rounded-lg bg-card">
            <Text className="text-foreground font-medium">Ver Portfólio</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-center items-center space-x-8 mt-8">
          <View className="items-center">
            <Text className="text-3xl font-bold text-primary">+100</Text>
            <Text className="text-muted-foreground text-sm">Projetos</Text>
          </View>
          <View className="w-px h-12 bg-border" />
          <View className="items-center">
            <Text className="text-3xl font-bold text-primary">+50</Text>
            <Text className="text-muted-foreground text-sm">Clientes</Text>
          </View>
          <View className="w-px h-12 bg-border" />
          <View className="items-center">
            <Text className="text-3xl font-bold text-primary">5+</Text>
            <Text className="text-muted-foreground text-sm">Anos</Text>
          </View>
        </View>
      </View>

      {/* Scroll Indicator */}
      <View className="absolute bottom-8 items-center">
        <MaterialIcons name="keyboard-arrow-down" size={24} color="#9CA3AF" />
        <Text className="text-muted-foreground text-xs mt-1">
          Deslize para baixo
        </Text>
      </View>
    </View>
  );
}
