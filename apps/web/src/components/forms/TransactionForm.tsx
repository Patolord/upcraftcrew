"use client";

import { useId, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TransactionCategory, TransactionType } from "@/types/finance";
import { categoryConfig } from "@/app/(admin)/finance/config";
import { toast } from "sonner";

// Validation schema
const transactionSchema = z.object({
	description: z.string().min(1, "Description is required"),
	amount: z.number().positive("Amount must be positive"),
	type: z.enum(["income", "expense"]),
	category: z.string().min(1, "Category is required"),
	status: z.enum(["pending", "completed"]),
	date: z.number(),
	clientId: z.string().optional(),
	projectId: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	transaction?: {
		id: string;
		title: string;
		description?: string;
		amount: number;
		type: TransactionType;
		category: TransactionCategory;
		status: "pending" | "completed";
		date: string;
		projectId?: string;
		client?: string;
	};
	mode?: "create" | "edit";
}

export function TransactionForm({
	open,
	onOpenChange,
	transaction,
	mode = "create",
}: TransactionFormProps) {
	const descriptionId = useId();
	const amountId = useId();
	const categoryId = useId();
	const statusId = useId();
	const dateId = useId();
	const projectId = useId();
	const clientId = useId();

	const createTransaction = useMutation(api.finance.createTransaction);
	const updateTransaction = useMutation(api.finance.updateTransaction);
	const deleteTransaction = useMutation(api.finance.deleteTransaction);
	const projects = useQuery(api.projects.getProjects);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Form state
	const [formData, setFormData] = useState<TransactionFormData>({
		description: transaction?.description || "",
		amount: transaction?.amount || 0,
		type: transaction?.type || "income",
		category: transaction?.category || "project-payment",
		status: transaction?.status || "pending",
		date: transaction?.date ? new Date(transaction.date).getTime() : Date.now(),
		clientId: transaction?.client || "",
		projectId: transaction?.projectId || "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setErrors({});

		try {
			// Validate form data
			const validatedData = transactionSchema.parse(formData);

			if (mode === "edit" && transaction) {
				// Update existing transaction
				await updateTransaction({
					id: transaction.id as Id<"transactions">,
					...validatedData,
					projectId: validatedData.projectId
						? (validatedData.projectId as Id<"projects">)
						: undefined,
				});
				toast.success("Transaction updated successfully");
			} else {
				// Create new transaction
				await createTransaction({
					...validatedData,
					projectId: validatedData.projectId
						? (validatedData.projectId as Id<"projects">)
						: undefined,
				});
				toast.success("Transaction created successfully");
			}

			onOpenChange(false);
			// Reset form
			setFormData({
				description: "",
				amount: 0,
				type: "income",
				category: "project-payment",
				status: "pending",
				date: Date.now(),
				clientId: "",
				projectId: "",
			});
		} catch (error) {
			if (error instanceof z.ZodError) {
				const fieldErrors: Record<string, string> = {};
				for (const err of error.issues) {
					fieldErrors[err.path[0] as string] = err.message;
				}
				setErrors(fieldErrors);
			} else {
				console.error("Transaction error:", error);
				toast.error("Failed to save transaction");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		if (!transaction) return;

		if (
			!window.confirm(
				"Are you sure you want to delete this transaction? This action cannot be undone.",
			)
		) {
			return;
		}

		setIsSubmitting(true);
		try {
			await deleteTransaction({ id: transaction.id as Id<"transactions"> });
			toast.success("Transaction deleted successfully");
			onOpenChange(false);
		} catch (error) {
			console.error("Delete transaction error:", error);
			toast.error("Failed to delete transaction");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Edit Transaction" : "New Transaction"}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? "Update the transaction details below."
							: "Add a new income or expense transaction."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Type Selection */}
					<div className="space-y-2">
						<div className="text-sm font-medium">Type</div>
						<div className="flex gap-2">
							<button
								type="button"
								className={`btn flex-1 ${
									formData.type === "income" ? "btn-success" : "btn-outline"
								}`}
								onClick={() => setFormData({ ...formData, type: "income" })}
							>
								<span className="iconify lucide--arrow-down-left size-4" />
								Income
							</button>
							<button
								type="button"
								className={`btn flex-1 ${
									formData.type === "expense" ? "btn-error" : "btn-outline"
								}`}
								onClick={() => setFormData({ ...formData, type: "expense" })}
							>
								<span className="iconify lucide--arrow-up-right size-4" />
								Expense
							</button>
						</div>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<label htmlFor={descriptionId} className="text-sm font-medium">
							Description
						</label>
						<Input
							id={descriptionId}
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="Enter transaction description"
							className={errors.description ? "border-error" : ""}
						/>
						{errors.description && (
							<p className="text-xs text-error">{errors.description}</p>
						)}
					</div>

					{/* Amount */}
					<div className="space-y-2">
						<label htmlFor={amountId} className="text-sm font-medium">
							Amount
						</label>
						<Input
							id={amountId}
							type="number"
							step="0.01"
							value={formData.amount}
							onChange={(e) =>
								setFormData({ ...formData, amount: Number(e.target.value) })
							}
							placeholder="0.00"
							className={errors.amount ? "border-error" : ""}
						/>
						{errors.amount && (
							<p className="text-xs text-error">{errors.amount}</p>
						)}
					</div>

					{/* Category */}
					<div className="space-y-2">
						<label htmlFor={categoryId} className="text-sm font-medium">
							Category
						</label>
						<select
							id={categoryId}
							value={formData.category}
							onChange={(e) =>
								setFormData({ ...formData, category: e.target.value })
							}
							className={`select select-bordered w-full ${
								errors.category ? "border-error" : ""
							}`}
						>
							{Object.entries(categoryConfig).map(([key, config]) => (
								<option key={key} value={key}>
									{config.label}
								</option>
							))}
						</select>
						{errors.category && (
							<p className="text-xs text-error">{errors.category}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						{/* Status */}
						<div className="space-y-2">
							<label htmlFor={statusId} className="text-sm font-medium">
								Status
							</label>
							<select
								id={statusId}
								value={formData.status}
								onChange={(e) =>
									setFormData({
										...formData,
										status: e.target.value as "pending" | "completed",
									})
								}
								className="select select-bordered w-full"
							>
								<option value="pending">Pending</option>
								<option value="completed">Completed</option>
							</select>
						</div>

						{/* Date */}
						<div className="space-y-2">
							<label htmlFor={dateId} className="text-sm font-medium">
								Date
							</label>
							<Input
								id={dateId}
								type="date"
								value={new Date(formData.date).toISOString().split("T")[0]}
								onChange={(e) =>
									setFormData({
										...formData,
										date: new Date(e.target.value).getTime(),
									})
								}
							/>
						</div>
					</div>

					{/* Project */}
					<div className="space-y-2">
						<label htmlFor={projectId} className="text-sm font-medium">
							Project (optional)
						</label>
						<select
							id={projectId}
							value={formData.projectId || ""}
							onChange={(e) =>
								setFormData({ ...formData, projectId: e.target.value })
							}
							className="select select-bordered w-full"
							disabled={!projects}
						>
							<option value="">No project</option>
							{projects?.map((project) => (
								<option key={project._id} value={project._id}>
									{project.name} - {project.client}
								</option>
							))}
						</select>
					</div>

					{/* Client */}
					<div className="space-y-2">
						<label htmlFor={clientId} className="text-sm font-medium">
							Client (optional)
						</label>
						<Input
							id={clientId}
							value={formData.clientId || ""}
							onChange={(e) =>
								setFormData({ ...formData, clientId: e.target.value })
							}
							placeholder="Enter client name"
						/>
					</div>

					<DialogFooter className="gap-2">
						{mode === "edit" && (
							<Button
								type="button"
								className="btn btn-error btn-outline mr-auto"
								onClick={handleDelete}
								disabled={isSubmitting}
							>
								<span className="iconify lucide--trash-2 size-4" />
								Delete
							</Button>
						)}
						<Button
							type="button"
							className="btn btn-ghost"
							onClick={() => onOpenChange(false)}
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
									{mode === "edit" ? "Updating..." : "Creating..."}
								</>
							) : (
								<>
									<span className="iconify lucide--check size-4" />
									{mode === "edit" ? "Update" : "Create"}
								</>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
