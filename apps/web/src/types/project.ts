export type ProjectStatus = "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export type Project = {
	id: string;
	name: string;
	description: string;
	status: ProjectStatus;
	priority: ProjectPriority;
	startDate: string;
	endDate?: string;
	budget?: number;
	spent?: number;
	progress: number; // 0-100
	client?: string;
	team: {
		id: string;
		name: string;
		avatar: string;
		role: string;
	}[];
	tags?: string[];
};
