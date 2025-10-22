import Link from "next/link";

export const Sidebar = () => {
	return (
		<div className="sidebar-menu relative flex h-screen w-56 flex-shrink-0 flex-col border-r border-base-300 py-3">	
		
		
			<div className="flex min-h-10 items-center gap-3 px-5">
				<span className="text-xl font-semibold">UpcraftCrew</span>
				
				
			</div>
			

			<div className="custom-scrollbar p-2 grow overflow-auto">
				<div className="mt-2">
					<div className="flex items-center justify-between px-5 mb-2">
						<p className="menu-label">Navigation</p>
						
					</div>
					<div className="mt-1 space-y-0.5 px-2.5">
						<Link href="/dashboard" className="menu-item group">
							<span className="iconify lucide--layout-dashboard size-4"></span>
							<p className="grow">Dashboard</p>
							<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
						</Link>
						<Link href="/budgets" className="menu-item group">
							<span className="iconify lucide--file-text size-4"></span>
							<p className="grow">Orçamentos</p>
							<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
						</Link>
						<Link href="/projects" className="menu-item group">
							<span className="iconify lucide--folder-open size-4"></span>
							<p className="grow">Projects</p>
							<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
						</Link>
						<Link href="/team" className="menu-item group">
							<span className="iconify lucide--users size-4"></span>
							<p className="grow">Team</p>
							<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
						</Link>
						<Link href="/schedule" className="menu-item group">
							<span className="iconify lucide--calendar-days size-4"></span>
							<p className="grow">Schedule</p>
							<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
						</Link>
						<Link href="/finance" className="menu-item group">
							<span className="iconify lucide--dollar-sign size-4"></span>
							<p className="grow">Finance</p>
							<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
						</Link>
						<Link href="/kanban" className="menu-item group">
							<span className="iconify lucide--layout-kanban size-4"></span>
							<p className="grow">Kanban</p>
							<span className="iconify lucide--chevron-right size-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-60"></span>
						</Link>
						
					</div>
				</div>
				<div className="mt-4">
					<div className="flex items-center justify-between px-5">
						<p className="menu-label">Favorite</p>
						
					</div>
					<div className="mt-1 space-y-0.5 px-2.5">
						<Link href="#" className="group menu-item justify-between">
							<div className="flex items-center gap-2">
								<span className="iconify lucide--search size-4"></span>
								<p>Search Files</p>
							</div>
							
						</Link>

						<Link href="#" className="group menu-item justify-between">
							<div className="flex items-center gap-2">
								<span className="iconify lucide--file-plus size-4"></span>
								<p>New File</p>
							</div>
							
						</Link>

						<Link href="#" className="group menu-item justify-between">
							<div className="flex items-center gap-2">
								<span className="iconify lucide--clock size-4"></span>
								<p>Recent</p>
							</div>
							
						</Link>
					</div>
				</div>
				<div className="mt-4">
					<div className="flex items-center justify-between px-5">
						<p className="menu-label">Channels</p>
						
					</div>
					<div className="mt-2 space-y-1 px-5">
						<Link
							href="#"
							className="text-base-content/90 hover:text-primary flex items-center gap-2 transition-all"
						>
							<span className="iconify lucide--hash"></span>
							general
						</Link>
						<Link
							href="#"
							className="text-base-content/90 hover:text-primary flex items-center gap-2 transition-all"
						>
							<span className="iconify lucide--hash"></span>
							design
						</Link>
						<div className="text-base-content/90 flex items-center gap-2 transition-all">
							<Link
								href="#"
								className="hover:text-primary flex grow items-center gap-2"
							>
								<span className="iconify lucide--hash"></span>
								<p className="grow">meeting</p>
							</Link>
							
							<ul
								className="dropdown dropdown-end menu rounded-box bg-base-100 w-36 shadow hover:shadow-lg"
								popover="auto"
								id={`popover-1`}
								style={{ positionAnchor: "--anchor-1" }}
							>
								<li>
									<Link href="#">
										<span className="iconify lucide--bell size-4"></span>
										Normal
									</Link>
								</li>
								<li>
									<Link href="#">
										<span className="iconify lucide--bell-off size-4"></span>
										Muted
									</Link>
								</li>
								<li>
									<Link href="#">
										<span className="iconify lucide--bell-ring size-4"></span>
										Vibrate
									</Link>
								</li>
								<li>
									<Link href="#">
										<span className="iconify lucide--bell-minus size-4"></span>
										Silent
									</Link>
								</li>
							</ul>
						</div>
						<Link
							href="#"
							className="text-base-content/90 hover:text-primary flex items-center gap-2 transition-all"
						>
							<span className="iconify lucide--hash"></span>
							support
						</Link>
					</div>
				</div>
			</div>
			<div className="border-base-300 relative mt-8 border-t px-5 pt-4">
				<div className="bg-base-100 border-base-300 absolute -top-7 translate-y-1/2 rounded-full border px-3 py-0.5">
					<p className="text-base-content/70 text-sm">In Meeting</p>
				</div>
				<div className="mt-2 flex items-center justify-end">
					
					<span className="text-base-content/70 text-sm font-medium">
						12:42
					</span>
				</div>
				
			</div>
		</div>
	);
};
