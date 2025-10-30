"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";

import { useConfig } from "@/contexts/config";

type IThemeToggleDropdown = {
	iconClass?: string;
} & ComponentProps<"button">;

export const ThemeToggle = ({
	iconClass,
	className,
	...props
}: IThemeToggleDropdown) => {
	const { config, changeTheme } = useConfig();
	const [mounted, setMounted] = useState(false);
	const isDark = config.theme === "dark";

	// Prevent hydration mismatch by only rendering after mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Render a placeholder during SSR to avoid hydration mismatch
	if (!mounted) {
		return (
			<button
				{...props}
				className={`relative overflow-hidden ${className ?? ""}`}
				aria-label="Toggle Theme"
				disabled
			>
				<span
					className={`iconify lucide--sun absolute size-4.5 opacity-100 ${iconClass ?? ""}`}
				/>
			</button>
		);
	}

	return (
		<button
			{...props}
			className={`relative overflow-hidden ${className ?? ""}`}
			onClick={() => changeTheme(isDark ? "light" : "dark")}
			aria-label="Toggle Theme"
		>
			<span
				className={`iconify lucide--sun absolute size-4.5 transition-all duration-300 ${isDark ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"} ${iconClass ?? ""}`}
			/>
			<span
				className={`iconify lucide--moon absolute size-4.5 transition-all duration-300 ${isDark ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} ${iconClass ?? ""}`}
			/>
		</button>
	);
};
