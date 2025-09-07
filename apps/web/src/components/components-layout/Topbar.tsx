import Link from "next/link";

import { ThemeToggle } from "@/components/ThemeToggle";

export const Topbar = () => {
	return (
		<div
			role="navigation"
			aria-label="Navbar"
			className="border-base-300/80 bg-base-100 sticky top-0 z-1 h-16 border-b border-dashed px-4 md:px-8 xl:px-12 2xl:px-20"
		>
			<div className="flex h-full items-center justify-between px-0">
				<div className="flex items-center gap-5">
					<Link
						href="/dashboards/ecommerce"
						className="text-base-content/70 hover:text-base-content transition-all"
					>
						Dashboard
					</Link>
					<Link href="/components" className="font-medium">
						Components
					</Link>
				</div>
				<div className="inline-flex items-center gap-3">
					<ThemeToggle className="btn btn-sm btn-square btn-ghost" />
					
				</div>
			</div>
		</div>
	);
};
