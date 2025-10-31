import { Ionicons } from "@expo/vector-icons";
import { api } from "@repo/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

export default function FinancePage() {
	const transactions = useQuery(api.finance.getTransactions);
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");

	const filteredTransactions = useMemo(() => {
		if (!transactions) return [];

		return transactions.filter((transaction) => {
			const matchesType =
				typeFilter === "all" || transaction.type === typeFilter;
			const matchesStatus =
				statusFilter === "all" || transaction.status === statusFilter;
			return matchesType && matchesStatus;
		});
	}, [transactions, typeFilter, statusFilter]);

	const stats = useMemo(() => {
		if (!transactions) return { income: 0, expenses: 0, profit: 0, pending: 0 };

		const completed = transactions.filter((t) => t.status === "completed");
		const income = completed
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + t.amount, 0);
		const expenses = completed
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + t.amount, 0);
		const pending = transactions
			.filter((t) => t.status === "pending")
			.reduce((sum, t) => sum + t.amount, 0);

		return {
			income,
			expenses,
			profit: income - expenses,
			pending,
		};
	}, [transactions]);

	if (transactions === undefined) {
		return (
			<View className="flex-1 items-center justify-center bg-white">
				<ActivityIndicator size="large" color="#3b82f6" />
				<Text className="mt-4 text-gray-600">Loading finance...</Text>
			</View>
		);
	}

	const typeOptions = [
		{ label: "All", value: "all" },
		{ label: "Income", value: "income" },
		{ label: "Expense", value: "expense" },
	];

	const statusOptions = [
		{ label: "All", value: "all" },
		{ label: "Completed", value: "completed" },
		{ label: "Pending", value: "pending" },
		{ label: "Cancelled", value: "cancelled" },
	];

	return (
		<View className="flex-1 bg-gray-50">
			<ScrollView className="flex-1">
				<View className="p-4 space-y-4">
					{/* Header */}
					<View className="flex-row justify-between items-center">
						<Text className="text-2xl font-bold text-gray-800">Finance</Text>
						<TouchableOpacity className="bg-blue-600 px-4 py-2 rounded-lg">
							<Text className="text-white font-semibold">
								+ New Transaction
							</Text>
						</TouchableOpacity>
					</View>

					{/* Stats */}
					<View className="flex-row flex-wrap gap-3">
						<View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
							<Text className="text-xs text-gray-500">Total Income</Text>
							<Text className="text-2xl font-bold text-green-600 mt-1">
								${stats.income.toLocaleString()}
							</Text>
						</View>
						<View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
							<Text className="text-xs text-gray-500">Total Expenses</Text>
							<Text className="text-2xl font-bold text-red-600 mt-1">
								${stats.expenses.toLocaleString()}
							</Text>
						</View>
						<View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
							<Text className="text-xs text-gray-500">Net Profit</Text>
							<Text
								className={`text-2xl font-bold mt-1 ${stats.profit >= 0 ? "text-green-600" : "text-red-600"}`}
							>
								${stats.profit.toLocaleString()}
							</Text>
						</View>
						<View className="flex-1 min-w-[45%] bg-white p-3 rounded-lg shadow">
							<Text className="text-xs text-gray-500">Pending</Text>
							<Text className="text-2xl font-bold text-yellow-600 mt-1">
								${stats.pending.toLocaleString()}
							</Text>
						</View>
					</View>

					{/* Filters */}
					<View className="bg-white p-4 rounded-lg shadow">
						<Text className="text-sm font-semibold text-gray-700 mb-3">
							Filters
						</Text>

						{/* Type Filter */}
						<Text className="text-xs text-gray-500 mb-2">Type</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="flex-row gap-2 mb-3"
						>
							{typeOptions.map((option) => (
								<TouchableOpacity
									key={option.value}
									onPress={() => setTypeFilter(option.value)}
									className={`px-4 py-2 rounded-full ${
										typeFilter === option.value ? "bg-blue-600" : "bg-gray-100"
									}`}
								>
									<Text
										className={`font-medium text-sm ${
											typeFilter === option.value
												? "text-white"
												: "text-gray-700"
										}`}
									>
										{option.label}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>

						{/* Status Filter */}
						<Text className="text-xs text-gray-500 mb-2">Status</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="flex-row gap-2"
						>
							{statusOptions.map((option) => (
								<TouchableOpacity
									key={option.value}
									onPress={() => setStatusFilter(option.value)}
									className={`px-4 py-2 rounded-full ${
										statusFilter === option.value
											? "bg-blue-600"
											: "bg-gray-100"
									}`}
								>
									<Text
										className={`font-medium text-sm ${
											statusFilter === option.value
												? "text-white"
												: "text-gray-700"
										}`}
									>
										{option.label}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Transactions List */}
					<View>
						<Text className="text-lg font-semibold text-gray-800 mb-3">
							Transactions
						</Text>
						<View className="space-y-3">
							{filteredTransactions.map((transaction) => (
								<View
									key={transaction._id}
									className="bg-white p-4 rounded-lg shadow"
								>
									{/* Header */}
									<View className="flex-row justify-between items-start mb-2">
										<View className="flex-1">
											<Text className="text-lg font-semibold text-gray-800">
												{transaction.title}
											</Text>
											{transaction.projectName && (
												<Text className="text-sm text-gray-500 mt-1">
													{transaction.projectName}
												</Text>
											)}
										</View>
										<Text
											className={`text-lg font-bold ${
												transaction.type === "income"
													? "text-green-600"
													: "text-red-600"
											}`}
										>
											{transaction.type === "income" ? "+" : "-"}$
											{transaction.amount.toLocaleString()}
										</Text>
									</View>

									{/* Description */}
									{transaction.description && (
										<Text
											className="text-sm text-gray-600 mb-3"
											numberOfLines={2}
										>
											{transaction.description}
										</Text>
									)}

									{/* Details */}
									<View className="flex-row flex-wrap gap-x-4 gap-y-2">
										{/* Category */}
										<View className="flex-row items-center">
											<Ionicons
												name="pricetag-outline"
												size={14}
												color="#9ca3af"
											/>
											<Text className="text-xs text-gray-600 ml-1 capitalize">
												{transaction.category?.replace("-", " ")}
											</Text>
										</View>

										{/* Date */}
										<View className="flex-row items-center">
											<Ionicons
												name="calendar-outline"
												size={14}
												color="#9ca3af"
											/>
											<Text className="text-xs text-gray-600 ml-1">
												{new Date(transaction.date).toLocaleDateString()}
											</Text>
										</View>

										{/* Client */}
										{transaction.client && (
											<View className="flex-row items-center">
												<Ionicons
													name="person-outline"
													size={14}
													color="#9ca3af"
												/>
												<Text className="text-xs text-gray-600 ml-1">
													{transaction.client}
												</Text>
											</View>
										)}

										{/* Invoice Number */}
										{transaction.invoiceNumber && (
											<View className="flex-row items-center">
												<Ionicons
													name="document-text-outline"
													size={14}
													color="#9ca3af"
												/>
												<Text className="text-xs text-gray-600 ml-1">
													{transaction.invoiceNumber}
												</Text>
											</View>
										)}
									</View>

									{/* Status Badge */}
									<View className="mt-3">
										<View
											className={`self-start px-3 py-1 rounded-full ${
												transaction.status === "completed"
													? "bg-green-100"
													: transaction.status === "pending"
														? "bg-yellow-100"
														: "bg-red-100"
											}`}
										>
											<Text
												className={`text-xs font-medium ${
													transaction.status === "completed"
														? "text-green-700"
														: transaction.status === "pending"
															? "text-yellow-700"
															: "text-red-700"
												}`}
											>
												{transaction.status.charAt(0).toUpperCase() +
													transaction.status.slice(1)}
											</Text>
										</View>
									</View>
								</View>
							))}
						</View>

						{filteredTransactions.length === 0 && (
							<View className="bg-white p-8 rounded-lg shadow items-center">
								<Ionicons name="cash-outline" size={48} color="#d1d5db" />
								<Text className="text-gray-500 mt-4">
									No transactions found
								</Text>
							</View>
						)}
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
