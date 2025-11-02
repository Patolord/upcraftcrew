import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

export default function KanbanPage() {
	const tasks = useQuery(api.tasks.getTasks);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredTasks = useMemo(() => {
		if (!tasks) return [];

		return tasks.filter((task) => {
			const matchesSearch =
				searchQuery === "" ||
				task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				task.tags?.some((tag) =>
					tag.toLowerCase().includes(searchQuery.toLowerCase()),
				);

			return matchesSearch;
		});
	}, [tasks, searchQuery]);

	const groupedTasks = useMemo(() => {
		const groups: Record<TaskStatus, typeof filteredTasks> = {
			todo: [],
			"in-progress": [],
			review: [],
			done: [],
			blocked: [],
		};

		filteredTasks.forEach((task) => {
			if (task.status && groups[task.status as TaskStatus]) {
				groups[task.status as TaskStatus].push(task);
			}
		});

		return groups;
	}, [filteredTasks]);

	if (tasks === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size="large" color="#FF5722" />
				<Text className="mt-4 text-gray-600">Loading kanban...</Text>
			</View>
		);
	}

	const columns: { id: TaskStatus; title: string; color: string }[] = [
		{ id: "todo", title: "To Do", color: "bg-gray-100" },
		{ id: "in-progress", title: "In Progress", color: "bg-orange-100" },
		{ id: "review", title: "Review", color: "bg-yellow-100" },
		{ id: "done", title: "Done", color: "bg-green-100" },
		{ id: "blocked", title: "Blocked", color: "bg-red-100" },
	];

	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<View className="bg-white p-4 border-b border-gray-200">
				<View className="flex-row justify-between items-center mb-3">
					<Text className="text-2xl font-bold text-orange-500">Kanban</Text>
					<TouchableOpacity className="bg-orange-500 px-4 py-2 rounded-lg">
						<Text className="text-white font-semibold">+ New Task</Text>
					</TouchableOpacity>
				</View>

				{/* Search */}
				<View className="bg-gray-50 p-3 rounded-lg flex-row items-center">
					<Ionicons name="search-outline" size={20} color="#9ca3af" />
					<TextInput
						className="flex-1 ml-2 text-gray-800"
						placeholder="Search tasks..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>
			</View>

			{/* Kanban Board */}
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				className="flex-1"
			>
				<View className="flex-row p-4 gap-4">
					{columns.map((column) => {
						const columnTasks = groupedTasks[column.id] || [];
						return (
							<View key={column.id} className="w-80">
								{/* Column Header */}
								<View className={`${column.color} p-3 rounded-t-lg`}>
									<View className="flex-row justify-between items-center">
										<Text className="font-semibold text-gray-800">
											{column.title}
										</Text>
										<View className="bg-white px-2 py-1 rounded">
											<Text className="text-xs font-medium text-gray-700">
												{columnTasks.length}
											</Text>
										</View>
									</View>
								</View>

								{/* Column Content */}
								<ScrollView
									className="bg-white rounded-b-lg p-3 max-h-screen"
									showsVerticalScrollIndicator={false}
								>
									<View className="space-y-3">
										{columnTasks.map((task) => (
											<View
												key={task._id}
												className="bg-gray-50 p-4 rounded-lg border border-gray-200"
											>
												{/* Task Title */}
												<Text className="font-semibold text-gray-800 mb-2">
													{task.title}
												</Text>

												{/* Task Description */}
												{task.description && (
													<Text
														className="text-sm text-gray-600 mb-3"
														numberOfLines={3}
													>
														{task.description}
													</Text>
												)}

												{/* Tags */}
												{task.tags && task.tags.length > 0 && (
													<View className="flex-row flex-wrap gap-2 mb-3">
														{task.tags.map((tag, idx) => (
															<View
																key={idx}
																className="bg-orange-100 px-2 py-1 rounded"
															>
																<Text className="text-xs text-orange-700">
																	{tag}
																</Text>
															</View>
														))}
													</View>
												)}

												{/* Task Meta */}
												{task.assignedUser && (
													<View className="flex-row items-center mt-2">
														<View className="w-6 h-6 rounded-full bg-orange-100 items-center justify-center mr-2">
															<Text className="text-orange-500 text-xs font-semibold">
																{task.assignedUser.name
																	.split(" ")
																	.map((n: string) => n[0])
																	.join("")
																	.slice(0, 2)}
															</Text>
														</View>
														<Text className="text-xs text-gray-600">
															{task.assignedUser.name}
														</Text>
													</View>
												)}

												{task.dueDate && (
													<View className="flex-row items-center mt-2">
														<Ionicons
															name="calendar-outline"
															size={14}
															color="#9ca3af"
														/>
														<Text className="text-xs text-gray-600 ml-1">
															{new Date(task.dueDate).toLocaleDateString()}
														</Text>
													</View>
												)}
											</View>
										))}

										{columnTasks.length === 0 && (
											<View className="py-8 items-center">
												<Ionicons
													name="folder-open-outline"
													size={32}
													color="#d1d5db"
												/>
												<Text className="text-gray-400 text-sm mt-2">
													No tasks
												</Text>
											</View>
										)}
									</View>
								</ScrollView>
							</View>
						);
					})}
				</View>
			</ScrollView>
		</View>
	);
}
