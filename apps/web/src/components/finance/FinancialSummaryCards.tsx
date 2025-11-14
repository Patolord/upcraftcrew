"use client";

import { useCurrency } from "@/contexts/CurrencyContext";

interface FinancialSummary {
	totalIncome: number;
	totalExpenses: number;
	netProfit: number;
	pendingIncome: number;
	pendingExpenses: number;
}

interface FinancialSummaryCardsProps {
	summary: FinancialSummary;
	totalTransactions: number;
	pendingTransactions: number;
}

export function FinancialSummaryCards({
	summary,
	totalTransactions,
	pendingTransactions
}: FinancialSummaryCardsProps) {
	const { formatAmount, config } = useCurrency();
	return (
		<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
			<div className="stats shadow border border-base-300">
				<div className="stat py-4">
					<div className="stat-title text-xs">Total Income</div>
					<div className="stat-value text-2xl text-success">
						{formatAmount(summary.totalIncome / 1000, { maximumFractionDigits: 0 })}k
					</div>
					<div className="stat-desc text-xs">
						+{formatAmount(summary.pendingIncome, { maximumFractionDigits: 0 })} pending
					</div>
				</div>
			</div>

			<div className="stats shadow border border-base-300">
				<div className="stat py-4">
					<div className="stat-title text-xs">Total Expenses</div>
					<div className="stat-value text-2xl text-error">
						{formatAmount(summary.totalExpenses / 1000, { maximumFractionDigits: 0 })}k
					</div>
					<div className="stat-desc text-xs">
						-{formatAmount(summary.pendingExpenses, { maximumFractionDigits: 0 })} pending
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
						{formatAmount(summary.netProfit / 1000, { maximumFractionDigits: 0 })}k
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
						{totalTransactions}
					</div>
					<div className="stat-desc text-xs">
						{pendingTransactions} pending
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
	);
}
