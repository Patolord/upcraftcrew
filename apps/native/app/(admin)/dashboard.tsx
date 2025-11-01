import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useState } from "react";

export default function DashboardPage() {
  const [refreshing, setRefreshing] = useState(false);

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
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
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
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4 space-y-4">
        {/* Stats Cards */}
        <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>

        <View className="flex-row flex-wrap gap-3">
          <View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
            <Text className="text-sm text-gray-500">Active Projects</Text>
            <Text className="text-3xl font-bold text-blue-600 mt-1">{activeProjects}</Text>
            <Text className="text-xs text-gray-400 mt-1">of {projects?.length || 0} total</Text>
          </View>

          <View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
            <Text className="text-sm text-gray-500">Online Members</Text>
            <Text className="text-3xl font-bold text-green-600 mt-1">{onlineMembers}</Text>
            <Text className="text-xs text-gray-400 mt-1">of {teamMembers?.length || 0} total</Text>
          </View>

          <View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
            <Text className="text-sm text-gray-500">Total Revenue</Text>
            <Text className="text-3xl font-bold text-purple-600 mt-1">
              ${totalIncome.toLocaleString()}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">completed transactions</Text>
          </View>

          <View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
            <Text className="text-sm text-gray-500">Net Profit</Text>
            <Text className={`text-3xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">
              {totalExpenses > 0 ? `${Math.round((netProfit/totalIncome) * 100)}% margin` : 'no expenses'}
            </Text>
          </View>
        </View>

        {/* Recent Projects */}
        <View className="bg-white p-4 rounded-lg shadow mt-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Recent Projects</Text>
          {projects?.slice(0, 5).map((project, index) => (
            <View key={project._id} className={`py-3 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">{project.name}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{project.client}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-medium text-blue-600">{project.progress}%</Text>
                  <View className={`px-2 py-1 rounded mt-1 ${
                    project.status === 'completed' ? 'bg-green-100' :
                    project.status === 'in-progress' ? 'bg-blue-100' :
                    project.status === 'planning' ? 'bg-yellow-100' :
                    project.status === 'on-hold' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <Text className={`text-xs ${
                      project.status === 'completed' ? 'text-green-700' :
                      project.status === 'in-progress' ? 'text-blue-700' :
                      project.status === 'planning' ? 'text-yellow-700' :
                      project.status === 'on-hold' ? 'text-orange-700' : 'text-gray-700'
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
          <Text className="text-lg font-semibold text-gray-800 mb-3">Team Overview</Text>
          {teamMembers?.slice(0, 5).map((member, index) => (
            <View key={member._id} className={`flex-row items-center py-3 ${index !== 0 ? 'border-t border-gray-100' : ''}`}>
              <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                <Text className="text-blue-600 font-semibold">
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
      </View>
    </ScrollView>
  );
}