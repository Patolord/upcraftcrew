import { View, Text, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, FlatList } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function ProjectsPage() {
  const projects = useQuery(api.projects.getProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredProjects = useMemo(() => {
    if (!projects) return [];

    return projects.filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.client?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!projects) return { total: 0, active: 0, completed: 0, planning: 0 };

    return {
      total: projects.length,
      active: projects.filter(p => p.status === "in-progress").length,
      completed: projects.filter(p => p.status === "completed").length,
      planning: projects.filter(p => p.status === "planning").length,
    };
  }, [projects]);

  if (projects === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading projects...</Text>
      </View>
    );
  }

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Planning", value: "planning" },
    { label: "In Progress", value: "in-progress" },
    { label: "On Hold", value: "on-hold" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-gray-800">Projects</Text>
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
              <Text className="text-white font-semibold">+ New</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Total</Text>
              <Text className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Active</Text>
              <Text className="text-2xl font-bold text-blue-600 mt-1">{stats.active}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Completed</Text>
              <Text className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Planning</Text>
              <Text className="text-2xl font-bold text-yellow-600 mt-1">{stats.planning}</Text>
            </View>
          </View>

          {/* Search */}
          <View className="bg-white p-3 rounded-lg shadow flex-row items-center">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Search projects..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Status Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setStatusFilter(option.value)}
                className={`px-4 py-2 rounded-full ${
                  statusFilter === option.value
                    ? "bg-blue-600"
                    : "bg-white border border-gray-300"
                }`}
              >
                <Text
                  className={`font-medium ${
                    statusFilter === option.value ? "text-white" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Projects List */}
          <View className="space-y-3">
            {filteredProjects.map((project) => (
              <View key={project._id} className="bg-white p-4 rounded-lg shadow">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">{project.name}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{project.client}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${
                    project.status === 'completed' ? 'bg-green-100' :
                    project.status === 'in-progress' ? 'bg-blue-100' :
                    project.status === 'planning' ? 'bg-yellow-100' :
                    project.status === 'on-hold' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <Text className={`text-xs font-medium ${
                      project.status === 'completed' ? 'text-green-700' :
                      project.status === 'in-progress' ? 'text-blue-700' :
                      project.status === 'planning' ? 'text-yellow-700' :
                      project.status === 'on-hold' ? 'text-orange-700' : 'text-gray-700'
                    }`}>
                      {project.status}
                    </Text>
                  </View>
                </View>

                {project.description && (
                  <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                    {project.description}
                  </Text>
                )}

                {/* Progress Bar */}
                <View className="mb-3">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-xs text-gray-500">Progress</Text>
                    <Text className="text-xs font-semibold text-blue-600">{project.progress}%</Text>
                  </View>
                  <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </View>
                </View>

                {/* Footer */}
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                    <Text className="text-xs text-gray-500 ml-1">
                      {new Date(project.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                  {project.budget && (
                    <Text className="text-sm font-semibold text-gray-700">
                      ${project.budget.toLocaleString()}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {filteredProjects.length === 0 && (
            <View className="bg-white p-8 rounded-lg shadow items-center">
              <Ionicons name="briefcase-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 mt-4">No projects found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
