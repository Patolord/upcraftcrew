"use client";

import { useState, useId } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Id } from "@workspace/backend/_generated/dataModel";

interface NewTransactionModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createTransaction = useMutation(api.finance.createTransaction);
	const projects = useQuery(api.projects.getProjects);
	const formId = useId();

	const [formData, setFormData] = useState({
		description: "",
		amount: 0,
		type: "income" as "income" | "expense",
		category: "",
		status: "pending" as "pending" | "completed" | "failed" | "cancelled",
		date: new Date().toISOString().split("T")[0],
		clientId: "",
		projectId: "" as string,
	});

	const categories = {
		income: [
			"Project Payment",
			"Consulting",
			"Retainer",
			"Licensing",
			"Investment",
			"Other Income",
		],
		expense: [
			"Salaries",
			"Software & Tools",
			"Marketing",
			"Office Rent",
			"Equipment",
			"Travel",
			"Training",
			"Other Expense",
		],
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await createTransaction({
				description: formData.description,
				amount: formData.amount,
				type: formData.type,
				category: formData.category,
				status: formData.status,
				date: new Date(formData.date).getTime(),
				clientId: formData.clientId || undefined,
				projectId: formData.projectId ? (formData.projectId as Id<"projects">) : undefined,
			});

			toast.success("Transaction created successfully!");

			// Reset form
			setFormData({
				description: "",
				amount: 0,
				type: "income",
				category: "",
				status: "pending",
				date: new Date().toISOString().split("T")[0],
				clientId: "",
				projectId: "",
			});

			onClose();
		} catch (error) {
			console.error("Failed to create transaction:", error);
			toast.error("Failed to create transaction. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-2xl">
				<h3 className="font-bold text-lg mb-4">Add New Transaction</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Description */}
					<div className="form-control">
						<label htmlFor={`${formId}-description`} className="label">
							<span className="label-text">Description *</span>
						</label>
						<input
							id={`${formId}-description`}
							type="text"
							className="input input-bordered"
							placeholder="e.g., Website Development Payment"
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							required
						/>
					</div>

					{/* Type and Amount */}
					<div className="grid grid-cols-2 gap-4">
						<div className="form-control">
							<label htmlFor={`${formId}-type`} className="label">
								<span className="label-text">Type *</span>
							</label>
							<select
								id={`${formId}-type`}
								className="select select-bordered"
								value={formData.type}
								onChange={(e) => {
									setFormData({
										...formData,
										type: e.target.value as typeof formData.type,
										category: "" // Reset category when type changes
									});
								}}
								required
							>
								<option value="income">Income</option>
								<option value="expense">Expense</option>
							</select>
						</div>
						<div className="form-control">
							<label htmlFor={`${formId}-amount`} className="label">
								<span className="label-text">Amount *</span>
							</label>
							<div className="input-group">
								<span className="bg-base-200 px-4 flex items-center border border-base-300 border-r-0 rounded-l-lg">$</span>
								<input
									id={`${formId}-amount`}
									type="number"
									className="input input-bordered w-full rounded-l-none"
									step="0.01"
									min="0"
									value={formData.amount}
									onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
									required
								/>
							</div>
						</div>
					</div>

					{/* Category */}
					<div className="form-control">
						<label htmlFor={`${formId}-category`} className="label">
							<span className="label-text">Category *</span>
						</label>
						<select
							id={`${formId}-category`}
							className="select select-bordered"
							value={formData.category}
							onChange={(e) => setFormData({ ...formData, category: e.target.value })}
							required
						>
							<option value="">Select Category</option>
							{categories[formData.type].map((cat) => (
								<option key={cat} value={cat}>
									{cat}
								</option>
							))}
						</select>
					</div>

					{/* Status and Date */}
					<div className="grid grid-cols-2 gap-4">
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
								<option value="pending">Pending</option>
								<option value="completed">Completed</option>
								<option value="failed">Failed</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>
						<div className="form-control">
							<label htmlFor={`${formId}-date`} className="label">
								<span className="label-text">Date *</span>
							</label>
							<input
								id={`${formId}-date`}
								type="date"
								className="input input-bordered"
								value={formData.date}
								onChange={(e) => setFormData({ ...formData, date: e.target.value })}
								required
							/>
						</div>
					</div>

					{/* Client ID */}
					<div className="form-control">
						<label htmlFor={`${formId}-client`} className="label">
							<span className="label-text">Client/Vendor (optional)</span>
						</label>
						<input
							id={`${formId}-client`}
							type="text"
							className="input input-bordered"
							placeholder="Client or Vendor name"
							value={formData.clientId}
							onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
						/>
					</div>

					{/* Project */}
					<div className="form-control">
						<label htmlFor={`${formId}-project`} className="label">
							<span className="label-text">Related Project (optional)</span>
						</label>
						<select
							id={`${formId}-project`}
							className="select select-bordered"
							value={formData.projectId}
							onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
						>
							<option value="">None</option>
							{projects?.map((project) => (
								<option key={project._id} value={project._id}>
									{project.name} - {project.client}
								</option>
							))}
						</select>
					</div>

					{/* Amount Preview */}
					<div className={`alert ${formData.type === 'income' ? 'alert-success' : 'alert-error'}`}>
						<div className="flex items-center gap-2">
							<span className={`iconify ${formData.type === 'income' ? 'lucide--arrow-down-circle' : 'lucide--arrow-up-circle'} size-5`} />
							<div>
								<p className="font-semibold">
									{formData.type === 'income' ? 'Income' : 'Expense'}: ${formData.amount.toLocaleString()}
								</p>
								<p className="text-xs opacity-80">
									{formData.category || 'No category selected'}
								</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="modal-action">
						<Button
							type="button"
							className="btn btn-ghost"
							onClick={onClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="btn btn-primary"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<span className="loading loading-spinner loading-sm" />
									Creating...
								</>
							) : (
								"Add Transaction"
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
