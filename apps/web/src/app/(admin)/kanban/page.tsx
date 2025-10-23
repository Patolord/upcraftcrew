"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { TaskKanbanBoard } from "../../../components/kanban/TaskKanbanBoard";
import { KanbanHeader } from "../../../components/kanban/KanbanHeader";
import { NewTaskModal } from "../../../components/kanban/NewTaskModal";

type TaskStatus = "todo" | "in-progress" | "review" | "done" | "blocked";

export default function KanbanPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Fetch tasks from Convex
	const tasks = useQuery(api.tasks.getTasks);

	// Filter tasks based on search
	const filteredTasks = useMemo(() => {
		if (!tasks) return [];
		if (!searchQuery) return tasks;

		return tasks.filter((task) => {
			const matchesSearch =
				task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
				task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

			return matchesSearch;
		});
	}, [tasks, searchQuery]);

	// Group tasks by status
	const columns = useMemo(() => {
		const statuses: TaskStatus[] = ["todo", "in-progress", "review", "done", "blocked"];
		const statusTitles: Record<TaskStatus, string> = {
			"todo": "To Do",
			"in-progress": "In Progress",
			"review": "Review",
			"done": "Done",
			"blocked": "Blocked"
		};

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
	}, [filteredTasks]);

	// Loading state
	if (tasks === undefined) {
		return (
			<div className="p-6 space-y-6">
				<KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNewProject={() => setIsModalOpen(true)} />
				<div className="flex items-center justify-center py-12">
					<span className="loading loading-spinner loading-lg" />
				</div>
				<NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
			</div>
		);
	}

	// Error state
	if (tasks === null) {
		return (
			<div className="p-6 space-y-6">
				<KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNewProject={() => setIsModalOpen(true)} />
				<div className="alert alert-error">
					<span className="iconify lucide--alert-circle size-5" />
					<span>Failed to load tasks. Please try again later.</span>
				</div>
				<NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<KanbanHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNewProject={() => setIsModalOpen(true)} />
			<TaskKanbanBoard columns={columns} />
			<NewTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</div>
	);
}
