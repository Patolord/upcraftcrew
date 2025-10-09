import type { Doc } from "@workspace/backend/_generated/dataModel";
import type { Project } from "@/types/project";

type ConvexProject = Doc<"projects"> & {
	team: (Doc<"users"> | null)[];
};

export function adaptConvexProject(convexProject: ConvexProject): Project {
	return {
		id: convexProject._id,
		name: convexProject.name,
		description: convexProject.description,
		status: convexProject.status,
		priority: convexProject.priority,
		startDate: new Date(convexProject.startDate).toISOString(),
		endDate: convexProject.endDate
			? new Date(convexProject.endDate).toISOString()
			: undefined,
		budget: convexProject.budget,
		progress: convexProject.progress,
		client: convexProject.client,
		team: convexProject.team
			.filter((member): member is Doc<"users"> => member !== null)
			.map((member) => ({
				id: member._id,
				name: member.name,
				avatar: member.avatar || "",
				role: member.role,
			})),
		tags: convexProject.tags,
	};
}
