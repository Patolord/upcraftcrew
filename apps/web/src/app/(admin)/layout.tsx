"use client";

import type { ReactNode } from "react";
import { useId } from "react";

import { Footer } from "@/components/admin-layout/Footer";
import { Sidebar } from "@/components/admin-layout/Sidebar";
import { NavBar } from "@/components/admin-layout/nav-bar";
import { Providers } from "@/components/providers";



const Layout = ({ children }: { children: ReactNode }) => {
	const layoutContentId = useId();
	
	return (
		<Providers>
			<div className="size-full">
				<input
					type="checkbox"
					id="layout-sidebar-hover-trigger"
					className="peer/sidebar-hover hidden"
				/>
				<div className="flex">
					<Sidebar />
					<div className="flex h-screen min-w-0 grow flex-col overflow-auto">
						<NavBar />
						<div id={layoutContentId}>{children}</div>
						<Footer />
					</div>
				</div>

			</div>
		</Providers>
	);
};

export default Layout;
