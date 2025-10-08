"use client";

import { useConfig } from "@/contexts/config";
import { Button } from "./ui/button";

type IThemeToggleDropdown = {
	triggerClass?: string;
	dropdownClass?: string;
	dropdownContentClass?: string;
	iconClass?: string;
};

export const ThemeToggleDropdown = ({
	triggerClass,
	
	dropdownContentClass,
	
}: IThemeToggleDropdown) => {
	const { changeTheme } = useConfig();

	return (
		<Button
			className={`${triggerClass ?? ""}`}
			aria-label="Theme toggle"
			onClick={() => changeTheme("light")}
		>
			<span className="iconify lucide--sun hidden size-4 group-data-[theme=light]/html:inline-block" />
			<span className="iconify lucide--moon hidden size-4 group-data-[theme=dark]/html:inline-block" />
			<span className="iconify lucide--palette hidden size-4 group-[:not([data-theme])]/html:inline-block" />
			<ul
				className={`dropdown-content menu bg-base-100 rounded-box z-1 w-36 space-y-0.5 p-1 shadow-sm ${dropdownContentClass ?? ""}`}
			>
					<li className="group-data-[theme=light]/html:bg-base-200 flex gap-2">
						<span className="iconify lucide--sun size-4.5" />
						<span className="font-medium">Light</span>
					</li>
					<li className="group-data-[theme=dark]/html:bg-base-200 flex gap-2">
						<span className="iconify lucide--moon size-4.5" />
						<span className="font-medium">Dark</span>
					</li>
					<li className="group-[:not([data-theme])]/html:bg-base-200 flex gap-2">
						<span className="iconify lucide--monitor size-4.5" />
					<span className="font-medium">System</span>
				</li>
			</ul>
		</Button>
	);
};
