import type { ISidebarMenuItem } from "@/components/admin-layout/SidebarMenuItem";

export const componentsMenuItems: ISidebarMenuItem[] = [
	{
		id: "base-label",
		isTitle: true,
		label: "Base",
	},
	{
		id: "foundations",
		icon: "lucide--shapes",
		label: "Foundations",
		children: [
			{
				id: "foundations-text",
				label: "Text",
				url: "/components/foundations/text",
			},
			{
				id: "foundations-display",
				label: "Display",
				url: "/components/foundations/display",
			},
			{
				id: "foundations-effects",
				label: "Effects",
				url: "/components/foundations/effects",
			},
			{
				id: "foundations-shadows",
				label: "Shadows",
				url: "/components/foundations/shadows",
			},
		],
	},
	{
		id: "blocks",
		icon: "lucide--blocks",
		label: "Blocks",
		children: [
			{
				id: "blocks-stats",
				label: "Dashboard Stats",
				url: "/components/blocks/stats",
			},
			{
				id: "blocks-prompt-bar",
				label: "Prompt Bar",
				url: "/components/blocks/prompt-bar",
			},
		],
	},
	{
		id: "layouts",
		icon: "lucide--layout-panel-left",
		label: "Layouts",
		children: [
			{
				id: "layouts-skeleton",
				label: "Skeleton",
				url: "/components/layouts/skeleton",
			},
			{
				id: "layouts-sidebar",
				label: "Sidebar",
				url: "/components/layouts/sidebar",
			},
			{
				id: "layouts-topbar",
				label: "Topbar",
				url: "/components/layouts/topbar",
			},
			{
				id: "layouts-footer",
				label: "Footer",
				url: "/components/layouts/footer",
			},
			{
				id: "layouts-profile-menu",
				label: "Profile Menu",
				url: "/components/layouts/profile-menu",
			},
			{
				id: "layouts-search",
				label: "Search",
				url: "/components/layouts/search",
			},
			{
				id: "layouts-notification",
				label: "Notification",
				url: "/components/layouts/notification",
			},
			{
				id: "layouts-page-title",
				label: "Page Title",
				url: "/components/layouts/page-title",
			},
		],
	},
	{
		id: "advanced-label",
		isTitle: true,
		label: "Dynamics",
	},
	{
		id: "interactions",
		icon: "lucide--layers-3",
		label: "Interactions",
		children: [
			{
				id: "interactions-carousel",
				label: "Carousel",
				url: "/components/interactions/carousel",
			},
			{
				id: "interactions-clipboard",
				label: "Clipboard",
				url: "/components/interactions/clipboard",
			},
			{
				id: "interactions-datatables",
				label: "Data Tables",
				url: "/components/interactions/datatables",
			},
			{
				id: "interactions-fab",
				label: "FAB",
				url: "/components/interactions/fab",
			},
			{
				id: "interactions-file-upload",
				label: "File Upload",
				url: "/components/interactions/file-upload",
			},
			{
				id: "interactions-flatpickr",
				label: "Flatpickr",
				url: "/components/interactions/flatpickr",
			},
			{
				id: "interactions-form-validations",
				label: "Form Validations",
				url: "/components/interactions/form-validations",
			},
			{
				id: "interactions-input-spinner",
				label: "Input Spinner",
				url: "/components/interactions/input-spinner",
			},
			{
				id: "interactions-password-meter",
				label: "Password Meter",
				url: "/components/interactions/password-meter",
			},
			{
				id: "interactions-select",
				label: "Select",
				url: "/components/interactions/select",
			},
			{
				id: "interactions-sortable",
				label: "Sortable",
				url: "/components/interactions/sortable",
			},
			{
				id: "interactions-text-editor",
				label: "Text Editor",
				url: "/components/interactions/text-editor",
			},
			{
				id: "interactions-wizard",
				label: "Wizard",
				url: "/components/interactions/wizard",
			},
		],
	},
	{
		id: "apex-charts",
		label: "Apex Charts",
		icon: "lucide--chart-bar",
		children: [
			{
				id: "apex-charts-area",
				label: "Area",
				url: "/components/apex-charts/area",
			},
			{
				id: "apex-charts-bar",
				label: "Bar",
				url: "/components/apex-charts/bar",
			},
			{
				id: "apex-charts-column",
				label: "Column",
				url: "/components/apex-charts/column",
			},
			{
				id: "apex-charts-line",
				label: "Line",
				url: "/components/apex-charts/line",
			},
			{
				id: "apex-charts-pie",
				label: "Pie",
				url: "/components/apex-charts/pie",
			},
		],
	},
];