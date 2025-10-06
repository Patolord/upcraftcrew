"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { mockTransactions } from "@/lib/mock-data/finance";
import type { Transaction, TransactionCategory, TransactionType } from "@/types/finance";

const categoryConfig: Record<TransactionCategory, { label: string; icon: string }> = {
	"project-payment": { label: "Project Payment", icon: "lucide--briefcase" },
	salary: { label: "Salary", icon: "lucide--user" },
	subscription: { label: "Subscription", icon: "lucide--repeat" },
	equipment: { label: "Equipment", icon: "lucide--monitor" },
	marketing: { label: "Marketing", icon: "lucide--megaphone" },
	office: { label: "Office", icon: "lucide--building" },
	software: { label: "Software", icon: "lucide--code" },
	consultant: { label: "Consultant", icon: "lucide--user-check" },
	other: { label: "Other", icon: "lucide--more-horizontal" },
};

const statusConfig = {
	completed: { label: "Completed", color: "badge-success" },
	pending: { label: "Pending", color: "badge-warning" },
	cancelled: { label: "Cancelled", color: "badge-error" },
};

function TransactionRow({ transaction }: { transaction: Transaction }) {
	const category = categoryConfig[transaction.category];
	const status = statusConfig[transaction.status];
	const isIncome = transaction.type === "income";

	return (
		<tr className="hover">
			<td>
				<div className="flex items-center gap-3">
					<div
						className={`w-10 h-10 rounded-lg flex items-center justify-center ${
							isIncome ? "bg-success/20" : "bg-error/20"
						}`}
					>
						<span
							className={`iconify ${category.icon} size-5 ${
								isIncome ? "text-success" : "text-error"
							}`}
						/>
					</div>
					<div>
						<div className="font-medium">{transaction.title}</div>
						{transaction.description && (
							<div className="text-xs text-base-content/60 line-clamp-1">
								{transaction.description}
							</div>
						)}
					</div>
				</div>
			</td>
			<td>
				<span className="badge badge-sm badge-ghost">{category.label}</span>
			</td>
			<td>
				{transaction.client && (
					<div className="text-sm">{transaction.client}</div>
				)}
				{transaction.projectName && (
					<div className="text-xs text-base-content/60">
						{transaction.projectName}
					</div>
				)}
				{!transaction.client && !transaction.projectName && (
					<span className="text-base-content/40">—</span>
				)}
			</td>
			<td>
				<div className="text-sm">
					{new Date(transaction.date).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</div>
			</td>
			<td>
				<span className={`badge ${status.color} badge-sm`}>
					{status.label}
				</span>
			</td>
			<td className="text-right">
				<div
					className={`font-semibold ${
						isIncome ? "text-success" : "text-error"
					}`}
				>
					{isIncome ? "+" : "-"}${transaction.amount.toLocaleString()}
				</div>
			</td>
			<td>
				<div className="flex items-center gap-1">
					<Button className="btn btn-ghost btn-xs">
						<span className="iconify lucide--eye size-4" />
					</Button>
					<Button className="btn btn-ghost btn-xs">
						<span className="iconify lucide--download size-4" />
					</Button>
					<Button className="btn btn-ghost btn-xs">
						<span className="iconify lucide--more-horizontal size-4" />
					</Button>
				</div>
			</td>
		</tr>
	);
}

function CategoryBreakdown({ transactions }: { transactions: Transaction[] }) {
	const categoryTotals = useMemo(() => {
		const totals = new Map<TransactionCategory, number>();

		transactions.forEach((t) => {
			if (t.type === "expense" && t.status === "completed") {
				const current = totals.get(t.category) || 0;
				totals.set(t.category, current + t.amount);
			}
		});

		return Array.from(totals.entries())
			.map(([category, amount]) => ({ category, amount }))
			.sort((a, b) => b.amount - a.amount);
	}, [transactions]);

	const totalExpenses = categoryTotals.reduce((sum, item) => sum + item.amount, 0);

	return (
		<div className="card bg-base-100 border border-base-300">
			<div className="card-body">
				<h3 className="card-title text-base">Expenses by Category</h3>
				<div className="space-y-3 mt-2">
					{categoryTotals.slice(0, 6).map(({ category, amount }) => {
						const percentage = (amount / totalExpenses) * 100;
						const config = categoryConfig[category];

						return (
							<div key={category}>
								<div className="flex items-center justify-between text-sm mb-1">
									<div className="flex items-center gap-2">
										<span className={`iconify ${config.icon} size-4`} />
										<span>{config.label}</span>
									</div>
									<span className="font-medium">
										${amount.toLocaleString()}
									</span>
								</div>
								<progress
									className="progress progress-primary w-full"
									value={percentage}
									max="100"
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default function FinancePage() {
	const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | "all">("all");
	const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");

	// Calculate financial summary
	const summary = useMemo(() => {
		const completed = mockTransactions.filter((t) => t.status === "completed");
		const pending = mockTransactions.filter((t) => t.status === "pending");

		const totalIncome = completed
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + t.amount, 0);

		const totalExpenses = completed
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + t.amount, 0);

		const pendingIncome = pending
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + t.amount, 0);

		const pendingExpenses = pending
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + t.amount, 0);

		return {
			totalIncome,
			totalExpenses,
			netProfit: totalIncome - totalExpenses,
			pendingIncome,
			pendingExpenses,
		};
	}, []);

	// Filter transactions
	const filteredTransactions = mockTransactions.filter((transaction) => {
		const matchesType =
			typeFilter === "all" || transaction.type === typeFilter;
		const matchesCategory =
			categoryFilter === "all" || transaction.category === categoryFilter;
		const matchesStatus =
			statusFilter === "all" || transaction.status === statusFilter;

		return matchesType && matchesCategory && matchesStatus;
	});

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Finance</h1>
					<p className="text-base-content/60 text-sm mt-1">
						Track income, expenses, and financial performance
					</p>
				</div>
				<div className="flex gap-2">
					<Button className="btn btn-ghost gap-2">
						<span className="iconify lucide--download size-5" />
						Export
					</Button>
					<Button className="btn btn-primary gap-2">
						<span className="iconify lucide--plus size-5" />
						New Transaction
					</Button>
				</div>
			</div>

			{/* Financial Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Total Income</div>
						<div className="stat-value text-2xl text-success">
							${(summary.totalIncome / 1000).toFixed(0)}k
						</div>
						<div className="stat-desc text-xs">
							+${summary.pendingIncome.toLocaleString()} pending
						</div>
					</div>
				</div>

				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Total Expenses</div>
						<div className="stat-value text-2xl text-error">
							${(summary.totalExpenses / 1000).toFixed(0)}k
						</div>
						<div className="stat-desc text-xs">
							-${summary.pendingExpenses.toLocaleString()} pending
						</div>
					</div>
				</div>

				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Net Profit</div>
						<div
							className={`stat-value text-2xl ${
								summary.netProfit >= 0 ? "text-success" : "text-error"
							}`}
						>
							${(summary.netProfit / 1000).toFixed(0)}k
						</div>
						<div className="stat-desc text-xs">
							{summary.netProfit >= 0 ? "Profit" : "Loss"} this period
						</div>
					</div>
				</div>

				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Transactions</div>
						<div className="stat-value text-2xl">
							{mockTransactions.length}
						</div>
						<div className="stat-desc text-xs">
							{mockTransactions.filter((t) => t.status === "pending").length}{" "}
							pending
						</div>
					</div>
				</div>

				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Profit Margin</div>
						<div className="stat-value text-2xl">
							{((summary.netProfit / summary.totalIncome) * 100).toFixed(0)}%
						</div>
						<div className="stat-desc text-xs">Revenue efficiency</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Transactions Table */}
				<div className="lg:col-span-2 space-y-4">
					{/* Filters */}
					<div className="flex flex-wrap gap-2">
						<select
							className="select select-bordered select-sm"
							value={typeFilter}
							onChange={(e) =>
								setTypeFilter(e.target.value as TransactionType | "all")
							}
						>
							<option value="all">All Types</option>
							<option value="income">Income</option>
							<option value="expense">Expense</option>
						</select>

						<select
							className="select select-bordered select-sm"
							value={categoryFilter}
							onChange={(e) =>
								setCategoryFilter(e.target.value as TransactionCategory | "all")
							}
						>
							<option value="all">All Categories</option>
							<option value="project-payment">Project Payment</option>
							<option value="salary">Salary</option>
							<option value="software">Software</option>
							<option value="equipment">Equipment</option>
							<option value="marketing">Marketing</option>
							<option value="office">Office</option>
							<option value="consultant">Consultant</option>
							<option value="other">Other</option>
						</select>

						<select
							className="select select-bordered select-sm"
							value={statusFilter}
							onChange={(e) =>
								setStatusFilter(e.target.value as "all" | "completed" | "pending")
							}
						>
							<option value="all">All Status</option>
							<option value="completed">Completed</option>
							<option value="pending">Pending</option>
						</select>
					</div>

					{/* Transactions Table */}
					<div className="overflow-x-auto bg-base-100 rounded-box border border-base-300">
						<table className="table table-sm">
							<thead>
								<tr>
									<th>Transaction</th>
									<th>Category</th>
									<th>Client/Project</th>
									<th>Date</th>
									<th>Status</th>
									<th className="text-right">Amount</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredTransactions.length === 0 ? (
									<tr>
										<td colSpan={7} className="text-center py-8">
											<span className="text-base-content/60">
												No transactions found
											</span>
										</td>
									</tr>
								) : (
									filteredTransactions.map((transaction) => (
										<TransactionRow
											key={transaction.id}
											transaction={transaction}
										/>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					{/* Category Breakdown */}
					<CategoryBreakdown transactions={mockTransactions} />

					{/* Quick Stats */}
					<div className="card bg-base-100 border border-base-300">
						<div className="card-body">
							<h3 className="card-title text-base">Quick Stats</h3>
							<div className="space-y-3 mt-2">
								<div className="flex items-center justify-between text-sm">
									<span className="text-base-content/60">Avg Transaction</span>
									<span className="font-medium">
										$
										{(
											mockTransactions.reduce((sum, t) => sum + t.amount, 0) /
											mockTransactions.length
										).toLocaleString(undefined, { maximumFractionDigits: 0 })}
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-base-content/60">Largest Income</span>
									<span className="font-medium text-success">
										$
										{Math.max(
											...mockTransactions
												.filter((t) => t.type === "income")
												.map((t) => t.amount)
										).toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-base-content/60">Largest Expense</span>
									<span className="font-medium text-error">
										$
										{Math.max(
											...mockTransactions
												.filter((t) => t.type === "expense")
												.map((t) => t.amount)
										).toLocaleString()}
									</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-base-content/60">Active Projects</span>
									<span className="font-medium">
										{
											new Set(
												mockTransactions
													.filter((t) => t.projectId)
													.map((t) => t.projectId)
											).size
										}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}