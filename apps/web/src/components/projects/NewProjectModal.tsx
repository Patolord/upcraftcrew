"use client";

import { useState, useId } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@/components/ui/button";
import type { ProjectStatus, ProjectPriority } from "@/types/project";

interface NewProjectModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createProject = useMutation(api.projects.createProject);
	const formId = useId();

	const [formData, setFormData] = useState({
		name: "",
		client: "",
		description: "",
		status: "planning" as ProjectStatus,
		priority: "medium" as ProjectPriority,
		startDate: new Date().toISOString().split("T")[0],
		endDate: "",
		progress: 0,
		budgetTotal: 0,
		budgetSpent: 0,
		tags: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await createProject({
				name: formData.name,
				client: formData.client,
				description: formData.description,
				status: formData.status,
				priority: formData.priority,
				startDate: new Date(formData.startDate).getTime(),
				endDate: formData.endDate ? new Date(formData.endDate).getTime() : new Date().getTime(),
				progress: formData.progress,
				budget: {
					total: formData.budgetTotal,
					spent: formData.budgetSpent,
					remaining: formData.budgetTotal - formData.budgetSpent,
				},
				teamIds: [],
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter((tag) => tag.length > 0),
			});

			// Reset form
			setFormData({
				name: "",
				client: "",
				description: "",
				status: "planning",
				priority: "medium",
				startDate: new Date().toISOString().split("T")[0],
				endDate: "",
				progress: 0,
				budgetTotal: 0,
				budgetSpent: 0,
				tags: "",
			});

			onClose();
		} catch (error) {
			console.error("Failed to create project:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box max-w-2xl">
				<h3 className="font-bold text-lg mb-4">Create New Project</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Name */}
					<div className="form-control">
						<label htmlFor={`${formId}-name`} className="label">
							<span className="label-text">Project Name *</span>
						</label>
						<input
							id={`${formId}-name`}
							type="text"
							className="input input-bordered"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							required
						/>
					</div>

					{/* Client */}
					<div className="form-control">
						<label htmlFor={`${formId}-client`} className="label">
							<span className="label-text">Client *</span>
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

					{/* Description */}
					<div className="form-control">
						<label htmlFor={`${formId}-description`} className="label">
							<span className="label-text">Description *</span>
						</label>
						<textarea
							id={`${formId}-description`}
							className="textarea textarea-bordered h-24"
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							required
						/>
					</div>

					{/* Status and Priority */}
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
									setFormData({ ...formData, status: e.target.value as ProjectStatus })
								}
							>
								<option value="planning">Planning</option>
								<option value="in-progress">In Progress</option>
								<option value="on-hold">On Hold</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
							</select>
						</div>
						<div className="form-control">
							<label htmlFor={`${formId}-priority`} className="label">
								<span className="label-text">Priority</span>
							</label>
							<select
								id={`${formId}-priority`}
								className="select select-bordered"
								value={formData.priority}
								onChange={(e) =>
									setFormData({ ...formData, priority: e.target.value as ProjectPriority })
								}
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
								<option value="urgent">Urgent</option>
							</select>
						</div>
					</div>

					{/* Dates */}
					<div className="grid grid-cols-2 gap-4">
						<div className="form-control">
							<label htmlFor={`${formId}-start-date`} className="label">
								<span className="label-text">Start Date *</span>
							</label>
							<input
								id={`${formId}-start-date`}
								type="date"
								className="input input-bordered"
								value={formData.startDate}
								onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
								required
							/>
						</div>
						<div className="form-control">
							<label htmlFor={`${formId}-end-date`} className="label">
								<span className="label-text">End Date</span>
							</label>
							<input
								id={`${formId}-end-date`}
								type="date"
								className="input input-bordered"
								value={formData.endDate}
								onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
							/>
						</div>
					</div>

					{/* Budget */}
					<div className="grid grid-cols-2 gap-4">
						<div className="form-control">
							<label htmlFor={`${formId}-budget-total`} className="label">
								<span className="label-text">Total Budget</span>
							</label>
							<input
								id={`${formId}-budget-total`}
								type="number"
								className="input input-bordered"
								value={formData.budgetTotal}
								onChange={(e) =>
									setFormData({ ...formData, budgetTotal: Number(e.target.value) })
								}
								min="0"
							/>
						</div>
						<div className="form-control">
							<label htmlFor={`${formId}-budget-spent`} className="label">
								<span className="label-text">Spent</span>
							</label>
							<input
								id={`${formId}-budget-spent`}
								type="number"
								className="input input-bordered"
								value={formData.budgetSpent}
								onChange={(e) =>
									setFormData({ ...formData, budgetSpent: Number(e.target.value) })
								}
								min="0"
							/>
						</div>
					</div>

					{/* Progress */}
					<div className="form-control">
						<label htmlFor={`${formId}-progress`} className="label">
							<span className="label-text">Progress: {formData.progress}%</span>
						</label>
						<input
							id={`${formId}-progress`}
							type="range"
							className="range range-primary"
							value={formData.progress}
							onChange={(e) =>
								setFormData({ ...formData, progress: Number(e.target.value) })
							}
							min="0"
							max="100"
							step="5"
						/>
					</div>

					{/* Tags */}
					<div className="form-control">
						<label htmlFor={`${formId}-tags`} className="label">
							<span className="label-text">Tags (comma separated)</span>
						</label>
						<input
							id={`${formId}-tags`}
							type="text"
							className="input input-bordered"
							placeholder="design, development, urgent"
							value={formData.tags}
							onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
								"Create Project"
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
