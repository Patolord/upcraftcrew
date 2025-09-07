"use client";

import type { ReactNode } from "react";
import { useId } from "react";

import { Footer } from "@/components/admin-layout/Footer";
import { Rightbar } from "@/components/admin-layout/Rightbar";
import { ProjectSidebarDemo } from "@/components/components-layout/ProjectSidebar";
import { Topbar } from "@/components/admin-layout/Topbar";
import { Providers } from "@/components/providers";

import { projectMenuItems } from "../components/project-menu";

const Layout = ({ children }: { children: ReactNode }) => {
	const layoutContentId = useId();
	
	return (
		<Providers>
			<div className="size-full">
				<div className="flex">
					<ProjectSidebarDemo menuItems={projectMenuItems} />
					<div className="flex h-screen min-w-0 grow flex-col overflow-auto">
						<Topbar />
						<div id={layoutContentId}>{children}</div>
						<Footer />
					</div>
				</div>
				<Rightbar />
			</div>
		</Providers>
	);
};

export default Layout;
