import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "Todos", icon: "apps" },
    { id: "web", label: "Web", icon: "web" },
    { id: "mobile", label: "Mobile", icon: "phone-iphone" },
    { id: "design", label: "Design", icon: "brush" },
  ];

  const projects = [
    {
      id: 1,
      title: "E-commerce Moderno",
      category: "web",
      type: "E-commerce",
      description:
        "Loja virtual completa com sistema de pagamentos integrado e dashboard administrativo.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "Stripe", "MongoDB"],
      results: "+300% conversões",
    },
    {
      id: 2,
      title: "App Banking Redesign",
      category: "design",
      type: "UI/UX Design",
      description:
        "Redesign completo de aplicativo bancário focado em experiência do usuário e acessibilidade.",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      technologies: ["Figma", "Design System", "Prototyping", "User Research"],
      results: "95% satisfação usuários",
    },
    {
      id: 3,
      title: "SaaS Dashboard",
      category: "web",
      type: "Aplicativo Web",
      description:
        "Dashboard analytics para SaaS com visualizações em tempo real e relatórios personalizados.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      technologies: ["Vue.js", "D3.js", "WebSocket", "PostgreSQL"],
      results: "40% redução churn",
    },
    {
      id: 4,
      title: "App Delivery Food",
      category: "mobile",
      type: "Aplicativo Mobile",
      description:
        "Aplicativo de delivery com geolocalização, pagamentos e sistema de avaliações.",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
      technologies: [
        "React Native",
        "Firebase",
        "Maps API",
        "Push Notifications",
      ],
      results: "10K+ downloads",
    },
    {
      id: 5,
      title: "Brand Identity Sistema",
      category: "design",
      type: "Branding",
      description:
        "Identidade visual completa com manual de marca e aplicações digitais.",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      technologies: ["Illustrator", "Photoshop", "After Effects", "Figma"],
      results: "+200% reconhecimento",
    },
    {
      id: 6,
      title: "E-learning Platform",
      category: "web",
      type: "Educação",
      description:
        "Plataforma de ensino online com videoaulas, exercícios e acompanhamento de progresso.",
      image:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
      technologies: ["Next.js", "Prisma", "Stripe", "AWS"],
      results: "5K+ alunos ativos",
    },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 py-8">
        {/* Section Header */}
        <View className="mb-8 items-center">
          <View className="mb-4 px-4 py-2 bg-card/50 rounded-full border border-border/20 flex-row items-center">
            <MaterialIcons name="work" size={16} color="#7C3AED" />
            <Text className="text-sm text-foreground ml-2">
              Nosso Portfólio
            </Text>
          </View>

          <Text className="text-3xl font-bold text-center text-foreground mb-2">
            Projetos que <Text className="text-primary">Transformam</Text>
          </Text>

          <Text className="text-center text-muted-foreground leading-relaxed max-w-sm">
            Cada projeto é uma história de sucesso. Veja como ajudamos nossos
            clientes a alcançar resultados extraordinários.
          </Text>
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-8"
        >
          <View className="flex-row space-x-3 px-1">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full border ${
                  activeFilter === filter.id
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                } flex-row items-center`}
              >
                <MaterialIcons
                  name={filter.icon as any}
                  size={16}
                  color={activeFilter === filter.id ? "#FFFFFF" : "#7C3AED"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    activeFilter === filter.id
                      ? "text-white"
                      : "text-foreground"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Projects Grid */}
        <View className="space-y-6">
          {filteredProjects.map((project, index) => (
            <View
              key={project.id}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              {/* Project Image */}
              <View className="relative">
                <Image
                  source={{ uri: project.image }}
                  style={{ width: "100%", height: 200 }}
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/40 justify-end p-4">
                  <View className="bg-primary/90 self-start px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-medium">
                      {project.type}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Project Info */}
              <View className="p-6">
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-xl font-semibold text-foreground mb-1">
                      {project.title}
                    </Text>
                    <Text className="text-primary text-sm font-medium">
                      {project.results}
                    </Text>
                  </View>
                  <TouchableOpacity className="ml-4 w-8 h-8 bg-primary/10 rounded-full items-center justify-center">
                    <MaterialIcons
                      name="arrow-outward"
                      size={16}
                      color="#7C3AED"
                    />
                  </TouchableOpacity>
                </View>

                <Text className="text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </Text>

                {/* Technologies */}
                <View className="mb-4">
                  <Text className="text-foreground font-medium mb-2">
                    Tecnologias:
                  </Text>
                  <View className="flex-row flex-wrap">
                    {project.technologies.map((tech, techIndex) => (
                      <View
                        key={techIndex}
                        className="bg-primary/10 px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-primary text-xs">{tech}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row space-x-3">
                  <TouchableOpacity className="flex-1 bg-primary rounded-lg py-3 items-center">
                    <Text className="text-white font-medium">Ver Projeto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="px-4 border border-border rounded-lg py-3 items-center">
                    <MaterialIcons name="share" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <View className="mt-12 p-6 bg-card rounded-xl border border-border items-center">
          <Text className="text-xl font-semibold text-foreground mb-2 text-center">
            Gostou do que viu?
          </Text>
          <Text className="text-muted-foreground mb-6 text-center">
            Vamos criar algo incrível juntos!
          </Text>
          <TouchableOpacity className="bg-primary px-8 py-3 rounded-lg">
            <Text className="text-white font-medium">Iniciar Projeto</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
