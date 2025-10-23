"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { toast } from "sonner";
import type { ProjectStatus, ProjectPriority } from "@/types/project";

interface ProjectInfoProps {
	project: any;
}

const statusConfig = {
	planning: { label: "Planning", color: "badge-info" },
	"in-progress": { label: "In Progress", color: "badge-primary" },
	"on-hold": { label: "On Hold", color: "badge-warning" },
	completed: { label: "Completed", color: "badge-success" },
	cancelled: { label: "Cancelled", color: "badge-error" },
};

const priorityConfig = {
	low: { label: "Low", color: "badge-ghost" },
	medium: { label: "Medium", color: "badge-info" },
	high: { label: "High", color: "badge-warning" },
	urgent: { label: "Urgent", color: "badge-error" },
};

export function ProjectInfo({ project }: ProjectInfoProps) {
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const updateProject = useMutation(api.projects.updateProject);
	const deleteProject = useMutation(api.projects.deleteProject);

	const [formData, setFormData] = useState({
		name: project.name,
		client: project.client,
		description: project.description,
		status: project.status as ProjectStatus,
		priority: project.priority as ProjectPriority,
		startDate: new Date(project.startDate).toISOString().split("T")[0],
		endDate: new Date(project.endDate).toISOString().split("T")[0],
		progress: project.progress,
		budgetTotal: project.budget.total,
		budgetSpent: project.budget.spent,
		tags: project.tags.join(", "),
		notes: project.notes || "",
	});

	const [files, setFiles] = useState<Array<{ name: string; url: string; size: number; uploadedAt: number }>>(
		project.files || []
	);
	const [uploadingFile, setUploadingFile] = useState(false);

	const handleSave = async () => {
		setIsSubmitting(true);
		try {
			await updateProject({
				id: project._id,
				name: formData.name,
				client: formData.client,
				description: formData.description,
				status: formData.status,
				priority: formData.priority,
				startDate: new Date(formData.startDate).getTime(),
				endDate: new Date(formData.endDate).getTime(),
				progress: formData.progress,
				budget: {
					total: formData.budgetTotal,
					spent: formData.budgetSpent,
					remaining: formData.budgetTotal - formData.budgetSpent,
				},
				tags: formData.tags
					.split(",")
					.map((tag: string) => tag.trim())
					.filter((tag: string) => tag.length > 0),
				notes: formData.notes,
				files: files,
			});

			toast.success("Projeto atualizado com sucesso!");
			setIsEditing(false);
		} catch (error) {
			console.error("Failed to update project:", error);
			toast.error("Falha ao atualizar projeto. Tente novamente.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			name: project.name,
			client: project.client,
			description: project.description,
			status: project.status,
			priority: project.priority,
			startDate: new Date(project.startDate).toISOString().split("T")[0],
			endDate: new Date(project.endDate).toISOString().split("T")[0],
			progress: project.progress,
			budgetTotal: project.budget.total,
			budgetSpent: project.budget.spent,
			tags: project.tags.join(", "),
			notes: project.notes || "",
		});
		setFiles(project.files || []);
		setIsEditing(false);
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadingFile(true);
		try {
			// Simulate file upload (in production, upload to storage service)
			const fileData = {
				name: file.name,
				url: URL.createObjectURL(file), // In production, this would be the actual URL from storage
				size: file.size,
				uploadedAt: Date.now(),
			};

			setFiles([...files, fileData]);
			toast.success("Arquivo adicionado!");
			e.target.value = ""; // Reset input
		} catch (error) {
			console.error("Failed to upload file:", error);
			toast.error("Falha ao fazer upload do arquivo.");
		} finally {
			setUploadingFile(false);
		}
	};

	const handleRemoveFile = (index: number) => {
		const newFiles = files.filter((_, i) => i !== index);
		setFiles(newFiles);
		toast.success("Arquivo removido!");
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
	};

	const handleDelete = async () => {
		if (!confirm("Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.")) {
			return;
		}

		setIsDeleting(true);
		try {
			await deleteProject({ id: project._id });
			toast.success("Projeto excluído com sucesso!");
			router.push("/projects");
		} catch (error) {
			console.error("Failed to delete project:", error);
			toast.error("Falha ao excluir projeto. Tente novamente.");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Actions */}
			<div className="flex justify-between items-center">
				<Button
					className="btn btn-error"
					onClick={handleDelete}
					disabled={isDeleting || isSubmitting}
				>
					{isDeleting ? (
						<>
							<span className="loading loading-spinner loading-sm" />
							Excluindo...
						</>
					) : (
						<>
							<span className="iconify lucide--trash-2 size-4" />
							Excluir
						</>
					)}
				</Button>

				<div className="flex gap-2">
					{!isEditing ? (
						<Button className="btn btn-primary" onClick={() => setIsEditing(true)}>
							<span className="iconify lucide--pencil size-4" />
							Editar
						</Button>
					) : (
						<>
							<Button
								className="btn btn-ghost"
								onClick={handleCancel}
								disabled={isSubmitting}
							>
								Cancelar
							</Button>
							<Button
								className="btn btn-primary"
								onClick={handleSave}
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<span className="loading loading-spinner loading-sm" />
										Salvando...
									</>
								) : (
									<>
										<span className="iconify lucide--save size-4" />
										Salvar
									</>
								)}
							</Button>
						</>
					)}
				</div>
			</div>

			{/* Main Info Card */}
			<div className="card bg-base-100 border border-base-300">
				<div className="card-body">
					<h2 className="card-title text-lg mb-4">Informações do Projeto</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Name */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">Nome do Projeto</span>
							</label>
							{isEditing ? (
								<input
									type="text"
									className="input input-bordered"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								/>
							) : (
								<p className="text-base-content">{project.name}</p>
							)}
						</div>

						{/* Client */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">Cliente</span>
							</label>
							{isEditing ? (
								<input
									type="text"
									className="input input-bordered"
									value={formData.client}
									onChange={(e) => setFormData({ ...formData, client: e.target.value })}
								/>
							) : (
								<p className="text-base-content">{project.client}</p>
							)}
						</div>

						{/* Description - Full width */}
						<div className="form-control md:col-span-2">
							<label className="label">
								<span className="label-text font-semibold">Descrição</span>
							</label>
							{isEditing ? (
								<textarea
									className="textarea textarea-bordered h-24"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
								/>
							) : (
								<p className="text-base-content">{project.description}</p>
							)}
						</div>

						{/* Status */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">Status</span>
							</label>
							{isEditing ? (
								<select
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
							) : (
								<span className={`badge ${statusConfig[project.status as keyof typeof statusConfig].color}`}>
									{statusConfig[project.status as keyof typeof statusConfig].label}
								</span>
							)}
						</div>

						{/* Priority */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">Prioridade</span>
							</label>
							{isEditing ? (
								<select
									className="select select-bordered"
									value={formData.priority}
									onChange={(e) =>
										setFormData({
											...formData,
											priority: e.target.value as ProjectPriority,
										})
									}
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
									<option value="urgent">Urgent</option>
								</select>
							) : (
								<span className={`badge ${priorityConfig[project.priority as keyof typeof priorityConfig].color}`}>
									{priorityConfig[project.priority as keyof typeof priorityConfig].label}
								</span>
							)}
						</div>

						{/* Start Date */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">Data de Início</span>
							</label>
							{isEditing ? (
								<input
									type="date"
									className="input input-bordered"
									value={formData.startDate}
									onChange={(e) =>
										setFormData({ ...formData, startDate: e.target.value })
									}
								/>
							) : (
								<p className="text-base-content">
									{new Date(project.startDate).toLocaleDateString("pt-BR")}
								</p>
							)}
						</div>

						{/* End Date */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">Data de Término</span>
							</label>
							{isEditing ? (
								<input
									type="date"
									className="input input-bordered"
									value={formData.endDate}
									onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
								/>
							) : (
								<p className="text-base-content">
									{new Date(project.endDate).toLocaleDateString("pt-BR")}
								</p>
							)}
						</div>

						{/* Progress */}
						<div className="form-control md:col-span-2">
							<label className="label">
								<span className="label-text font-semibold">
									Progresso: {isEditing ? formData.progress : project.progress}%
								</span>
							</label>
							{isEditing ? (
								<input
									type="range"
									className="range range-primary"
									min="0"
									max="100"
									step="5"
									value={formData.progress}
									onChange={(e) =>
										setFormData({ ...formData, progress: Number(e.target.value) })
									}
								/>
							) : (
								<progress
									className="progress progress-primary w-full h-4"
									value={project.progress}
									max="100"
								/>
							)}
						</div>

						{/* Budget Total */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">Orçamento Total</span>
							</label>
							{isEditing ? (
								<input
									type="number"
									className="input input-bordered"
									value={formData.budgetTotal}
									onChange={(e) =>
										setFormData({ ...formData, budgetTotal: Number(e.target.value) })
									}
									min="0"
								/>
							) : (
								<p className="text-base-content">
									${project.budget.total.toLocaleString()}
								</p>
							)}
						</div>

						{/* Budget Spent */}
						<div className="form-control">
							<label className="label">
								<span className="label-text font-semibold">Orçamento Gasto</span>
							</label>
							{isEditing ? (
								<input
									type="number"
									className="input input-bordered"
									value={formData.budgetSpent}
									onChange={(e) =>
										setFormData({ ...formData, budgetSpent: Number(e.target.value) })
									}
									min="0"
								/>
							) : (
								<p className="text-base-content">
									${project.budget.spent.toLocaleString()}
								</p>
							)}
						</div>

						{/* Tags */}
						<div className="form-control md:col-span-2">
							<label className="label">
								<span className="label-text font-semibold">Tags</span>
							</label>
							{isEditing ? (
								<input
									type="text"
									className="input input-bordered"
									placeholder="design, development, urgent (separadas por vírgula)"
									value={formData.tags}
									onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
								/>
							) : (
								<div className="flex flex-wrap gap-2">
									{project.tags.map((tag: string) => (
										<span key={tag} className="badge badge-ghost">
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Team Card */}
			<div className="card bg-base-100 border border-base-300">
				<div className="card-body">
					<h2 className="card-title text-lg mb-4">Equipe do Projeto</h2>
					{project.team.length === 0 ? (
						<p className="text-base-content/60">Nenhum membro adicionado</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{project.team.map((member: any) => (
								<div
									key={member._id}
									className="flex items-center gap-3 p-3 border border-base-300 rounded-lg"
								>
									<div className="avatar">
										<div className="w-10 rounded-full">
											<Image
												src={member.avatar || "/default-avatar.png"}
												alt={member.name}
												width={40}
												height={40}
											/>
										</div>
									</div>
									<div>
										<p className="font-medium">{member.name}</p>
										<p className="text-xs text-base-content/60">{member.role}</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Notes Card */}
			<div className="card bg-base-100 border border-base-300">
				<div className="card-body">
					<h2 className="card-title text-lg mb-4">Notas</h2>
					{isEditing ? (
						<textarea
							className="textarea textarea-bordered h-32"
							placeholder="Adicione notas sobre o projeto..."
							value={formData.notes}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
						/>
					) : (
						<div className="text-base-content">
							{project.notes ? (
								<p className="whitespace-pre-wrap">{project.notes}</p>
							) : (
								<p className="text-base-content/60">Nenhuma nota adicionada</p>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Files Card */}
			<div className="card bg-base-100 border border-base-300">
				<div className="card-body">
					<div className="flex items-center justify-between mb-4">
						<h2 className="card-title text-lg">Arquivos</h2>
						{isEditing && (
							<div className="relative">
								<input
									type="file"
									id="file-upload"
									className="hidden"
									onChange={handleFileUpload}
									disabled={uploadingFile}
								/>
								<label
									htmlFor="file-upload"
									className="btn btn-sm btn-primary cursor-pointer"
								>
									{uploadingFile ? (
										<>
											<span className="loading loading-spinner loading-xs" />
											Uploading...
										</>
									) : (
										<>
											<span className="iconify lucide--upload size-4" />
											Upload
										</>
									)}
								</label>
							</div>
						)}
					</div>

					{files.length === 0 ? (
						<p className="text-base-content/60">Nenhum arquivo adicionado</p>
					) : (
						<div className="space-y-2">
							{files.map((file, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 border border-base-300 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<span className="iconify lucide--file size-5 text-base-content/60" />
										<div>
											<p className="font-medium text-sm">{file.name}</p>
											<p className="text-xs text-base-content/60">
												{formatFileSize(file.size)} •{" "}
												{new Date(file.uploadedAt).toLocaleDateString("pt-BR")}
											</p>
										</div>
									</div>
									<div className="flex gap-2">
										<a
											href={file.url}
											download={file.name}
											className="btn btn-ghost btn-sm"
										>
											<span className="iconify lucide--download size-4" />
										</a>
										{isEditing && (
											<button
												onClick={() => handleRemoveFile(index)}
												className="btn btn-ghost btn-sm text-error"
											>
												<span className="iconify lucide--trash-2 size-4" />
											</button>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
