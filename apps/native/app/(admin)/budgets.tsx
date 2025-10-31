import { Ionicons } from "@expo/vector-icons";
import { api } from "@repo/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function BudgetsPage() {
	const budgets = useQuery(api.budgets.getBudgets);
	const budgetStats = useQuery(api.budgets.getBudgetStats);
	const [activeTab, setActiveTab] = useState<"dashboard" | "all">("all");

	if (budgets === undefined || budgetStats === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size="large" color="#3b82f6" />
				<Text className="mt-4 text-gray-600">Loading budgets...</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-gray-50">
			{/* Header */}
			<View className="bg-white p-4 border-b border-gray-200">
				<View className="flex-row justify-between items-center mb-3">
					<Text className="text-2xl font-bold text-gray-800">Orçamentos</Text>
					{activeTab === "all" && (
						<TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
							<Text className="text-white font-semibold">+ Novo Orçamento</Text>
						</TouchableOpacity>
					)}
				</View>

				{/* Tab Navigation */}
				<View className="flex-row gap-2">
					<TouchableOpacity
						onPress={() => setActiveTab("dashboard")}
						className={`flex-1 py-2 rounded-lg ${
							activeTab === "dashboard" ? "bg-blue-600" : "bg-gray-100"
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
						onPress={() => setActiveTab("all")}
						className={`flex-1 py-2 rounded-lg ${
							activeTab === "all" ? "bg-blue-600" : "bg-gray-100"
						}`}
					>
						<Text
							className={`text-center font-medium ${
								activeTab === "all" ? "text-white" : "text-gray-700"
							}`}
						>
							All Budgets
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			<ScrollView className="flex-1">
				<View className="p-4 space-y-4">
					{activeTab === "dashboard" ? (
						/* Dashboard View */
						<>
							{/* Stats Cards */}
							{budgetStats && (
								<View className="flex-row flex-wrap gap-3">
									<View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
										<Text className="text-sm text-gray-500">Total Budgets</Text>
										<Text className="text-3xl font-bold text-gray-800 mt-1">
											{budgetStats.total || 0}
										</Text>
									</View>
									<View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
										<Text className="text-sm text-gray-500">Approved</Text>
										<Text className="text-3xl font-bold text-green-600 mt-1">
											{budgetStats.approved || 0}
										</Text>
									</View>
									<View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
										<Text className="text-sm text-gray-500">Pending</Text>
										<Text className="text-3xl font-bold text-yellow-600 mt-1">
											{budgetStats.pending || 0}
										</Text>
									</View>
									<View className="flex-1 min-w-[45%] bg-white p-4 rounded-lg shadow">
										<Text className="text-sm text-gray-500">Total Value</Text>
										<Text className="text-3xl font-bold text-blue-600 mt-1">
											${(budgetStats.totalValue || 0).toLocaleString()}
										</Text>
									</View>
								</View>
							)}

							{/* Recent Budgets */}
							<View className="bg-white p-4 rounded-lg shadow">
								<Text className="text-lg font-semibold text-gray-800 mb-3">
									Recent Budgets
								</Text>
								{budgets?.slice(0, 5).map((budget, index) => (
									<View
										key={budget._id}
										className={`py-3 ${index !== 0 ? "border-t border-gray-100" : ""}`}
									>
										<View className="flex-row justify-between items-start">
											<View className="flex-1">
												<Text className="font-semibold text-gray-800">
													{budget.clientName}
												</Text>
												<Text className="text-xs text-gray-500 mt-1">
													{budget.projectName}
												</Text>
											</View>
											<View className="items-end">
												<Text className="text-sm font-bold text-blue-600">
													${budget.totalAmount?.toLocaleString()}
												</Text>
												<View
													className={`px-2 py-1 rounded mt-1 ${
														budget.status === "approved"
															? "bg-green-100"
															: budget.status === "pending"
																? "bg-yellow-100"
																: budget.status === "rejected"
																	? "bg-red-100"
																	: "bg-gray-100"
													}`}
												>
													<Text
														className={`text-xs ${
															budget.status === "approved"
																? "text-green-700"
																: budget.status === "pending"
																	? "text-yellow-700"
																	: budget.status === "rejected"
																		? "text-red-700"
																		: "text-gray-700"
														}`}
													>
														{budget.status}
													</Text>
												</View>
											</View>
										</View>
									</View>
								))}
							</View>
						</>
					) : (
						/* All Budgets View */
						<View className="space-y-3">
							{budgets?.map((budget) => (
								<View
									key={budget._id}
									className="bg-white p-4 rounded-lg shadow"
								>
									{/* Header */}
									<View className="flex-row justify-between items-start mb-3">
										<View className="flex-1">
											<Text className="text-lg font-semibold text-gray-800">
												{budget.projectName}
											</Text>
											<Text className="text-sm text-gray-500 mt-1">
												{budget.clientName}
											</Text>
										</View>
										<View
											className={`px-3 py-1 rounded-full ${
												budget.status === "approved"
													? "bg-green-100"
													: budget.status === "pending"
														? "bg-yellow-100"
														: budget.status === "rejected"
															? "bg-red-100"
															: budget.status === "draft"
																? "bg-gray-100"
																: "bg-blue-100"
											}`}
										>
											<Text
												className={`text-xs font-medium ${
													budget.status === "approved"
														? "text-green-700"
														: budget.status === "pending"
															? "text-yellow-700"
															: budget.status === "rejected"
																? "text-red-700"
																: budget.status === "draft"
																	? "text-gray-700"
																	: "text-blue-700"
												}`}
											>
												{budget.status?.charAt(0).toUpperCase() +
													budget.status?.slice(1)}
											</Text>
										</View>
									</View>

									{/* Description */}
									{budget.description && (
										<Text
											className="text-sm text-gray-600 mb-3"
											numberOfLines={2}
										>
											{budget.description}
										</Text>
									)}

									{/* Budget Details */}
									<View className="space-y-2">
										{/* Amount */}
										<View className="flex-row justify-between items-center py-2 border-t border-gray-100">
											<Text className="text-sm text-gray-600">
												Total Amount
											</Text>
											<Text className="text-lg font-bold text-blue-600">
												${budget.totalAmount?.toLocaleString()}
											</Text>
										</View>

										{/* Items Count */}
										{budget.items && budget.items.length > 0 && (
											<View className="flex-row items-center">
												<Ionicons
													name="list-outline"
													size={16}
													color="#9ca3af"
												/>
												<Text className="text-sm text-gray-600 ml-2">
													{budget.items.length} item
													{budget.items.length > 1 ? "s" : ""}
												</Text>
											</View>
										)}

										{/* Created Date */}
										{budget.createdAt && (
											<View className="flex-row items-center">
												<Ionicons
													name="calendar-outline"
													size={16}
													color="#9ca3af"
												/>
												<Text className="text-sm text-gray-600 ml-2">
													Created:{" "}
													{new Date(budget.createdAt).toLocaleDateString()}
												</Text>
											</View>
										)}

										{/* Valid Until */}
										{budget.validUntil && (
											<View className="flex-row items-center">
												<Ionicons
													name="time-outline"
													size={16}
													color="#9ca3af"
												/>
												<Text className="text-sm text-gray-600 ml-2">
													Valid until:{" "}
													{new Date(budget.validUntil).toLocaleDateString()}
												</Text>
											</View>
										)}
									</View>

									{/* Action Button */}
									<TouchableOpacity className="mt-3 bg-blue-50 py-2 rounded-lg">
										<Text className="text-blue-600 text-center font-medium">
											View Details
										</Text>
									</TouchableOpacity>
								</View>
							))}

							{(!budgets || budgets.length === 0) && (
								<View className="bg-white p-8 rounded-lg shadow items-center">
									<Ionicons
										name="document-text-outline"
										size={48}
										color="#d1d5db"
									/>
									<Text className="text-gray-500 mt-4">No budgets found</Text>
									<Text className="text-gray-400 text-sm mt-2">
										Create your first budget to get started
									</Text>
								</View>
							)}
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
}
