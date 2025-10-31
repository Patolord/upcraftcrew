import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import type { Project } from "@/types/project";

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

export function ProjectCard({ project }: { project: Project }) {
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
							<p className="text-sm font-medium">
								${project.budget.spent?.toLocaleString() || 0} / $
								{project.budget.total.toLocaleString()}
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
				{project.team && project.team.length > 0 && (
					<div className="mt-4">
						<div className="flex items-center justify-between">
							<div className="avatar-group -space-x-4">
								{project.team.slice(0, 4).map((member) => (
									<div
										key={member._id || member.name}
										className="avatar border-2 border-base-100"
									>
										<div className="w-8">
											<Image
												src={member.avatar || "/default-avatar.png"}
												alt={member.name}
												width={28}
												height={28}
											/>
										</div>
									</div>
								))}
								{project.team.length > 4 && (
									<div className="avatar placeholder border-2 border-base-100">
										<div className="w-8 bg-base-300">
											<span className="text-xs">
												+{project.team.length - 4}
											</span>
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
							<span key={tag} className="badge badge-sm badge-ghost text-xs">
								{tag}
							</span>
						))}
					</div>
				)}

				{/* Actions */}
				<div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
					<Link href={`/projects/${project.id}`}>
						<Button className="btn btn-primary btn-sm">
							<span className="iconify lucide--eye size-4" />
							View
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
