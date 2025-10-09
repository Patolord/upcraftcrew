"use client";

import { useState } from "react";
import { Image } from "@/components/ui/image";
import { mockProjects } from "@/lib/mock-data/projects";
import type { Project, ProjectStatus } from "@/types/project";
import { Button } from "@/components/ui/button";

const statusConfig = {
	planning: {
		label: "Planning",
		color: "badge-info",
	},
	"in-progress": {
		label: "In Progress",
		color: "badge-primary",
	},
	"on-hold": {
		label: "On Hold",
		color: "badge-warning",
	},
	completed: {
		label: "Completed",
		color: "badge-success",
	},
	cancelled: {
		label: "Cancelled",
		color: "badge-error",
	},
};

const priorityConfig = {
	low: {
		label: "Low",
		color: "text-base-content/60",
	},
	medium: {
		label: "Medium",
		color: "text-info",
	},
	high: {
		label: "High",
		color: "text-warning",
	},
	urgent: {
		label: "Urgent",
		color: "text-error",
	},
};

function ProjectCard({ project }: { project: Project }) {
	const status = statusConfig[project.status];
	const priority = priorityConfig[project.priority];

	return (
		<div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow">
			<div className="card-body">
				{/* Header */}
				<div className="flex items-start justify-between gap-3">
					<div className="flex-1">
						<h3 className="card-title text-lg">{project.name}</h3>
						{project.client && (
							<p className="text-sm text-base-content/60 mt-1">
								{project.client}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<span className={`badge ${status.color} badge-sm`}>
							{status.label}
						</span>
					</div>
				</div>

				{/* Description */}
				<p className="text-sm text-base-content/70 mt-2 line-clamp-2">
					{project.description}
				</p>

				{/* Progress */}
				<div className="mt-4">
					<div className="flex items-center justify-between mb-1">
						<span className="text-xs text-base-content/60">Progress</span>
						<span className="text-xs font-medium">{project.progress}%</span>
					</div>
					<progress
						className="progress progress-primary w-full"
						value={project.progress}
						max="100"
					/>
				</div>

				{/* Budget & Team */}
				<div className="grid grid-cols-2 gap-3 mt-4">
					{project.budget && (
						<div>
							<p className="text-xs text-base-content/60 mb-1">Budget</p>
							<p>
								${project.spent?.toLocaleString() || 0} / $
								{project.budget.toLocaleString()}
							</p>
						</div>
					)}
					<div>
						<p className="text-xs text-base-content/60 mb-1">Timeline</p>
						<p className="text-sm font-medium">
							{new Date(project.startDate).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
							})}
							{project.endDate &&
								` - ${new Date(project.endDate).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}`}
						</p>
					</div>
				</div>

				{/* Team Avatars */}
				{project.team.length > 0 && (
					<div className="mt-4">
						<div className="flex items-center justify-between">
							<div className="avatar-group -space-x-4">
								{project.team.slice(0, 4).map((member) => (
									<div key={member.id} className="avatar border-2 border-base-100">
										<div className="w-8">
											<Image src={member.avatar} alt={member.name} width={28} height={28} />
										</div>
									</div>
								))}
								{project.team.length > 4 && (
									<div className="avatar placeholder border-2 border-base-100">
										<div className="w-8 bg-base-300">
											<span className="text-xs">+{project.team.length - 4}</span>
										</div>
									</div>
								)}
							</div>
							<span className={`text-xs font-medium ${priority.color}`}>
								<span className="iconify lucide--flag size-3 inline mr-1" />
								{priority.label}
							</span>
						</div>
					</div>
				)}

				{/* Tags */}
				{project.tags && project.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-3">
						{project.tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="badge badge-sm badge-ghost text-xs"
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{/* Actions */}
				<div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
					<Button className="btn btn-ghost btn-sm">
						<span className="iconify lucide--eye size-4" />
						View
					</Button>
					<Button className="btn btn-ghost btn-sm">
						<span className="iconify lucide--pencil size-4" />
						Edit
					</Button>
				</div>
			</div>
		</div>
	);
}

export default function ProjectsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

	const filteredProjects = mockProjects.filter((project) => {
		const matchesSearch =
			project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.client?.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || project.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Projects</h1>
					<p className="text-base-content/60 text-sm mt-1">
						Manage and track all your projects
					</p>
				</div>
				<Button className="btn btn-primary gap-2">
					<span className="iconify lucide--plus size-5" />
					New Project
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Total Projects</div>
						<div className="stat-value text-2xl">{mockProjects.length}</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">In Progress</div>
						<div className="stat-value text-2xl text-primary">
							{
								mockProjects.filter((p) => p.status === "in-progress")
									.length
							}
						</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Completed</div>
						<div className="stat-value text-2xl text-success">
							{mockProjects.filter((p) => p.status === "completed").length}
						</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">On Hold</div>
						<div className="stat-value text-2xl text-warning">
							{mockProjects.filter((p) => p.status === "on-hold").length}
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="flex-1">
					<label className="input input-bordered flex items-center gap-2">
						<span className="iconify lucide--search size-4 text-base-content/60" />
						<input
							type="text"
							className="grow"
							placeholder="Search projects..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</label>
				</div>
				<select
					className="select select-bordered w-full sm:w-48"
					value={statusFilter}
					onChange={(e) =>
						setStatusFilter(e.target.value as ProjectStatus | "all")
					}
				>
					<option value="all">All Status</option>
					<option value="planning">Planning</option>
					<option value="in-progress">In Progress</option>
					<option value="on-hold">On Hold</option>
					<option value="completed">Completed</option>
					<option value="cancelled">Cancelled</option>
				</select>
				<div className="join">
					<Button
						className={`btn join-item ${viewMode === "grid" ? "btn-active" : ""}`}
						onClick={() => setViewMode("grid")}
					>
						<span className="iconify lucide--layout-grid size-4" />
					</Button>
					<Button
						className={`btn join-item ${viewMode === "list" ? "btn-active" : ""}`}
						onClick={() => setViewMode("list")}
					>
						<span className="iconify lucide--list size-4" />
					</Button>
				</div>
			</div>

			{/* Projects Grid/List */}
			{filteredProjects.length === 0 ? (
				<div className="text-center py-12">
					<span className="iconify lucide--folder-search size-16 text-base-content/20 mb-4" />
					<h3 className="text-lg font-medium mb-2">No projects found</h3>
					<p className="text-base-content/60 text-sm">
						Try adjusting your search or filters
					</p>
				</div>
			) : (
				<div
					className={
						viewMode === "grid"
							? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
							: "space-y-3"
					}
				>
					{filteredProjects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			)}
		</div>
	);
}