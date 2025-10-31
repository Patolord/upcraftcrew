import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";

export const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div
			className={`sidebar-menu relative flex h-screen flex-shrink-0 flex-col border-r border-base-300 py-3 transition-all duration-300 ${isCollapsed ? "w-20" : "w-56"}`}
		>
			<div className="flex min-h-10 items-center justify-between px-5">
				{!isCollapsed && (
					<div className="flex items-center gap-3">
						<div className="avatar placeholder">
							<div className="bg-primary text-primary-content rounded-full w-8"></div>
						</div>
						<span className="text-sm font-medium">Usuário</span>
					</div>
				)}
				<Button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="btn btn-ghost btn-sm btn-square hover:bg-transparent hover:text-orange-500"
					aria-label="Toggle sidebar"
				>
					<Menu
						className={`size-5 ${isCollapsed ? "text-white" : "text-white"}`}
					/>
				</Button>
			</div>

			<div className="custom-scrollbar p-2 grow overflow-auto">
				<div className="mt-2">
					{!isCollapsed && (
						<div className="flex items-center justify-between px-5 mb-2">
							<p className="menu-label">Navigation</p>
						</div>
					)}
					<div className="mt-1 space-y-0.5 px-2.5">
						<Link
							href="/dashboard"
							className="menu-item group"
							title={isCollapsed ? "Dashboard" : ""}
						>
							<span className="iconify lucide--layout-dashboard size-4"></span>
							{!isCollapsed && (
								<>
									<p className="grow">Dashboard</p>
									<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
								</>
							)}
						</Link>
						<Link
							href="/budgets"
							className="menu-item group"
							title={isCollapsed ? "Orçamentos" : ""}
						>
							<span className="iconify lucide--file-text size-4"></span>
							{!isCollapsed && (
								<>
									<p className="grow">Orçamentos</p>
									<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
								</>
							)}
						</Link>
						<Link
							href="/projects"
							className="menu-item group"
							title={isCollapsed ? "Projects" : ""}
						>
							<span className="iconify lucide--folder-open size-4"></span>
							{!isCollapsed && (
								<>
									<p className="grow">Projects</p>
									<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
								</>
							)}
						</Link>
						<Link
							href="/team"
							className="menu-item group"
							title={isCollapsed ? "Team" : ""}
						>
							<span className="iconify lucide--users size-4"></span>
							{!isCollapsed && (
								<>
									<p className="grow">Team</p>
									<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
								</>
							)}
						</Link>
						<Link
							href="/schedule"
							className="menu-item group"
							title={isCollapsed ? "Schedule" : ""}
						>
							<span className="iconify lucide--calendar-days size-4"></span>
							{!isCollapsed && (
								<>
									<p className="grow">Schedule</p>
									<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
								</>
							)}
						</Link>
						<Link
							href="/finance"
							className="menu-item group"
							title={isCollapsed ? "Finance" : ""}
						>
							<span className="iconify lucide--dollar-sign size-4"></span>
							{!isCollapsed && (
								<>
									<p className="grow">Finance</p>
									<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
								</>
							)}
						</Link>
						<Link
							href="/kanban"
							className="menu-item group"
							title={isCollapsed ? "Kanban" : ""}
						>
							<span className="iconify lucide--kanban size-4"></span>
							{!isCollapsed && (
								<>
									<p className="grow">Kanban</p>
									<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
								</>
							)}
						</Link>
					</div>
					{!isCollapsed && (
						<>
							<div className="mt-4">
								<div className="flex items-center justify-between px-5">
									<p className="menu-label">Favorite</p>
								</div>
								<div className="mt-1 space-y-0.5 px-2.5"></div>
							</div>
							<div className="mt-4">
								<div className="flex items-center justify-between px-5">
									<p className="menu-label">Chats</p>
								</div>
								<div className="mt-2 space-y-1 px-5"></div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};
