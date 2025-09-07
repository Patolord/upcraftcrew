import type { ReactNode } from "react";

import { Footer } from "@/components/admin-layout/Footer";
import { Rightbar } from "@/components/admin-layout/Rightbar";
import { ProjectSidebarDemo } from "@/components/components-layout/ProjectSidebar";
import { Topbar } from "@/components/admin-layout/Topbar";

import { projectMenuItems } from "../components/project-menu";

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<div className="size-full">
			<div className="flex">
				<ProjectSidebarDemo menuItems={projectMenuItems} />
				<div className="flex h-screen min-w-0 grow flex-col overflow-auto">
					<Topbar />
					<div id="layout-content">{children}</div>
					<Footer />
				</div>
			</div>
			<Rightbar />
		</div>
	);
};

export default Layout;
