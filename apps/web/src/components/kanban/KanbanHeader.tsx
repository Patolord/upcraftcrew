import { Button } from "@/components/ui/button";

interface KanbanHeaderProps {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	onNewProject?: () => void;
}

export function KanbanHeader({ searchQuery, setSearchQuery, onNewProject }: KanbanHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-3xl font-bold">Kanban Board</h1>
				<p className="text-base-content/60 mt-1">
					Manage and track project progress
				</p>
			</div>
			<div className="flex items-center gap-3">
				<div className="form-control">
					<div className="input-group">
						<span className="iconify lucide--search size-5 text-base-content/60" />
						<input
							type="text"
							placeholder="Search projects..."
							className="input input-bordered"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>
				<Button className="btn btn-primary" onClick={onNewProject}>
					<span className="iconify lucide--plus size-5" />
					New Project
				</Button>
			</div>
		</div>
	);
}
