import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "goals" | "map">("dashboard");

  const projects = useQuery(api.projects.getProjects);
  const teamMembers = useQuery(api.team.getTeamMembers);
  const transactions = useQuery(api.finance.getTransactions);

  const onRefresh = async () => {
    setRefreshing(true);
    // Convex will auto-refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (projects === undefined || teamMembers === undefined || transactions === undefined) {
    return (
      <View className="flex-1 pt-10 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading dashboard...</Text>
      </View>
    );
  }

  // Calculate statistics
  const activeProjects = projects?.filter(p => p.status === "in-progress").length || 0;
  const completedProjects = projects?.filter(p => p.status === "completed").length || 0;
  const onlineMembers = teamMembers?.filter(m => m.status === "online").length || 0;

  const completedTransactions = transactions?.filter(t => t.status === "completed") || [];
  const totalIncome = completedTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = completedTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const averageProgress = projects?.length
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <View className="flex-1 pt-16 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 border-b border-gray-200">
        <Text className="text-3xl font-bold text-orange-500 mb-3">Dashboard</Text>

        {/* Tab Navigation */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => setActiveTab("dashboard")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "dashboard" ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "dashboard" ? "text-white" : "text-gray-700"
              }`}
            >
              Dashboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("goals")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "goals" ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "goals" ? "text-white" : "text-gray-700"
              }`}
            >
              Metas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("map")}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === "map" ? "bg-orange-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "map" ? "text-white" : "text-gray-700"
              }`}
            >
              Mapa
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 space-y-4">
          {activeTab === "dashboard" ? (
            /* Dashboard View */
            <>

        <View className="flex-row flex-wrap gap-3">
          <View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
            <Text className="text-sm text-gray-500">Active Projects</Text>
            <Text className="text-3xl font-bold text-orange-500 mt-1">{activeProjects}</Text>
            <Text className="text-xs text-gray-400 mt-1">of {projects?.length || 0} total</Text>
          </View>

          <View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
            <Text className="text-sm text-gray-500">Total Revenue</Text>
            <Text className="text-3xl font-bold text-orange-500 mt-1">
              ${totalIncome.toLocaleString()}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">completed transactions</Text>
          </View>
        </View>

        {/* Recent Projects */}
        <View className="bg-white p-4 rounded-lg shadow mt-4">
          <Text className="text-lg font-semibold text-orange-500 mb-3">Recent Projects</Text>
          {projects?.slice(0, 5).map((project, index) => (
            <View key={project._id} className={`py-3 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">{project.name}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{project.client}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-medium text-orange-500">{project.progress}%</Text>
                  <View className={`px-2 py-1 rounded mt-1 ${
                    project.status === 'completed' ? 'bg-green-100' :
                    project.status === 'in-progress' ? 'bg-blue-100' :
                    project.status === 'planning' ? 'bg-yellow-100' :'bg-gray-100'
                  }`}>
                    <Text className={`text-xs ${
                      project.status === 'completed' ? 'text-green-700' :
                      project.status === 'in-progress' ? 'text-orange-700' :
                      project.status === 'planning' ? 'text-yellow-700' :'text-gray-700'
                    }`}>
                      {project.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

              {/* Team Overview */}
              <View className="bg-white p-4 rounded-lg shadow mt-4">
                <Text className="text-lg font-semibold text-orange-500 mb-3">Team Overview</Text>
                {teamMembers?.slice(0, 5).map((member, index) => (
                  <View key={member._id} className={`flex-row items-center py-3 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                    <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
                        <Text className="text-orange-500 font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Text>
                    </View>
                    <View className="flex-1 ml-3">
                      <Text className="font-semibold text-gray-800">{member.name}</Text>
                      <Text className="text-xs text-gray-500">{member.role}</Text>
                    </View>
                    <View className={`w-3 h-3 rounded-full ${
                      member.status === 'online' ? 'bg-green-500' :
                      member.status === 'away' ? 'bg-yellow-500' :
                      member.status === 'busy' ? 'bg-red-500' : 'bg-gray-300'
                    }`} />
                  </View>
                ))}
              </View>
            </>
          ) : activeTab === "goals" ? (
            /* Goals View */
            <View className="space-y-4">
              <View className="bg-white p-4 rounded-lg shadow">
                <Text className="text-lg font-semibold text-orange-500 mb-3">Metas da Empresa</Text>

                <View className="space-y-4">
                  <View className="p-4 bg-blue-50 rounded-lg">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-semibold text-gray-800">Receita Anual</Text>
                      <Ionicons name="trophy-outline" size={24} color="#FF5722" />
                    </View>
                    <Text className="text-2xl font-bold text-orange-500 mb-1">
                      ${totalIncome.toLocaleString()} / $500,000
                    </Text>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-orange-500"
                        style={{ width: `${Math.min((totalIncome / 500000) * 100, 100)}%` }}
                      />
                    </View>
                    <Text className="text-xs text-gray-500 mt-2">
                      {Math.round((totalIncome / 500000) * 100)}% concluído
                    </Text>
                  </View>

                  <View className="p-4 bg-green-50 rounded-lg">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-semibold text-gray-800">Projetos Completados</Text>
                      <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
                    </View>
                    <Text className="text-2xl font-bold text-green-600 mb-1">
                      {completedProjects} / 50
                    </Text>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-green-500"
                        style={{ width: `${Math.min((completedProjects / 50) * 100, 100)}%` }}
                      />
                    </View>
                    <Text className="text-xs text-gray-500 mt-2">
                      {Math.round((completedProjects / 50) * 100)}% concluído
                    </Text>
                  </View>

                  <View className="p-4 bg-purple-50 rounded-lg">
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-semibold text-gray-800">Crescimento do Time</Text>
                      <Ionicons name="people-outline" size={24} color="#8B5CF6" />
                    </View>
                    <Text className="text-2xl font-bold text-purple-600 mb-1">
                      {teamMembers?.length || 0} / 20
                    </Text>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-purple-500"
                        style={{ width: `${Math.min(((teamMembers?.length || 0) / 20) * 100, 100)}%` }}
                      />
                    </View>
                    <Text className="text-xs text-gray-500 mt-2">
                      {Math.round(((teamMembers?.length || 0) / 20) * 100)}% concluído
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            /* Map View */
            <View className="space-y-4">
              <View className="bg-white p-4 rounded-lg shadow">
                <Text className="text-lg font-semibold text-orange-500 mb-4">Mapa da Empresa</Text>

                <View className="space-y-3">
                  <View className="border-l-4 border-orange-500 pl-4 py-2">
                    <Text className="font-semibold text-gray-800 mb-1">Missão</Text>
                    <Text className="text-sm text-gray-600">
                      Fornecer soluções inovadoras e de alta qualidade que transformam ideias em realidade digital.
                    </Text>
                  </View>

                  <View className="border-l-4 border-blue-500 pl-4 py-2">
                    <Text className="font-semibold text-gray-800 mb-1">Visão</Text>
                    <Text className="text-sm text-gray-600">
                      Ser reconhecida como referência em desenvolvimento de software, destacando-se pela excelência e inovação.
                    </Text>
                  </View>

                  <View className="border-l-4 border-green-500 pl-4 py-2">
                    <Text className="font-semibold text-gray-800 mb-1">Valores</Text>
                    <View className="space-y-1 mt-2">
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text className="text-sm text-gray-600 ml-2">Inovação contínua</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text className="text-sm text-gray-600 ml-2">Qualidade sem compromissos</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text className="text-sm text-gray-600 ml-2">Trabalho em equipe</Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                        <Text className="text-sm text-gray-600 ml-2">Transparência e ética</Text>
                      </View>
                    </View>
                  </View>

                  <View className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <Text className="font-semibold text-gray-800 mb-3">Estrutura Organizacional</Text>

                    <View className="space-y-3">
                      <View className="bg-white p-3 rounded-lg border border-orange-200">
                        <Text className="font-semibold text-orange-500 mb-1">Diretoria</Text>
                        <Text className="text-xs text-gray-600">Liderança estratégica e visão de negócio</Text>
                      </View>

                      <View className="ml-4 space-y-2">
                        <View className="bg-white p-3 rounded-lg border border-blue-200">
                          <Text className="font-semibold text-blue-500 mb-1">Desenvolvimento</Text>
                          <Text className="text-xs text-gray-600">
                            {teamMembers?.filter(m => m.role.toLowerCase().includes('dev')).length || 0} membros
                          </Text>
                        </View>

                        <View className="bg-white p-3 rounded-lg border border-green-200">
                          <Text className="font-semibold text-green-500 mb-1">Projetos</Text>
                          <Text className="text-xs text-gray-600">
                            {projects?.length || 0} projetos ativos
                          </Text>
                        </View>

                        <View className="bg-white p-3 rounded-lg border border-purple-200">
                          <Text className="font-semibold text-purple-500 mb-1">Administrativo</Text>
                          <Text className="text-xs text-gray-600">
                            {teamMembers?.filter(m => m.role.toLowerCase().includes('admin')).length || 0} membros
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
