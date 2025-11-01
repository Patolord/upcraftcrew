import { View, Text, ScrollView, ActivityIndicator, TextInput, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useState, useMemo } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TeamPage() {
  const teamMembers = useQuery(api.team.getTeamMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filteredMembers = useMemo(() => {
    if (!teamMembers) return [];

    return teamMembers.filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "all" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [teamMembers, searchQuery, roleFilter]);

  const stats = useMemo(() => {
    if (!teamMembers) return { total: 0, online: 0, departments: 0, avgProjects: 0 };

    const departments = new Set(teamMembers.map(m => m.department).filter(Boolean));
    const totalProjects = teamMembers.reduce((sum, m) => sum + (m.projects?.length || 0), 0);

    return {
      total: teamMembers.length,
      online: teamMembers.filter(m => m.status === "online").length,
      departments: departments.size,
      avgProjects: teamMembers.length > 0 ? Math.round(totalProjects / teamMembers.length) : 0,
    };
  }, [teamMembers]);

  if (teamMembers === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading team...</Text>
      </View>
    );
  }

  const roleOptions = [
    { label: "All", value: "all" },
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "Developer", value: "developer" },
    { label: "Designer", value: "designer" },
    { label: "Member", value: "member" },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-gray-800">Team</Text>
            <TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
              <Text className="text-white font-semibold">+ Add Member</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Total Members</Text>
              <Text className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Online</Text>
              <Text className="text-2xl font-bold text-green-600 mt-1">{stats.online}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Departments</Text>
              <Text className="text-2xl font-bold text-purple-600 mt-1">{stats.departments}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Avg Projects</Text>
              <Text className="text-2xl font-bold text-blue-600 mt-1">{stats.avgProjects}</Text>
            </View>
          </View>

          {/* Search */}
          <View className="bg-white p-3 rounded-lg shadow flex-row items-center">
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 ml-2 text-gray-800"
              placeholder="Search members..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Role Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {roleOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setRoleFilter(option.value)}
                className={`px-4 py-2 rounded-full ${
                  roleFilter === option.value
                    ? "bg-blue-600"
                    : "bg-white border border-gray-300"
                }`}
              >
                <Text
                  className={`font-medium ${
                    roleFilter === option.value ? "text-white" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Team Members List */}
          <View className="space-y-3">
            {filteredMembers.map((member) => (
              <View key={member._id} className="bg-white p-4 rounded-lg shadow">
                <View className="flex-row items-start">
                  {/* Avatar */}
                  <View className="relative">
                    <View className="w-14 h-14 rounded-full bg-blue-100 items-center justify-center">
                      <Text className="text-blue-600 font-bold text-lg">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </Text>
                    </View>
                    {/* Status Indicator */}
                    <View
                      className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'away' ? 'bg-yellow-500' :
                        member.status === 'busy' ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                    />
                  </View>

                  {/* Member Info */}
                  <View className="flex-1 ml-3">
                    <View className="flex-row justify-between items-start">
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-800">{member.name}</Text>
                        <Text className="text-sm text-gray-500 mt-0.5">{member.email}</Text>
                      </View>
                      <View className={`px-2 py-1 rounded ${
                        member.role === 'owner' ? 'bg-purple-100' :
                        member.role === 'admin' ? 'bg-red-100' :
                        member.role === 'manager' ? 'bg-blue-100' :
                        member.role === 'developer' ? 'bg-green-100' :
                        member.role === 'designer' ? 'bg-pink-100' : 'bg-gray-100'
                      }`}>
                        <Text className={`text-xs font-medium ${
                          member.role === 'owner' ? 'text-purple-700' :
                          member.role === 'admin' ? 'text-red-700' :
                          member.role === 'manager' ? 'text-blue-700' :
                          member.role === 'developer' ? 'text-green-700' :
                          member.role === 'designer' ? 'text-pink-700' : 'text-gray-700'
                        }`}>
                          {member.role}
                        </Text>
                      </View>
                    </View>

                    {/* Department */}
                    <View className="flex-row items-center mt-2">
                      {member.department && (
                        <>
                          <MaterialCommunityIcons name="office-building-outline" size={14} color="#9ca3af" />
                          <Text className="text-xs text-gray-600 ml-1">{member.department}</Text>
                        </>
                      )}
                    </View>

                    {/* Stats */}
                    <View className="flex-row items-center mt-3 gap-4">
                      <View className="flex-row items-center">
                        <Ionicons name="briefcase-outline" size={14} color="#9ca3af" />
                        <Text className="text-xs text-gray-600 ml-1">
                          {member.projects.length || 0} projects
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="checkmark-circle-outline" size={14} color="#9ca3af" />
                        <Text className="text-xs text-gray-600 ml-1">
                          {0 || 0} tasks
                        </Text>
                      </View>
                    </View>

                    {/* Skills */}
                    {member.skills && member.skills.length > 0 && (
                      <View className="flex-row flex-wrap gap-1 mt-3">
                        {member.skills.slice(0, 3).map((skill, idx) => (
                          <View key={idx} className="bg-gray-100 px-2 py-1 rounded">
                            <Text className="text-xs text-gray-600">{skill}</Text>
                          </View>
                        ))}
                        {member.skills.length > 3 && (
                          <View className="bg-gray-100 px-2 py-1 rounded">
                            <Text className="text-xs text-gray-600">+{member.skills.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {filteredMembers.length === 0 && (
            <View className="bg-white p-8 rounded-lg shadow items-center">
              <Ionicons name="people-outline" size={48} color="#d1d5db" />
              <Text className="text-gray-500 mt-4">No team members found</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
