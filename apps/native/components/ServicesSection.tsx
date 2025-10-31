import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ServicesSection() {
  const services = [
    {
      icon: "web",
      title: "Desenvolvimento Web",
      description:
        "Criamos sites e aplicações web modernas, responsivas e otimizadas para performance.",
      features: [
        "React/Next.js",
        "E-commerce",
        "Sistemas personalizados",
        "SEO otimizado",
      ],
      price: "A partir de R$ 2.500",
    },
    {
      icon: "design-services",
      title: "UI/UX Design",
      description:
        "Desenhamos experiências digitais intuitivas e envolventes que convertem usuários.",
      features: [
        "Design System",
        "Protótipos interativos",
        "Pesquisa de usuário",
        "Testes de usabilidade",
      ],
      price: "A partir de R$ 1.800",
    },
    {
      icon: "trending-up",
      title: "Consultoria em Vendas",
      description:
        "Estratégias personalizadas para alavancar suas vendas e otimizar processos comerciais.",
      features: [
        "Funil de vendas",
        "Automação comercial",
        "Treinamento de equipe",
        "CRM personalizado",
      ],
      price: "A partir de R$ 3.000",
    },
    {
      icon: "campaign",
      title: "Marketing Digital",
      description:
        "Campanhas estratégicas para aumentar sua presença digital e gerar mais leads.",
      features: ["Google Ads", "Social Media", "Email Marketing", "Analytics"],
      price: "A partir de R$ 1.500",
    },
    {
      icon: "phone-iphone",
      title: "Aplicativos Mobile",
      description:
        "Aplicativos nativos e híbridos para iOS e Android com excelente experiência do usuário.",
      features: ["React Native", "Flutter", "PWA", "Publicação nas Stores"],
      price: "A partir de R$ 4.500",
    },
    {
      icon: "support-agent",
      title: "Suporte Técnico",
      description:
        "Manutenção, atualizações e suporte contínuo para manter seus sistemas funcionando.",
      features: [
        "Monitoramento 24/7",
        "Backup automático",
        "Atualizações",
        "Suporte prioritário",
      ],
      price: "A partir de R$ 800/mês",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 py-8">
        {/* Section Header */}
        <View className="mb-8 items-center">
          <View className="mb-4 px-4 py-2 bg-card/50 rounded-full border border-border/20 flex-row items-center">
            <MaterialIcons name="flash-on" size={16} color="#7C3AED" />
            <Text className="text-sm text-foreground ml-2">
              Nossos Serviços
            </Text>
          </View>

          <Text className="text-3xl font-bold text-center text-foreground mb-2">
            Soluções <Text className="text-primary">Completas</Text>
          </Text>

          <Text className="text-center text-muted-foreground leading-relaxed max-w-sm">
            Oferecemos uma gama completa de serviços digitais para impulsionar
            seu negócio ao próximo nível
          </Text>
        </View>

        {/* Services Grid */}
        <View className="space-y-6">
          {services.map((service, index) => (
            <View
              key={index}
              className="p-6 bg-card rounded-xl border border-border"
            >
              {/* Service Header */}
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
                  <MaterialIcons
                    name={service.icon as any}
                    size={24}
                    color="#7C3AED"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    {service.title}
                  </Text>
                  <Text className="text-primary font-medium text-sm">
                    {service.price}
                  </Text>
                </View>
              </View>

              {/* Service Description */}
              <Text className="text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </Text>

              {/* Service Features */}
              <View className="mb-6">
                <Text className="text-foreground font-medium mb-3">
                  Incluído no serviço:
                </Text>
                <View className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <View key={featureIndex} className="flex-row items-center">
                      <MaterialIcons
                        name="check-circle"
                        size={16}
                        color="#10B981"
                      />
                      <Text className="text-muted-foreground text-sm ml-2">
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* CTA Button */}
              <TouchableOpacity className="bg-primary/10 border border-primary/20 rounded-lg py-3 items-center">
                <Text className="text-primary font-medium">
                  Solicitar Orçamento
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Process Section */}
        <View className="mt-12">
          <Text className="text-2xl font-bold text-center text-foreground mb-8">
            Nosso Processo
          </Text>

          <View className="space-y-6">
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-4">
                <Text className="text-white font-bold text-sm">1</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-2">
                  Descoberta e Planejamento
                </Text>
                <Text className="text-muted-foreground text-sm">
                  Entendemos seu negócio e definimos estratégias personalizadas
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-4">
                <Text className="text-white font-bold text-sm">2</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-2">
                  Desenvolvimento e Design
                </Text>
                <Text className="text-muted-foreground text-sm">
                  Criamos soluções com foco na experiência do usuário
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-4">
                <Text className="text-white font-bold text-sm">3</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-2">
                  Testes e Otimização
                </Text>
                <Text className="text-muted-foreground text-sm">
                  Garantimos qualidade através de testes rigorosos
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-primary rounded-full items-center justify-center mr-4">
                <Text className="text-white font-bold text-sm">4</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-foreground mb-2">
                  Lançamento e Suporte
                </Text>
                <Text className="text-muted-foreground text-sm">
                  Acompanhamos o lançamento e oferecemos suporte contínuo
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
