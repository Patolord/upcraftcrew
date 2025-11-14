"use client";

import { useCurrency } from "@/contexts/CurrencyContext";
import type { Transaction } from "@/types/finance";

export function QuickStats({ transactions }: { transactions: Transaction[] }) {
	const { formatAmount } = useCurrency();
	return (
		<div className="card bg-base-100 border border-base-300">
			<div className="card-body">
				<h3 className="card-title text-base">Quick Stats</h3>
				<div className="space-y-3 mt-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-base-content/60">Avg Transaction</span>
						<span className="font-medium">
							{formatAmount(
								transactions.reduce((sum, t) => sum + t.amount, 0) /
								transactions.length, { maximumFractionDigits: 0 }
							)}
						</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-base-content/60">Largest Income</span>
						<span className="font-medium text-success">
							{formatAmount(
								Math.max(
									...transactions
										.filter((t) => t.type === "income")
										.map((t) => t.amount)
								), { maximumFractionDigits: 0 }
							)}
						</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-base-content/60">Largest Expense</span>
						<span className="font-medium text-error">
							{formatAmount(
								Math.max(
									...transactions
										.filter((t) => t.type === "expense")
										.map((t) => t.amount)
								), { maximumFractionDigits: 0 }
							)}
						</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-base-content/60">Active Projects</span>
						<span className="font-medium">
							{
								new Set(
									transactions
										.filter((t) => t.projectId)
										.map((t) => t.projectId)
								).size
							}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
