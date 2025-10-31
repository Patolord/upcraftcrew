"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { ProjectStatus } from "@/types/project";
import { adaptConvexProject } from "@/lib/utils/project-adapter";
import { KanbanBoard } from "../../../components/kanban/KanbanBoard";
import { KanbanHeader } from "../../../components/kanban/KanbanHeader";

export default function KanbanPage() {
	const [searchQuery, setSearchQuery] = useState("");

	// Fetch projects from Convex
	const convexProjects = useQuery(api.projects.getProjects);

	// Transform Convex data to Project type
	const projects = useMemo(() => {
		if (!convexProjects) return [];
		return convexProjects.map(adaptConvexProject);
	}, [convexProjects]);

	// Filter projects based on search
	const filteredProjects = useMemo(() => {
		if (!searchQuery) return projects;

		return projects.filter((project) => {
			const matchesSearch =
				project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.client?.toLowerCase().includes(searchQuery.toLowerCase());

			return matchesSearch;
		});
	}, [projects, searchQuery]);

	// Group projects by status
	const columns = useMemo(() => {
		const statuses: ProjectStatus[] = ["planning", "in-progress", "on-hold", "completed", "cancelled"];

		return statuses.map(status => ({
			id: status,
			title: statusTitles[status],
			tasks: filteredTasks
				.filter(t => t.status === status)
				.map(task => ({
					...task,
					assignedUser: task.assignedUser ? {
						_id: task.assignedUser._id,
						name: task.assignedUser.name,
						avatar: task.assignedUser.avatar
					} : undefined,
					project: task.project ? {
						_id: task.project._id,
						name: task.project.name
					} : undefined
				}))
		}));
	}, [filteredProjects]);

	// Loading state
	if (convexProjects === undefined) {
		return (
			<div className="p-6 space-y-6">
				<KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<div className="flex items-center justify-center py-12">
					<span className="loading loading-spinner loading-lg" />
				</div>
			</div>
		);
	}

	// Error state
	if (convexProjects === null) {
		return (
			<div className="p-6 space-y-6">
				<KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<div className="alert alert-error">
					<span className="iconify lucide--alert-circle size-5" />
					<span>Failed to load projects. Please try again later.</span>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
			<KanbanBoard columns={columns} />
		</div>
	);
}
