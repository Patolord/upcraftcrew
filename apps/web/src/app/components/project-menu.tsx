import type { ISidebarMenuItem } from "@/components/admin-layout/SidebarMenuItem";

export const projectMenuItems: ISidebarMenuItem[] = [
	{
		id: "navigation-label",
		isTitle: true,
		label: "Navigation",
	},
	{
		id: "dashboard",
		icon: "lucide--layout-dashboard",
		label: "Dashboard",
		url: "/dashboard",
	},
	{
		id: "projects",
		icon: "lucide--folder-open",
		label: "Projects",
		url: "/projects",
	},
	{
		id: "team",
		icon: "lucide--users",
		label: "Team",
		url: "/team",
	},
	{
		id: "schedule",
		icon: "lucide--calendar-days",
		label: "Schedule",
		url: "/schedule",
	},
	{
		id: "reports",
		icon: "lucide--file-text",
		label: "Reports",
		url: "/reports",
	},
];
