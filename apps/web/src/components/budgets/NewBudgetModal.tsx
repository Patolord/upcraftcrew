"use client";

import { useState, useId } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Id } from "@workspace/backend/_generated/dataModel";

interface NewBudgetModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface BudgetItem {
	description: string;
	quantity: number;
	unitPrice: number;
	total: number;
}

export function NewBudgetModal({ isOpen, onClose }: NewBudgetModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createBudget = useMutation(api.budgets.createBudget);
	const projects = useQuery(api.projects.getProjects);
	const formId = useId();

	const [formData, setFormData] = useState({
		title: "",
		client: "",
		description: "",
		status: "draft" as "draft" | "sent" | "approved" | "rejected" | "expired",
		validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0], // 30 days from now
		projectId: "" as string,
		notes: "",
	});

	const [items, setItems] = useState<BudgetItem[]>([
		{ description: "", quantity: 1, unitPrice: 0, total: 0 },
	]);

	const handleAddItem = () => {
		setItems([...items, { description: "", quantity: 1, unitPrice: 0, total: 0 }]);
	};

	const handleRemoveItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	const handleItemChange = (
		index: number,
		field: keyof BudgetItem,
		value: string | number
	) => {
		const newItems = [...items];
		newItems[index] = {
			...newItems[index],
			[field]: value,
		};

		// Recalculate total for this item
		if (field === "quantity" || field === "unitPrice") {
			newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
		}

		setItems(newItems);
	};

	const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Validate items
			if (items.length === 0 || items.every((item) => !item.description)) {
				toast.error("Adicione pelo menos um item ao orçamento");
				setIsSubmitting(false);
				return;
			}

			const validItems = items.filter((item) => item.description.trim() !== "");

			await createBudget({
				title: formData.title,
				client: formData.client,
				description: formData.description,
				status: formData.status,
				items: validItems,
				validUntil: new Date(formData.validUntil).getTime(),
				projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
				notes: formData.notes || undefined,
			});

			toast.success("Orçamento criado com sucesso!");

			// Reset form
			setFormData({
				title: "",
				client: "",
				description: "",
				status: "draft",
				validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
					.toISOString()
					.split("T")[0],
				projectId: "",
				notes: "",
			});
			setItems([{ description: "", quantity: 1, unitPrice: 0, total: 0 }]);

			onClose();
		} catch (error) {
			console.error("Failed to create budget:", error);
			toast.error("Falha ao criar orçamento. Tente novamente.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
				<h3 className="font-bold text-lg mb-4">Criar Novo Orçamento</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Title and Client */}
					<div className="grid grid-cols-2 gap-4">
						<div className="form-control">
							<label htmlFor={`${formId}-title`} className="label">
								<span className="label-text">Título *</span>
							</label>
							<input
								id={`${formId}-title`}
								type="text"
								className="input input-bordered"
								value={formData.title}
								onChange={(e) => setFormData({ ...formData, title: e.target.value })}
								required
							/>
						</div>
						<div className="form-control">
							<label htmlFor={`${formId}-client`} className="label">
								<span className="label-text">Cliente *</span>
							</label>
							<input
								id={`${formId}-client`}
								type="text"
								className="input input-bordered"
								value={formData.client}
								onChange={(e) => setFormData({ ...formData, client: e.target.value })}
								required
							/>
						</div>
					</div>

					{/* Description */}
					<div className="form-control">
						<label htmlFor={`${formId}-description`} className="label">
							<span className="label-text">Descrição *</span>
						</label>
						<textarea
							id={`${formId}-description`}
							className="textarea textarea-bordered h-20"
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							required
						/>
					</div>

					{/* Status, Valid Until, Project */}
					<div className="grid grid-cols-3 gap-4">
						<div className="form-control">
							<label htmlFor={`${formId}-status`} className="label">
								<span className="label-text">Status</span>
							</label>
							<select
								id={`${formId}-status`}
								className="select select-bordered"
								value={formData.status}
								onChange={(e) =>
									setFormData({ ...formData, status: e.target.value as typeof formData.status })
								}
							>
								<option value="draft">Rascunho</option>
								<option value="sent">Enviado</option>
								<option value="approved">Aprovado</option>
								<option value="rejected">Rejeitado</option>
								<option value="expired">Expirado</option>
							</select>
						</div>
						<div className="form-control">
							<label htmlFor={`${formId}-valid-until`} className="label">
								<span className="label-text">Válido Até *</span>
							</label>
							<input
								id={`${formId}-valid-until`}
								type="date"
								className="input input-bordered"
								value={formData.validUntil}
								onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
								required
							/>
						</div>
						<div className="form-control">
							<label htmlFor={`${formId}-project`} className="label">
								<span className="label-text">Projeto (opcional)</span>
							</label>
							<select
								id={`${formId}-project`}
								className="select select-bordered"
								value={formData.projectId}
								onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
							>
								<option value="">Nenhum</option>
								{projects?.map((project) => (
									<option key={project._id} value={project._id}>
										{project.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Items */}
					<div className="form-control">
						<div className="flex items-center justify-between mb-2">
							<label className="label">
								<span className="label-text font-semibold">Itens do Orçamento</span>
							</label>
							<Button
								type="button"
								className="btn btn-sm btn-ghost gap-2"
								onClick={handleAddItem}
							>
								<span className="iconify lucide--plus size-4" />
								Adicionar Item
							</Button>
						</div>
						<div className="space-y-2 max-h-60 overflow-y-auto border border-base-300 rounded-lg p-3">
							{items.map((item, index) => (
								<div key={index} className="flex gap-2 items-start">
									<div className="flex-1">
										<input
											type="text"
											className="input input-sm input-bordered w-full"
											placeholder="Descrição do item"
											value={item.description}
											onChange={(e) =>
												handleItemChange(index, "description", e.target.value)
											}
										/>
									</div>
									<input
										type="number"
										className="input input-sm input-bordered w-20"
										placeholder="Qtd"
										min="1"
										value={item.quantity}
										onChange={(e) =>
											handleItemChange(index, "quantity", Number(e.target.value))
										}
									/>
									<div className="input-group">
										<span className="bg-base-200 px-2 flex items-center border border-base-300 border-r-0 rounded-l text-xs">
											$
										</span>
										<input
											type="number"
											className="input input-sm input-bordered w-24 rounded-l-none"
											placeholder="Preço"
											min="0"
											step="0.01"
											value={item.unitPrice}
											onChange={(e) =>
												handleItemChange(index, "unitPrice", Number(e.target.value))
											}
										/>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm font-semibold w-24 text-right">
											${item.total.toLocaleString()}
										</span>
										{items.length > 1 && (
											<Button
												type="button"
												className="btn btn-sm btn-ghost btn-circle text-error"
												onClick={() => handleRemoveItem(index)}
											>
												<span className="iconify lucide--trash-2 size-4" />
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Total */}
					<div className="alert alert-info">
						<div className="flex items-center justify-between w-full">
							<span className="font-semibold">Valor Total do Orçamento:</span>
							<span className="text-2xl font-bold">
								${totalAmount.toLocaleString()}
							</span>
						</div>
					</div>

					{/* Notes */}
					<div className="form-control">
						<label htmlFor={`${formId}-notes`} className="label">
							<span className="label-text">Observações (opcional)</span>
						</label>
						<textarea
							id={`${formId}-notes`}
							className="textarea textarea-bordered h-16"
							placeholder="Termos, condições ou observações adicionais..."
							value={formData.notes}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
						/>
					</div>

					{/* Actions */}
					<div className="modal-action">
						<Button
							type="button"
							className="btn btn-ghost"
							onClick={onClose}
							disabled={isSubmitting}
						>
							Cancelar
						</Button>
						<Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<span className="loading loading-spinner loading-sm" />
									Criando...
								</>
							) : (
								"Criar Orçamento"
							)}
						</Button>
					</div>
				</form>
			</div>
			<button
				type="button"
				className="modal-backdrop"
				onClick={onClose}
				aria-label="Close modal"
			/>
		</div>
	);
}
