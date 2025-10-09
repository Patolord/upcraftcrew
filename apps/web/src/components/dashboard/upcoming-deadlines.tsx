export interface Project {
	id: string;
	name: string;
	endDate: string;
}

interface UpcomingDeadlinesProps {
	projects: Project[];
}

export function UpcomingDeadlines({ projects }: UpcomingDeadlinesProps) {
	return (
		<div className="card bg-base-100 border border-base-300">
			<div className="card-body">
				<h2 className="card-title text-lg mb-4">Upcoming Deadlines</h2>
				<div className="space-y-3">
					{projects.map((project) => {
						const daysUntil = Math.ceil(
							(new Date(project.endDate).getTime() - Date.now()) /
								(1000 * 60 * 60 * 24)
						);
						const isUrgent = daysUntil <= 3;

						return (
							<div
								key={project.id}
								className="flex items-start justify-between gap-3 pb-3 border-b border-base-300 last:border-0 last:pb-0"
							>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">{project.name}</p>
									<p className="text-xs text-base-content/60 mt-1">
										{new Date(project.endDate).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
										})}
									</p>
								</div>
								<span
									className={`badge ${
										isUrgent ? "badge-error" : "badge-warning"
									} badge-sm flex-shrink-0`}
								>
									{daysUntil}d
								</span>
							</div>
						);
					})}
				</div>
				{projects.length === 0 && (
					<div className="text-center py-8">
						<span className="iconify lucide--calendar-check size-12 text-base-content/20" />
						<p className="text-sm text-base-content/60 mt-2">
							No upcoming deadlines
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
