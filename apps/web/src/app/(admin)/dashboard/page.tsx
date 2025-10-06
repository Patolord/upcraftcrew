"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { mockProjects } from "@/lib/mock-data/projects";
import { mockTeamMembers } from "@/lib/mock-data/team";
import { mockTransactions } from "@/lib/mock-data/finance";

export default function DashboardPage() {
	// Calculate overview stats
	const stats = useMemo(() => {
		const activeProjects = mockProjects.filter(
			(p) => p.status === "in-progress"
		).length;
		const activeMembers = mockTeamMembers.filter(
			(m) => m.status === "active"
		).length;

		const completedTransactions = mockTransactions.filter(
			(t) => t.status === "completed"
		);
		const totalIncome = completedTransactions
			.filter((t) => t.type === "income")
			.reduce((sum, t) => sum + t.amount, 0);
		const totalExpenses = completedTransactions
			.filter((t) => t.type === "expense")
			.reduce((sum, t) => sum + t.amount, 0);

		const avgProjectProgress =
			mockProjects.reduce((sum, p) => sum + p.progress, 0) /
			mockProjects.length;

		return {
			activeProjects,
			activeMembers,
			totalRevenue: totalIncome,
			netProfit: totalIncome - totalExpenses,
			avgProgress: avgProjectProgress,
		};
	}, []);

	// Recent activities
	const recentActivities = useMemo(() => {
		return mockTeamMembers.slice(0, 4).map((user, index) => ({
			id: index + 1,
			user,
			action:
				index === 0
					? "completed task in"
					: index === 1
						? "added new member to"
						: index === 2
							? "updated status of"
							: "created new task in",
			target: mockProjects[index]?.name || `Project ${String.fromCharCode(65 + index)}`,
			time:
				index === 0
					? "2 hours ago"
					: index === 1
						? "4 hours ago"
						: index === 2
							? "6 hours ago"
							: "1 day ago",
			type: (["success", "info", "warning", "primary"][index] || "primary") as
				| "success"
				| "info"
				| "warning"
				| "primary",
		}));
	}, []);

	// Upcoming deadlines
	const upcomingDeadlines = mockProjects
		.filter((p) => p.endDate && p.status !== "completed")
		.sort((a, b) => new Date(a.endDate!).getTime() - new Date(b.endDate!).getTime())
		.slice(0, 4);

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<p className="text-base-content/60 text-sm mt-1">
						Welcome back! Here's what's happening today
					</p>
				</div>
				<Button className="btn btn-primary gap-2">
					<span className="iconify lucide--plus size-5" />
					New Project
				</Button>
			</div>

			{/* Stats Overview */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-figure text-primary">
							<span className="iconify lucide--briefcase size-8" />
						</div>
						<div className="stat-title text-xs">Active Projects</div>
						<div className="stat-value text-2xl text-primary">
							{stats.activeProjects}
						</div>
						<div className="stat-desc text-xs">
							{mockProjects.length} total projects
						</div>
					</div>
				</div>

				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-figure text-success">
							<span className="iconify lucide--users size-8" />
						</div>
						<div className="stat-title text-xs">Team Members</div>
						<div className="stat-value text-2xl text-success">
							{stats.activeMembers}
						</div>
						<div className="stat-desc text-xs">
							{mockTeamMembers.length} total members
						</div>
					</div>
				</div>

				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-figure text-info">
							<span className="iconify lucide--dollar-sign size-8" />
						</div>
						<div className="stat-title text-xs">Total Revenue</div>
						<div className="stat-value text-2xl text-info">
							${(stats.totalRevenue / 1000).toFixed(0)}k
						</div>
						<div className="stat-desc text-xs">This period</div>
					</div>
				</div>

				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-figure text-success">
							<span className="iconify lucide--trending-up size-8" />
						</div>
						<div className="stat-title text-xs">Net Profit</div>
						<div className="stat-value text-2xl text-success">
							${(stats.netProfit / 1000).toFixed(0)}k
						</div>
						<div className="stat-desc text-xs">
							{((stats.netProfit / stats.totalRevenue) * 100).toFixed(0)}%
							margin
						</div>
					</div>
				</div>

				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-figure text-warning">
							<span className="iconify lucide--activity size-8" />
						</div>
						<div className="stat-title text-xs">Avg Progress</div>
						<div className="stat-value text-2xl text-warning">
							{stats.avgProgress.toFixed(0)}%
						</div>
						<div className="stat-desc text-xs">All projects</div>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Recent Activities */}
				<div className="lg:col-span-2">
					<div className="card bg-base-100 border border-base-300">
						<div className="card-body">
							<h2 className="card-title text-lg mb-4">Recent Activities</h2>
							<div className="space-y-4">
								{recentActivities.map((activity) => (
									<div
										key={activity.id}
										className="flex items-start gap-3 pb-4 border-b border-base-300 last:border-0 last:pb-0"
									>
										<div className="avatar">
											<div className="w-10 rounded-full">
												<Image
													src={activity.user.avatar}
													alt={activity.user.name}
													width={40}
													height={40}
												/>
											</div>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm">
												<span className="font-medium">
													{activity.user.name}
												</span>{" "}
												<span className="text-base-content/60">
													{activity.action}
												</span>{" "}
												<span className="font-medium">{activity.target}</span>
											</p>
											<p className="text-xs text-base-content/60 mt-1">
												{activity.time}
											</p>
										</div>
										<span
											className={`badge badge-${activity.type} badge-sm flex-shrink-0`}
										>
											{activity.type}
										</span>
									</div>
								))}
							</div>
							<div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
								<Button className="btn btn-ghost btn-sm">
									View All Activity
									<span className="iconify lucide--arrow-right size-4 ml-1" />
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Upcoming Deadlines */}
				<div>
					<div className="card bg-base-100 border border-base-300">
						<div className="card-body">
							<h2 className="card-title text-lg mb-4">Upcoming Deadlines</h2>
							<div className="space-y-3">
								{upcomingDeadlines.map((project) => {
									const daysUntil = Math.ceil(
										(new Date(project.endDate!).getTime() - Date.now()) /
											(1000 * 60 * 60 * 24)
									);
									const isUrgent = daysUntil <= 3;

									return (
										<div
											key={project.id}
											className="flex items-start justify-between gap-3 pb-3 border-b border-base-300 last:border-0 last:pb-0"
										>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium truncate">
													{project.name}
												</p>
												<p className="text-xs text-base-content/60 mt-1">
													{new Date(project.endDate!).toLocaleDateString(
														"en-US",
														{
															month: "short",
															day: "numeric",
														}
													)}
												</p>
											</div>
											<span
												className={`badge ${
													isUrgent ? "badge-error" : "badge-warning"
												} badge-sm flex-shrink-0`}
											>
												{daysUntil}d
											</span>
										</div>
									);
								})}
							</div>
							{upcomingDeadlines.length === 0 && (
								<div className="text-center py-8">
									<span className="iconify lucide--calendar-check size-12 text-base-content/20" />
									<p className="text-sm text-base-content/60 mt-2">
										No upcoming deadlines
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Projects Overview */}
			<div className="card bg-base-100 border border-base-300">
				<div className="card-body">
					<div className="flex items-center justify-between mb-4">
						<h2 className="card-title text-lg">Project Status</h2>
						<Button className="btn btn-ghost btn-sm">
							View All
							<span className="iconify lucide--arrow-right size-4 ml-1" />
						</Button>
					</div>
					<div className="space-y-4">
						{mockProjects.slice(0, 5).map((project) => (
							<div key={project.id}>
								<div className="flex items-center justify-between mb-2">
									<div className="flex items-center gap-3 flex-1 min-w-0">
										<div className="avatar-group -space-x-3">
											{project.team.slice(0, 3).map((member) => (
												<div
													key={member.id}
													className="avatar border-2 border-base-100"
												>
													<div className="w-6">
														<Image
															src={member.avatar}
															alt={member.name}
															width={24}
															height={24}
														/>
													</div>
												</div>
											))}
										</div>
										<span className="text-sm font-medium truncate">
											{project.name}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<span className="text-xs text-base-content/60">
											{project.status === "in-progress"
												? "In Progress"
												: project.status === "completed"
													? "Completed"
													: project.status === "planning"
														? "Planning"
														: project.status === "on-hold"
															? "On Hold"
															: "Cancelled"}
										</span>
										<span className="text-sm font-medium min-w-[3rem] text-right">
											{project.progress}%
										</span>
									</div>
								</div>
								<progress
									className="progress progress-primary w-full"
									value={project.progress}
									max="100"
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
