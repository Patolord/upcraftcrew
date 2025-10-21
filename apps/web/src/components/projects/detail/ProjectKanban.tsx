"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { adaptConvexProject } from "@/lib/utils/project-adapter";
import type { ProjectStatus } from "@/types/project";

interface ProjectKanbanProps {
	projectId: Id<"projects">;
}

export function ProjectKanban({ projectId }: ProjectKanbanProps) {
	const [searchQuery, setSearchQuery] = useState("");

	// Fetch only this project
	const convexProject = useQuery(api.projects.getProjectById, { id: projectId });

	// Transform to array for kanban board
	const projects = useMemo(() => {
		if (!convexProject) return [];
		return [adaptConvexProject(convexProject)];
	}, [convexProject]);

	// Filter based on search
	const filteredProjects = useMemo(() => {
		if (!searchQuery) return projects;

		return projects.filter((project) => {
			const matchesSearch =
				project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesSearch;
		});
	}, [projects, searchQuery]);

	// Group by status - for this single project, we show it in its current status column
	const columns = useMemo(() => {
		const statuses: ProjectStatus[] = [
			"planning",
			"in-progress",
			"on-hold",
			"completed",
			"cancelled",
		];

		return statuses.map((status) => ({
			id: status,
			title: status
				.split("-")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" "),
			projects: filteredProjects.filter((p) => p.status === status),
		}));
	}, [filteredProjects]);

	// Loading state
	if (convexProject === undefined) {
		return (
			<div className="flex items-center justify-center py-12">
				<span className="loading loading-spinner loading-lg" />
			</div>
		);
	}

	// Error state
	if (convexProject === null) {
		return (
			<div className="alert alert-error">
				<span className="iconify lucide--alert-circle size-5" />
				<span>Failed to load project. Please try again later.</span>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Search */}
			<div className="flex items-center gap-3">
				<label className="input input-bordered flex items-center gap-2 flex-1">
					<span className="iconify lucide--search size-4 text-base-content/60" />
					<input
						type="text"
						className="grow"
						placeholder="Buscar no projeto..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</label>
			</div>

			{/* Info Alert */}
			<div className="alert alert-info">
				<span className="iconify lucide--info size-5" />
				<div>
					<h3 className="font-bold">Kanban do Projeto</h3>
					<p className="text-sm">
						Arraste o card do projeto entre as colunas para alterar seu status.
					</p>
				</div>
			</div>

			{/* Kanban Board */}
			<KanbanBoard columns={columns} />
		</div>
	);
}
