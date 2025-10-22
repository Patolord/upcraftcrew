"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { mockTransactions } from "@/lib/mock-data/finance";
import type { TransactionCategory, TransactionType } from "@/types/finance";
import { TransactionRow } from "@/components/finance/TransactionRow";
import { CategoryBreakdown } from "@/components/finance/CategoryBreakdown";
import { FinancialSummaryCards } from "@/components/finance/FinancialSummaryCards";
import { TransactionFilters } from "@/components/finance/TransactionFilters";
import { QuickStats } from "@/components/finance/QuickStats";
import { NewTransactionModal } from "@/components/finance/NewTransactionModal";

export default function FinancePage() {
	const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
	const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | "all">("all");
	const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
	const [isModalOpen, setIsModalOpen] = useState(false);

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
					<Button className="btn btn-primary gap-2" onClick={() => setIsModalOpen(true)}>
						<span className="iconify lucide--plus size-5" />
						New Transaction
					</Button>
				</div>
			</div>

			{/* Financial Summary Cards */}
			<FinancialSummaryCards
				summary={summary}
				totalTransactions={mockTransactions.length}
				pendingTransactions={mockTransactions.filter((t) => t.status === "pending").length}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Transactions Table */}
				<div className="lg:col-span-2 space-y-4">
					{/* Filters */}
					<TransactionFilters
						typeFilter={typeFilter}
						categoryFilter={categoryFilter}
						statusFilter={statusFilter}
						onTypeFilterChange={setTypeFilter}
						onCategoryFilterChange={setCategoryFilter}
						onStatusFilterChange={setStatusFilter}
					/>

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
					<QuickStats transactions={mockTransactions} />
				</div>
			</div>

			{/* New Transaction Modal */}
			<NewTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</div>
	);
}