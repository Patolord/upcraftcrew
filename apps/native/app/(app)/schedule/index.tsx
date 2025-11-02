import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "list">("list");

  const currentMonth = selectedDate.getMonth() + 1;
  const currentYear = selectedDate.getFullYear();

  const events = useQuery(api.schedule.getEventsByMonth, {
    month: currentMonth,
    year: currentYear,
  });

  const stats = useMemo(() => {
    if (!events) return { total: 0, meetings: 0, deadlines: 0, tasks: 0 };

    return {
      total: events.length,
      meetings: events.filter(e => e.type === "meeting").length,
      deadlines: events.filter(e => e.type === "deadline").length,
      tasks: events.filter(e => e.type === "task").length,
    };
  }, [events]);

  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const now = Date.now();
    return events
      .filter(e => e.startTime >= now)
      .sort((a, b) => a.startTime - b.startTime);
  }, [events]);

  if (events === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF5722" />
        <Text className="mt-4 text-gray-600">Loading schedule...</Text>
      </View>
    );
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "meeting": return { bg: "bg-orange-100", text: "text-orange-700", icon: "people" };
      case "deadline": return { bg: "bg-orange-100", text: "text-orange-700", icon: "flag" };
      case "task": return { bg: "bg-orange-100", text: "text-orange-700", icon: "checkmark-circle" };
      case "reminder": return { bg: "bg-orange-100", text: "text-orange-700", icon: "alarm" };
      case "milestone": return { bg: "bg-orange-100", text: "text-orange-700", icon: "trophy" };
      default: return { bg: "bg-orange-100", text: "text-orange-700", icon: "calendar" };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          {/* Header */}
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-orange-500">Schedule</Text>
            <TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-lg">
              <Text className="text-white font-semibold">+ New Event</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Total Events</Text>
              <Text className="text-2xl font-bold text-orange-500 mt-1">{stats.total}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Meetings</Text>
              <Text className="text-2xl font-bold text-orange-500 mt-1">{stats.meetings}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Deadlines</Text>
              <Text className="text-2xl font-bold text-orange-500 mt-1">{stats.deadlines}</Text>
            </View>
            <View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
              <Text className="text-xs text-gray-500">Tasks</Text>
              <Text className="text-2xl font-bold text-orange-500 mt-1">{stats.tasks}</Text>
            </View>
          </View>

          {/* Month Navigation */}
          <View className="bg-white p-4 rounded-lg shadow">
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="p-2"
              >
                <Ionicons name="chevron-back" size={24} color="#FF5722" />
              </TouchableOpacity>

              <Text className="text-lg font-semibold text-gray-800">{monthName}</Text>

              <TouchableOpacity
                onPress={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="p-2"
              >
                <Ionicons name="chevron-forward" size={24} color="#FF5722" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setSelectedDate(new Date())}
              className="mt-3 bg-orange-500 py-2 rounded-lg"
            >
              <Text className="text-white text-center font-medium">Today</Text>
            </TouchableOpacity>
          </View>

          {/* Events List */}
          <View>
            <Text className="text-lg font-semibold text-orange-500 mb-3">Upcoming Events</Text>
            <View className="space-y-3">
              {upcomingEvents.map((event) => {
                const typeColor = getEventTypeColor(event.type);
                return (
                  <View key={event._id} className="bg-white p-4 rounded-lg shadow">
                    {/* Header */}
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-orange-500">{event.title}</Text>
                        {event.project && (
                          <Text className="text-sm text-gray-500 mt-1">{event.project.name}</Text>
                        )}
                      </View>
                      <View className={`px-3 py-1 rounded-full ${typeColor.bg}`}>
                        <Text className={`text-xs font-medium ${typeColor.text}`}>
                          {event.type}
                        </Text>
                      </View>
                    </View>

                    {/* Description */}
                    {event.description && (
                      <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
                        {event.description}
                      </Text>
                    )}

                    {/* Details */}
                    <View className="space-y-2">
                      {/* Date & Time */}
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
                        <Text className="text-sm text-gray-600 ml-2">
                          {formatDate(event.startTime)} at {formatTime(event.startTime)}
                        </Text>
                      </View>

                      {/* Location */}
                      {event.location && (
                        <View className="flex-row items-center">
                          <Ionicons name="location-outline" size={16} color="#9ca3af" />
                          <Text className="text-sm text-gray-600 ml-2">{event.location}</Text>
                        </View>
                      )}

                      {/* Attendees */}
                      {event.attendees && event.attendees.length > 0 && (
                        <View className="flex-row items-center">
                          <Ionicons name="people-outline" size={16} color="#9ca3af" />
                          <Text className="text-sm text-gray-600 ml-2">
                            {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                          </Text>
                        </View>
                      )}

                      {/* Priority */}
                      {event.priority && (
                        <View className="flex-row items-center">
                          <Ionicons name="flag-outline" size={16} color="#9ca3af" />
                          <Text className={`text-sm ml-2 font-medium ${getPriorityColor(event.priority)}`}>
                            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} priority
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Status */}
                    {event.endTime < Date.now() && (
                      <View className="mt-3 bg-green-50 px-3 py-2 rounded-lg flex-row items-center">
                        <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                        <Text className="text-green-700 text-sm ml-2 font-medium">Past Event</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {upcomingEvents.length === 0 && (
              <View className="bg-white p-8 rounded-lg shadow items-center">
                <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4">No upcoming events</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
