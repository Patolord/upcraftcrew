import { Image } from "@/components/ui/image";

interface Task {
	_id: string;
	title: string;
	description: string;
	status: "todo" | "in-progress" | "review" | "done" | "blocked";
	priority: "low" | "medium" | "high" | "urgent";
	assignedUser?: {
		_id: string;
		name: string;
		avatar?: string;
	};
	project?: {
		_id: string;
		name: string;
	};
	dueDate?: number;
	tags: string[];
}

const priorityConfig = {
	low: {
		label: "Low",
		color: "text-base-content/60",
		icon: "lucide--flag",
	},
	medium: {
		label: "Medium",
		color: "text-info",
		icon: "lucide--flag",
	},
	high: {
		label: "High",
		color: "text-warning",
		icon: "lucide--flag",
	},
	urgent: {
		label: "Urgent",
		color: "text-error",
		icon: "lucide--flag",
	},
};

interface TaskCardProps {
	task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
	const priority = priorityConfig[task.priority];
	const isOverdue = task.dueDate && task.dueDate < Date.now();

	return (
		<div className="kanban-card card bg-base-100 shadow-sm hover:shadow-md transition-shadow cursor-move border border-base-300">
			<div className="card-body p-4">
				{/* Header */}
				<div className="flex items-start justify-between gap-2">
					<h4 className="font-semibold text-sm line-clamp-2">{task.title}</h4>
					<span className={`${priority.color}`}>
						<span className={`iconify ${priority.icon} size-4`} />
					</span>
				</div>

				{/* Description */}
				<p className="text-xs text-base-content/70 mt-2 line-clamp-2">
					{task.description}
				</p>

				{/* Project Badge */}
				{task.project && (
					<div className="mt-2">
						<span className="badge badge-sm badge-ghost">
							<span className="iconify lucide--folder size-3 mr-1" />
							{task.project.name}
						</span>
					</div>
				)}

				{/* Tags */}
				{task.tags && task.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-2">
						{task.tags.slice(0, 2).map((tag) => (
							<span key={tag} className="badge badge-xs badge-ghost">
								{tag}
							</span>
						))}
						{task.tags.length > 2 && (
							<span className="badge badge-xs badge-ghost">
								+{task.tags.length - 2}
							</span>
						)}
					</div>
				)}

				{/* Footer */}
				<div className="flex items-center justify-between mt-3 pt-3 border-t border-base-300">
					{/* Assigned User */}
					{task.assignedUser ? (
						<div className="avatar">
							<div className="w-6 rounded-full">
								<Image
									src={task.assignedUser.avatar || "/default-avatar.png"}
									alt={task.assignedUser.name}
									width={24}
									height={24}
								/>
							</div>
						</div>
					) : (
						<div className="avatar placeholder">
							<div className="w-6 rounded-full bg-base-300">
								<span className="iconify lucide--user size-3" />
							</div>
						</div>
					)}

					{/* Due Date */}
					{task.dueDate && (
						<div
							className={`flex items-center gap-1 text-xs ${
								isOverdue ? "text-error font-medium" : "text-base-content/60"
							}`}
						>
							<span
								className={`iconify ${
									isOverdue ? "lucide--alert-circle" : "lucide--calendar"
								} size-3`}
							/>
							<span>
								{new Date(task.dueDate).toLocaleDateString("pt-BR", {
									month: "short",
									day: "numeric",
								})}
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
