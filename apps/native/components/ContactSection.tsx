import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const services = [
    "Desenvolvimento Web",
    "UI/UX Design",
    "Aplicativo Mobile",
    "Consultoria em Vendas",
    "Marketing Digital",
    "Suporte Técnico",
    "Outro",
  ];

  const contactInfo = [
    {
      icon: "email",
      title: "Email",
      subtitle: "Envie-nos uma mensagem",
      info: "contato@techflow.com.br",
      action: () => Linking.openURL("mailto:contato@techflow.com.br"),
    },
    {
      icon: "phone",
      title: "Telefone",
      subtitle: "Ligue para nós",
      info: "+55 (11) 99999-9999",
      action: () => Linking.openURL("tel:+5511999999999"),
    },
    {
      icon: "location-on",
      title: "Endereço",
      subtitle: "Venha nos visitar",
      info: "São Paulo, SP - Brasil",
      action: () => Linking.openURL("https://maps.google.com/?q=São Paulo, SP"),
    },
    {
      icon: "access-time",
      title: "Horário",
      subtitle: "Seg - Sex",
      info: "9h às 18h",
      action: null,
    },
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Simulate form submission
    Alert.alert(
      "Sucesso!",
      "Mensagem enviada com sucesso! Entraremos em contato em breve.",
      [
        {
          text: "OK",
          onPress: () => {
            setFormData({
              name: "",
              email: "",
              phone: "",
              service: "",
              message: "",
            });
          },
        },
      ]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 py-8">
        {/* Section Header */}
        <View className="mb-8 items-center">
          <View className="mb-4 px-4 py-2 bg-card/50 rounded-full border border-border/20 flex-row items-center">
            <MaterialIcons name="contact-mail" size={16} color="#7C3AED" />
            <Text className="text-sm text-foreground ml-2">
              Entre em Contato
            </Text>
          </View>

          <Text className="text-3xl font-bold text-center text-foreground mb-2">
            Vamos Criar Algo <Text className="text-primary">Incrível</Text>
          </Text>

          <Text className="text-center text-muted-foreground leading-relaxed max-w-sm">
            Pronto para transformar sua ideia em realidade? Entre em contato e
            vamos discutir como podemos impulsionar seu negócio.
          </Text>
        </View>

        {/* Contact Cards */}
        <View className="mb-8">
          <View className="space-y-4">
            {contactInfo.map((contact, index) => (
              <TouchableOpacity
                key={index}
                onPress={contact.action || undefined}
                className="p-4 bg-card rounded-xl border border-border flex-row items-center"
                disabled={!contact.action}
              >
                <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-4">
                  <MaterialIcons
                    name={contact.icon as any}
                    size={24}
                    color="#7C3AED"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    {contact.title}
                  </Text>
                  <Text className="text-muted-foreground text-sm mb-1">
                    {contact.subtitle}
                  </Text>
                  <Text className="text-primary font-medium">
                    {contact.info}
                  </Text>
                </View>
                {contact.action && (
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={16}
                    color="#9CA3AF"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View className="mb-8">
          <Text className="text-xl font-semibold text-foreground mb-6">
            Envie sua Mensagem
          </Text>

          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text className="text-foreground font-medium mb-2">Nome *</Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => updateFormData("name", text)}
                placeholder="Seu nome completo"
                className="p-4 bg-card border border-border rounded-lg text-foreground"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-foreground font-medium mb-2">Email *</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => updateFormData("email", text)}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="p-4 bg-card border border-border rounded-lg text-foreground"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Phone Input */}
            <View>
              <Text className="text-foreground font-medium mb-2">Telefone</Text>
              <TextInput
                value={formData.phone}
                onChangeText={(text) => updateFormData("phone", text)}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                className="p-4 bg-card border border-border rounded-lg text-foreground"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Service Selection */}
            <View>
              <Text className="text-foreground font-medium mb-2">
                Serviço de Interesse
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row space-x-2">
                  {services.map((service, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => updateFormData("service", service)}
                      className={`px-4 py-2 rounded-full border ${
                        formData.service === service
                          ? "bg-primary border-primary"
                          : "bg-card border-border"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          formData.service === service
                            ? "text-white"
                            : "text-foreground"
                        }`}
                      >
                        {service}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Message Input */}
            <View>
              <Text className="text-foreground font-medium mb-2">
                Mensagem *
              </Text>
              <TextInput
                value={formData.message}
                onChangeText={(text) => updateFormData("message", text)}
                placeholder="Conte-nos sobre seu projeto..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="p-4 bg-card border border-border rounded-lg text-foreground min-h-24"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-primary rounded-lg py-4 items-center flex-row justify-center"
            >
              <MaterialIcons name="send" size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold text-lg ml-2">
                Enviar Mensagem
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Links */}
        <View className="items-center">
          <Text className="text-foreground font-medium mb-4">
            Ou nos siga nas redes sociais
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              className="w-12 h-12 bg-card border border-border rounded-full items-center justify-center"
              onPress={() =>
                Linking.openURL("https://linkedin.com/company/techflow")
              }
            >
              <MaterialIcons name="work" size={24} color="#0077B5" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-12 h-12 bg-card border border-border rounded-full items-center justify-center"
              onPress={() => Linking.openURL("https://instagram.com/techflow")}
            >
              <MaterialIcons name="camera-alt" size={24} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-12 h-12 bg-card border border-border rounded-full items-center justify-center"
              onPress={() => Linking.openURL("https://github.com/techflow")}
            >
              <MaterialIcons name="code" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-12 h-12 bg-card border border-border rounded-full items-center justify-center"
              onPress={() => Linking.openURL("https://wa.me/5511999999999")}
            >
              <MaterialIcons name="chat" size={24} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
