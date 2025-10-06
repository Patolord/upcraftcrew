"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { mockTeamMembers } from "@/lib/mock-data/team";
import type { TeamMember, TeamMemberRole } from "@/types/team";

const roleConfig = {
	owner: {
		label: "Owner",
		color: "badge-error",
	},
	admin: {
		label: "Admin",
		color: "badge-warning",
	},
	manager: {
		label: "Manager",
		color: "badge-info",
	},
	developer: {
		label: "Developer",
		color: "badge-primary",
	},
	designer: {
		label: "Designer",
		color: "badge-secondary",
	},
	member: {
		label: "Member",
		color: "badge-ghost",
	},
};

const statusConfig = {
	active: {
		label: "Active",
		color: "bg-success",
		textColor: "text-success",
	},
	away: {
		label: "Away",
		color: "bg-warning",
		textColor: "text-warning",
	},
	busy: {
		label: "Busy",
		color: "bg-error",
		textColor: "text-error",
	},
	offline: {
		label: "Offline",
		color: "bg-base-300",
		textColor: "text-base-content/40",
	},
};

function TeamMemberCard({ member }: { member: TeamMember }) {
	const role = roleConfig[member.role];
	const status = statusConfig[member.status];

	return (
		<div className="card bg-base-100 border border-base-300 hover:shadow-lg transition-shadow">
			<div className="card-body">
				{/* Header with Avatar */}
				<div className="flex items-start gap-4">
					<div className="relative">
						<div className="avatar">
							<div className="w-16 rounded-full">
								<Image src={member.avatar} alt={member.name} width={28} height={28} />
							</div>
						</div>
						<div
							className={`absolute bottom-0 right-0 w-4 h-4 ${status.color} rounded-full border-2 border-base-100`}
						/>
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-lg">{member.name}</h3>
						<p className="text-sm text-base-content/60">{member.position}</p>
						<div className="flex items-center gap-2 mt-2">
							<span className={`badge ${role.color} badge-sm`}>
								{role.label}
							</span>
							<span className={`text-xs ${status.textColor}`}>
								{status.label}
							</span>
						</div>
					</div>
				</div>

				{/* Contact Info */}
				<div className="mt-4 space-y-2">
					<div className="flex items-center gap-2 text-sm">
						<span className="iconify lucide--mail size-4 text-base-content/60" />
						<span className="text-base-content/70">{member.email}</span>
					</div>
					{member.location && (
						<div className="flex items-center gap-2 text-sm">
							<span className="iconify lucide--map-pin size-4 text-base-content/60" />
							<span className="text-base-content/70">{member.location}</span>
						</div>
					)}
					{member.phone && (
						<div className="flex items-center gap-2 text-sm">
							<span className="iconify lucide--phone size-4 text-base-content/60" />
							<span className="text-base-content/70">{member.phone}</span>
						</div>
					)}
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-base-300">
					<div className="text-center">
						<p className="text-lg font-semibold">{member.projectsCount}</p>
						<p className="text-xs text-base-content/60">Projects</p>
					</div>
					<div className="text-center">
						<p className="text-lg font-semibold">{member.tasksCompleted}</p>
						<p className="text-xs text-base-content/60">Tasks</p>
					</div>
					<div className="text-center">
						<p className="text-lg font-semibold">{member.performance}%</p>
						<p className="text-xs text-base-content/60">Performance</p>
					</div>
				</div>

				{/* Skills */}
				{member.skills && member.skills.length > 0 && (
					<div className="mt-4">
						<p className="text-xs text-base-content/60 mb-2">Skills</p>
						<div className="flex flex-wrap gap-1">
							{member.skills.slice(0, 4).map((skill) => (
								<span key={skill} className="badge badge-sm badge-outline">
									{skill}
								</span>
							))}
							{member.skills.length > 4 && (
								<span className="badge badge-sm badge-ghost">
									+{member.skills.length - 4}
								</span>
							)}
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="card-actions justify-end mt-4">
					<Button className="btn btn-ghost btn-sm">
						<span className="iconify lucide--message-circle size-4" />
						Message
					</Button>
					<Button className="btn btn-ghost btn-sm">
						<span className="iconify lucide--user size-4" />
						View Profile
					</Button>
				</div>
			</div>
		</div>
	);
}

function TeamMemberRow({ member }: { member: TeamMember }) {
	const role = roleConfig[member.role];
	const status = statusConfig[member.status];

	return (
		<tr className="hover">
			<td>
				<div className="flex items-center gap-3">
					<div className="relative">
						<div className="avatar">
							<div className="w-10 rounded-full">
								<Image src={member.avatar} alt={member.name} width={28} height={28} />
							</div>
						</div>
						<div
							className={`absolute bottom-0 right-0 w-3 h-3 ${status.color} rounded-full border-2 border-base-100`}
						/>
					</div>
					<div>
						<div className="font-medium">{member.name}</div>
						<div className="text-sm text-base-content/60">{member.position}</div>
					</div>
				</div>
			</td>
			<td>
				<div className="text-sm">{member.email}</div>
				{member.department && (
					<div className="text-xs text-base-content/60">{member.department}</div>
				)}
			</td>
			<td>
				<span className={`badge ${role.color} badge-sm`}>{role.label}</span>
			</td>
			<td>
				<span className={`text-sm ${status.textColor}`}>{status.label}</span>
			</td>
			<td className="text-center">
				<div className="text-sm font-medium">{member.projectsCount}</div>
			</td>
			<td className="text-center">
				<div className="text-sm font-medium">{member.performance}%</div>
			</td>
			<td>
				<div className="flex items-center gap-1">
					<Button className="btn btn-ghost btn-xs">
						<span className="iconify lucide--message-circle size-4" />
					</Button>
					<Button className="btn btn-ghost btn-xs">
						<span className="iconify lucide--user size-4" />
					</Button>
					<Button className="btn btn-ghost btn-xs">
						<span className="iconify lucide--more-horizontal size-4" />
					</Button>
				</div>
			</td>
		</tr>
	);
}

export default function TeamPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState<TeamMemberRole | "all">("all");
	const [departmentFilter, setDepartmentFilter] = useState<string>("all");
	const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

	const departments = Array.from(
		new Set(mockTeamMembers.map((m) => m.department).filter(Boolean))
	) as string[];

	const filteredMembers = mockTeamMembers.filter((member) => {
		const matchesSearch =
			member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
			member.position.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesRole = roleFilter === "all" || member.role === roleFilter;

		const matchesDepartment =
			departmentFilter === "all" || member.department === departmentFilter;

		return matchesSearch && matchesRole && matchesDepartment;
	});

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Team</h1>
					<p className="text-base-content/60 text-sm mt-1">
						Manage your team members and permissions
					</p>
				</div>
				<Button className="btn btn-primary gap-2">
					<span className="iconify lucide--user-plus size-5" />
					Add Member
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Total Members</div>
						<div className="stat-value text-2xl">{mockTeamMembers.length}</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Active</div>
						<div className="stat-value text-2xl text-success">
							{mockTeamMembers.filter((m) => m.status === "active").length}
						</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Departments</div>
						<div className="stat-value text-2xl">{departments.length}</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Avg Performance</div>
						<div className="stat-value text-2xl">
							{Math.round(
								mockTeamMembers.reduce((acc, m) => acc + m.performance, 0) /
									mockTeamMembers.length
							)}
							%
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="flex-1">
					<label className="input input-bordered flex items-center gap-2">
						<span className="iconify lucide--search size-4 text-base-content/60" />
						<input
							type="text"
							className="grow"
							placeholder="Search team members..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</label>
				</div>
				<select
					className="select select-bordered w-full sm:w-40"
					value={roleFilter}
					onChange={(e) => setRoleFilter(e.target.value as TeamMemberRole | "all")}
				>
					<option value="all">All Roles</option>
					<option value="owner">Owner</option>
					<option value="admin">Admin</option>
					<option value="manager">Manager</option>
					<option value="developer">Developer</option>
					<option value="designer">Designer</option>
					<option value="member">Member</option>
				</select>
				<select
					className="select select-bordered w-full sm:w-48"
					value={departmentFilter}
					onChange={(e) => setDepartmentFilter(e.target.value)}
				>
					<option value="all">All Departments</option>
					{departments.map((dept) => (
						<option key={dept} value={dept}>
							{dept}
						</option>
					))}
				</select>
				<div className="join">
					<Button
						className={`btn join-item ${viewMode === "grid" ? "btn-active" : ""}`}
						onClick={() => setViewMode("grid")}
					>
						<span className="iconify lucide--layout-grid size-4" />
					</Button>
					<Button
						className={`btn join-item ${viewMode === "table" ? "btn-active" : ""}`}
						onClick={() => setViewMode("table")}
					>
						<span className="iconify lucide--table size-4" />
					</Button>
				</div>
			</div>

			{/* Team Members Grid/Table */}
			{filteredMembers.length === 0 ? (
				<div className="text-center py-12">
					<span className="iconify lucide--users-round size-16 text-base-content/20 mb-4" />
					<h3 className="text-lg font-medium mb-2">No team members found</h3>
					<p className="text-base-content/60 text-sm">
						Try adjusting your search or filters
					</p>
				</div>
			) : viewMode === "grid" ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredMembers.map((member) => (
						<TeamMemberCard key={member.id} member={member} />
					))}
				</div>
			) : (
				<div className="overflow-x-auto bg-base-100 rounded-box border border-base-300">
					<table className="table">
						<thead>
							<tr>
								<th>Member</th>
								<th>Contact</th>
								<th>Role</th>
								<th>Status</th>
								<th className="text-center">Projects</th>
								<th className="text-center">Performance</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredMembers.map((member) => (
								<TeamMemberRow key={member.id} member={member} />
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}