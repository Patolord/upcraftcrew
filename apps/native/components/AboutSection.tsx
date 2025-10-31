import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function AboutSection() {
  const stats = [
    { icon: "work", value: "100+", label: "Projetos Entregues" },
    { icon: "group", value: "50+", label: "Clientes Satisfeitos" },
    { icon: "star", value: "99%", label: "Taxa de Satisfação" },
    { icon: "schedule", value: "5+", label: "Anos de Experiência" },
  ];

  const team = [
    {
      name: "João Silva",
      role: "CEO & Desenvolvedor Full Stack",
      description: "8+ anos criando soluções digitais inovadoras",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Maria Santos",
      role: "UI/UX Designer",
      description: "Especialista em experiência do usuário e design",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Pedro Costa",
      role: "Consultor de Vendas",
      description: "Estratégias que geram resultados reais",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 py-8">
        {/* Section Header */}
        <View className="mb-8 items-center">
          <View className="mb-4 px-4 py-2 bg-card/50 rounded-full border border-border/20 flex-row items-center">
            <MaterialIcons name="people" size={16} color="#7C3AED" />
            <Text className="text-sm text-foreground ml-2">Sobre Nós</Text>
          </View>

          <Text className="text-3xl font-bold text-center text-foreground mb-2">
            Uma Equipe <Text className="text-primary">Apaixonada</Text>
          </Text>

          <Text className="text-center text-muted-foreground leading-relaxed max-w-sm">
            Somos especialistas em transformar ideias em realidade digital.
            Nossa missão é impulsionar negócios através de soluções tecnológicas
            inovadoras e estratégias eficazes.
          </Text>
        </View>

        {/* Company Story */}
        <View className="mb-12 p-6 bg-card rounded-xl border border-border">
          <Text className="text-xl font-semibold text-foreground mb-4">
            Nossa História
          </Text>
          <Text className="text-muted-foreground leading-relaxed mb-4">
            Fundada em 2019, a TechFlow nasceu da visão de democratizar a
            tecnologia e torná-la acessível para empresas de todos os tamanhos.
          </Text>
          <Text className="text-muted-foreground leading-relaxed">
            Hoje, somos uma equipe multidisciplinar apaixonada por criar
            soluções que fazem a diferença na vida das pessoas e no crescimento
            dos negócios.
          </Text>
        </View>

        {/* Stats */}
        <View className="mb-12">
          <Text className="text-xl font-semibold text-foreground mb-6 text-center">
            Números que Falam
          </Text>
          <View className="flex-row flex-wrap justify-center">
            {stats.map((stat, index) => (
              <View key={index} className="w-1/2 mb-6 items-center">
                <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-3">
                  <MaterialIcons
                    name={stat.icon as any}
                    size={28}
                    color="#7C3AED"
                  />
                </View>
                <Text className="text-2xl font-bold text-primary mb-1">
                  {stat.value}
                </Text>
                <Text className="text-muted-foreground text-center text-sm">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View>
          <Text className="text-xl font-semibold text-foreground mb-6 text-center">
            Conheça Nossa Equipe
          </Text>
          {team.map((member, index) => (
            <View
              key={index}
              className="mb-6 p-6 bg-card rounded-xl border border-border flex-row"
            >
              <Image
                source={{ uri: member.avatar }}
                className="w-16 h-16 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  {member.name}
                </Text>
                <Text className="text-primary text-sm mb-2">{member.role}</Text>
                <Text className="text-muted-foreground text-sm leading-relaxed">
                  {member.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mission & Values */}
        <View className="mt-8">
          <Text className="text-xl font-semibold text-foreground mb-6 text-center">
            Nossos Valores
          </Text>
          <View className="space-y-4">
            <View className="p-4 bg-card rounded-lg border border-border">
              <Text className="font-semibold text-foreground mb-2">
                🚀 Inovação
              </Text>
              <Text className="text-muted-foreground text-sm">
                Sempre em busca das melhores tecnologias e práticas
              </Text>
            </View>
            <View className="p-4 bg-card rounded-lg border border-border">
              <Text className="font-semibold text-foreground mb-2">
                🎯 Excelência
              </Text>
              <Text className="text-muted-foreground text-sm">
                Comprometidos com a qualidade em cada projeto
              </Text>
            </View>
            <View className="p-4 bg-card rounded-lg border border-border">
              <Text className="font-semibold text-foreground mb-2">
                🤝 Transparência
              </Text>
              <Text className="text-muted-foreground text-sm">
                Comunicação clara e honesta com nossos clientes
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
