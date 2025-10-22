"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

interface Budget {
	_id: string;
	title: string;
	client: string;
	description: string;
	status: "draft" | "sent" | "approved" | "rejected" | "expired";
	totalAmount: number;
	validUntil: number;
	createdAt: number;
	items: Array<{
		description: string;
		quantity: number;
		unitPrice: number;
		total: number;
	}>;
}

interface AllBudgetsProps {
	budgets: Budget[];
}

const statusConfig = {
	draft: { label: "Rascunho", color: "badge-ghost", icon: "lucide--file-edit" },
	sent: { label: "Enviado", color: "badge-info", icon: "lucide--send" },
	approved: { label: "Aprovado", color: "badge-success", icon: "lucide--check-circle" },
	rejected: { label: "Rejeitado", color: "badge-error", icon: "lucide--x-circle" },
	expired: { label: "Expirado", color: "badge-warning", icon: "lucide--clock" },
};

export function AllBudgets({ budgets }: AllBudgetsProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<"all" | Budget["status"]>("all");
	const [viewMode, setViewMode] = useState<"grid" | "table">("table");

	// Filter budgets
	const filteredBudgets = useMemo(() => {
		return budgets.filter((budget) => {
			const matchesSearch =
				budget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				budget.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
				budget.description.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesStatus = statusFilter === "all" || budget.status === statusFilter;

			return matchesSearch && matchesStatus;
		});
	}, [budgets, searchQuery, statusFilter]);

	return (
		<div className="space-y-4">
			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="flex-1">
					<label className="input input-bordered flex items-center gap-2">
						<span className="iconify lucide--search size-4 text-base-content/60" />
						<input
							type="text"
							className="grow"
							placeholder="Buscar orçamentos..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</label>
				</div>
				<select
					className="select select-bordered w-full sm:w-48"
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
				>
					<option value="all">Todos os Status</option>
					<option value="draft">Rascunho</option>
					<option value="sent">Enviado</option>
					<option value="approved">Aprovado</option>
					<option value="rejected">Rejeitado</option>
					<option value="expired">Expirado</option>
				</select>
				<div className="join">
					<Button
						className={`btn join-item ${viewMode === "table" ? "btn-active" : ""}`}
						onClick={() => setViewMode("table")}
					>
						<span className="iconify lucide--table size-4" />
					</Button>
					<Button
						className={`btn join-item ${viewMode === "grid" ? "btn-active" : ""}`}
						onClick={() => setViewMode("grid")}
					>
						<span className="iconify lucide--layout-grid size-4" />
					</Button>
				</div>
			</div>

			{/* Empty State */}
			{filteredBudgets.length === 0 ? (
				<div className="text-center py-12 border border-base-300 rounded-lg">
					<span className="iconify lucide--file-text size-16 text-base-content/20 mb-4" />
					<h3 className="text-lg font-medium mb-2">Nenhum orçamento encontrado</h3>
					<p className="text-base-content/60 text-sm">
						{searchQuery || statusFilter !== "all"
							? "Tente ajustar os filtros"
							: "Crie seu primeiro orçamento para começar"}
					</p>
				</div>
			) : viewMode === "table" ? (
				/* Table View */
				<div className="overflow-x-auto bg-base-100 rounded-lg border border-base-300">
					<table className="table">
						<thead>
							<tr>
								<th>Orçamento</th>
								<th>Cliente</th>
								<th>Valor</th>
								<th>Status</th>
								<th>Válido Até</th>
								<th>Criado Em</th>
								<th>Ações</th>
							</tr>
						</thead>
						<tbody>
							{filteredBudgets.map((budget) => {
								const isExpiringSoon =
									budget.status === "sent" &&
									budget.validUntil - Date.now() <= 7 * 24 * 60 * 60 * 1000;

								return (
									<tr key={budget._id} className="hover">
										<td>
											<div className="flex items-center gap-2">
												<span
													className={`iconify ${statusConfig[budget.status].icon} size-5 text-base-content/60`}
												/>
												<div>
													<p className="font-medium">{budget.title}</p>
													<p className="text-xs text-base-content/60 line-clamp-1">
														{budget.description}
													</p>
												</div>
											</div>
										</td>
										<td>{budget.client}</td>
										<td className="font-semibold">
											${budget.totalAmount.toLocaleString()}
										</td>
										<td>
											<span className={`badge ${statusConfig[budget.status].color}`}>
												{statusConfig[budget.status].label}
											</span>
										</td>
										<td>
											<div className="flex items-center gap-2">
												{isExpiringSoon && (
													<span className="iconify lucide--alert-circle size-4 text-warning" />
												)}
												<span
													className={isExpiringSoon ? "text-warning font-medium" : ""}
												>
													{new Date(budget.validUntil).toLocaleDateString("pt-BR")}
												</span>
											</div>
										</td>
										<td>{new Date(budget.createdAt).toLocaleDateString("pt-BR")}</td>
										<td>
											<div className="flex items-center gap-2">
												<Button className="btn btn-ghost btn-sm">
													<span className="iconify lucide--eye size-4" />
												</Button>
												<Button className="btn btn-ghost btn-sm">
													<span className="iconify lucide--edit size-4" />
												</Button>
												<Button className="btn btn-ghost btn-sm text-error">
													<span className="iconify lucide--trash-2 size-4" />
												</Button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				/* Grid View */
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredBudgets.map((budget) => {
						const isExpiringSoon =
							budget.status === "sent" &&
							budget.validUntil - Date.now() <= 7 * 24 * 60 * 60 * 1000;

						return (
							<div
								key={budget._id}
								className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow"
							>
								<div className="card-body">
									<div className="flex items-start justify-between mb-2">
										<span
											className={`iconify ${statusConfig[budget.status].icon} size-6 text-base-content/60`}
										/>
										<span className={`badge ${statusConfig[budget.status].color} badge-sm`}>
											{statusConfig[budget.status].label}
										</span>
									</div>
									<h3 className="card-title text-base">{budget.title}</h3>
									<p className="text-sm text-base-content/60">{budget.client}</p>
									<p className="text-xs text-base-content/60 line-clamp-2 mt-2">
										{budget.description}
									</p>

									<div className="divider my-2" />

									<div className="flex items-center justify-between">
										<div>
											<p className="text-xs text-base-content/60">Valor Total</p>
											<p className="text-lg font-bold">
												${budget.totalAmount.toLocaleString()}
											</p>
										</div>
										<div className="text-right">
											<p className="text-xs text-base-content/60">Válido até</p>
											<p
												className={`text-sm font-medium ${isExpiringSoon ? "text-warning" : ""}`}
											>
												{new Date(budget.validUntil).toLocaleDateString("pt-BR", {
													day: "2-digit",
													month: "short",
												})}
											</p>
										</div>
									</div>

									<div className="card-actions justify-end mt-4">
										<Button className="btn btn-sm btn-ghost">
											<span className="iconify lucide--eye size-4" />
											Ver
										</Button>
										<Button className="btn btn-sm btn-ghost">
											<span className="iconify lucide--edit size-4" />
											Editar
										</Button>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Results Count */}
			{filteredBudgets.length > 0 && (
				<div className="text-center text-sm text-base-content/60">
					Mostrando {filteredBudgets.length} de {budgets.length} orçamentos
				</div>
			)}
		</div>
	);
}
