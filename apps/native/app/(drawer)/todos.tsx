import { Ionicons } from "@expo/vector-icons";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import type { Id } from "@upcraftcrew-os/backend/convex/_generated/dataModel";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Card, Checkbox, Chip, useThemeColor } from "heroui-native";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";

export default function TodosScreen() {
	const [newTodoText, setNewTodoText] = useState("");
	const { isAuthenticated } = useConvexAuth();
	const tasks = useQuery(api.tasks.getTasks, isAuthenticated ? {} : "skip");
	const createTaskMutation = useMutation(api.tasks.createTask);
	const updateTaskStatusMutation = useMutation(api.tasks.updateTaskStatus);
	const deleteTaskMutation = useMutation(api.tasks.deleteTask);

	const mutedColor = useThemeColor("muted");
	const accentColor = useThemeColor("accent");
	const dangerColor = useThemeColor("danger");
	const foregroundColor = useThemeColor("foreground");

	const handleAddTodo = async () => {
		const text = newTodoText.trim();
		if (!text) return;
		await createTaskMutation({
			title: text,
			description: "",
			status: "todo",
			priority: "medium",
			tags: [],
		});
		setNewTodoText("");
	};

	const handleToggleTodo = (id: Id<"tasks">, isDone: boolean) => {
		updateTaskStatusMutation({ id, status: isDone ? "todo" : "done" });
	};

	const handleDeleteTodo = (id: Id<"tasks">) => {
		Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => deleteTaskMutation({ id }),
			},
		]);
	};

	const isLoading = isAuthenticated && !tasks;
	const completedCount =
		tasks?.filter((t) => t.status === "done").length || 0;
	const totalCount = tasks?.length || 0;

	return (
		<Container>
			<ScrollView className="flex-1" contentContainerClassName="p-6">
				{!isAuthenticated && (
					<Card variant="secondary" className="mb-6 p-4">
						<Text className="text-foreground text-lg font-semibold mb-2">
							Sign in to manage tasks
						</Text>
						<SignIn />
					</Card>
				)}

				<View className="mb-6">
					<View className="flex-row items-center justify-between mb-2">
						<Text className="text-3xl font-bold text-foreground">
							Tasks
						</Text>
						{totalCount > 0 && (
							<Chip variant="secondary" color="accent" size="sm">
								<Chip.Label>
									{completedCount}/{totalCount}
								</Chip.Label>
							</Chip>
						)}
					</View>
				</View>

				<Card variant="secondary" className="mb-6 p-4">
					<View className="flex-row items-center gap-3">
						<View className="flex-1">
							<TextInput
								value={newTodoText}
								onChangeText={setNewTodoText}
								placeholder="Add a new task..."
								placeholderTextColor={mutedColor}
								onSubmitEditing={handleAddTodo}
								returnKeyType="done"
								className="text-foreground text-base py-3 px-4 border border-divider rounded-lg bg-surface"
							/>
						</View>
						<Pressable
							onPress={handleAddTodo}
							disabled={!isAuthenticated || !newTodoText.trim()}
							className={`p-3 rounded-lg active:opacity-70 ${newTodoText.trim() ? "bg-accent" : "bg-surface"}`}
						>
							<Ionicons
								name="add"
								size={24}
								color={newTodoText.trim() ? foregroundColor : mutedColor}
							/>
						</Pressable>
					</View>
				</Card>

				{isLoading && (
					<View className="items-center justify-center py-12">
						<ActivityIndicator size="large" color={accentColor} />
						<Text className="text-muted mt-4">Loading tasks...</Text>
					</View>
				)}

				{isAuthenticated && tasks && tasks.length === 0 && !isLoading && (
					<Card className="items-center justify-center py-12">
						<Ionicons
							name="checkbox-outline"
							size={64}
							color={mutedColor}
							style={{ marginBottom: 16 }}
						/>
						<Text className="text-foreground text-lg font-semibold mb-2">
							No tasks yet
						</Text>
						<Text className="text-muted text-center">
							Add your first task to get started!
						</Text>
					</Card>
				)}

				{isAuthenticated && tasks && tasks.length > 0 && (
					<View className="gap-3">
						{tasks.map((task) => (
							<Card key={task._id} variant="secondary" className="p-4">
								<View className="flex-row items-center gap-3">
									<Checkbox
										isSelected={task.status === "done"}
										onSelectedChange={() =>
											handleToggleTodo(task._id, task.status === "done")
										}
									/>
									<View className="flex-1">
										<Text
											className={`text-base ${task.status === "done" ? "text-muted line-through" : "text-foreground"}`}
										>
											{task.title}
										</Text>
									</View>
									<Pressable
										onPress={() => handleDeleteTodo(task._id)}
										className="p-2 rounded-lg active:opacity-70"
									>
										<Ionicons
											name="trash-outline"
											size={24}
											color={dangerColor}
										/>
									</Pressable>
								</View>
							</Card>
						))}
					</View>
				)}
			</ScrollView>
		</Container>
	);
}
