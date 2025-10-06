"use client";

import { useState } from "react";
import { mockEvents } from "@/lib/mock-data/schedule";
import type { ScheduleEvent, EventType } from "@/types/schedule";

const eventTypeConfig = {
	meeting: {
		label: "Meeting",
		icon: "lucide--video",
		color: "badge-primary",
	},
	deadline: {
		label: "Deadline",
		icon: "lucide--flag",
		color: "badge-error",
	},
	task: {
		label: "Task",
		icon: "lucide--check-circle",
		color: "badge-success",
	},
	reminder: {
		label: "Reminder",
		icon: "lucide--bell",
		color: "badge-warning",
	},
	milestone: {
		label: "Milestone",
		icon: "lucide--target",
		color: "badge-secondary",
	},
};

function EventCard({ event }: { event: ScheduleEvent }) {
	const eventType = eventTypeConfig[event.type];

	return (
		<div
			className="card bg-base-100 border-l-4 border-base-300 hover:shadow-md transition-shadow"
			style={{ borderLeftColor: event.color }}
		>
			<div className="card-body p-4">
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<span
								className={`iconify ${eventType.icon} size-4`}
								style={{ color: event.color }}
							/>
							<h3 className="font-semibold text-sm">{event.title}</h3>
						</div>
						{event.description && (
							<p className="text-xs text-base-content/60 line-clamp-2">
								{event.description}
							</p>
						)}
					</div>
					<span className={`badge ${eventType.color} badge-xs`}>
						{eventType.label}
					</span>
				</div>

				<div className="flex items-center gap-3 mt-2 text-xs text-base-content/60">
					{event.startTime && (
						<div className="flex items-center gap-1">
							<span className="iconify lucide--clock size-3" />
							<span>
								{event.startTime}
								{event.endTime && ` - ${event.endTime}`}
							</span>
						</div>
					)}
					{event.location && (
						<div className="flex items-center gap-1">
							<span className="iconify lucide--map-pin size-3" />
							<span className="truncate">{event.location}</span>
						</div>
					)}
				</div>

				{event.attendees && event.attendees.length > 0 && (
					<div className="flex items-center gap-2 mt-2">
						<div className="avatar-group -space-x-3">
							{event.attendees.slice(0, 3).map((attendee) => (
								<div key={attendee.id} className="avatar border-2 border-base-100">
									<div className="w-6">
										<img src={attendee.avatar} alt={attendee.name} />
									</div>
								</div>
							))}
						</div>
						{event.attendees.length > 3 && (
							<span className="text-xs text-base-content/60">
								+{event.attendees.length - 3} more
							</span>
						)}
					</div>
				)}

				{event.projectName && (
					<div className="mt-2">
						<span className="badge badge-ghost badge-xs">{event.projectName}</span>
					</div>
				)}
			</div>
		</div>
	);
}

function CalendarDay({
	date,
	events,
	isCurrentMonth,
	isToday,
}: {
	date: Date;
	events: ScheduleEvent[];
	isCurrentMonth: boolean;
	isToday: boolean;
}) {
	const dayEvents = events.filter(
		(event) => event.startDate === date.toISOString().split("T")[0]
	);

	return (
		<div
			className={`min-h-24 border border-base-300 p-2 ${
				!isCurrentMonth ? "bg-base-200/50" : "bg-base-100"
			} ${isToday ? "ring-2 ring-primary" : ""}`}
		>
			<div
				className={`text-sm font-medium mb-1 ${
					isToday
						? "badge badge-primary badge-sm"
						: !isCurrentMonth
							? "text-base-content/40"
							: ""
				}`}
			>
				{date.getDate()}
			</div>
			<div className="space-y-1">
				{dayEvents.slice(0, 3).map((event) => (
					<div
						key={event.id}
						className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
						style={{ backgroundColor: event.color + "20", color: event.color }}
					>
						{event.startTime && <span className="font-medium">{event.startTime} </span>}
						{event.title}
					</div>
				))}
				{dayEvents.length > 3 && (
					<div className="text-xs text-base-content/60 pl-1">
						+{dayEvents.length - 3} more
					</div>
				)}
			</div>
		</div>
	);
}

export default function SchedulePage() {
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [viewMode, setViewMode] = useState<"month" | "list">("month");
	const [typeFilter, setTypeFilter] = useState<EventType | "all">("all");

	// Get current month calendar
	const year = selectedDate.getFullYear();
	const month = selectedDate.getMonth();
	const firstDay = new Date(year, month, 1);
	const startDate = new Date(firstDay);
	startDate.setDate(startDate.getDate() - firstDay.getDay());

	const calendarDays: Date[] = [];
	const currentDate = new Date(startDate);
	for (let i = 0; i < 42; i++) {
		calendarDays.push(new Date(currentDate));
		currentDate.setDate(currentDate.getDate() + 1);
	}

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Filter events
	const filteredEvents = mockEvents.filter((event) => {
		const matchesType = typeFilter === "all" || event.type === typeFilter;
		return matchesType;
	});

	// Get upcoming events
	const upcomingEvents = filteredEvents
		.filter((event) => new Date(event.startDate) >= today)
		.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
		.slice(0, 10);

	const previousMonth = () => {
		setSelectedDate(new Date(year, month - 1, 1));
	};

	const nextMonth = () => {
		setSelectedDate(new Date(year, month + 1, 1));
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Schedule</h1>
					<p className="text-base-content/60 text-sm mt-1">
						Manage your events, meetings, and deadlines
					</p>
				</div>
				<button className="btn btn-primary gap-2">
					<span className="iconify lucide--plus size-5" />
					New Event
				</button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Total Events</div>
						<div className="stat-value text-2xl">{mockEvents.length}</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Meetings</div>
						<div className="stat-value text-2xl text-primary">
							{mockEvents.filter((e) => e.type === "meeting").length}
						</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Deadlines</div>
						<div className="stat-value text-2xl text-error">
							{mockEvents.filter((e) => e.type === "deadline").length}
						</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Tasks</div>
						<div className="stat-value text-2xl text-success">
							{mockEvents.filter((e) => e.type === "task").length}
						</div>
					</div>
				</div>
				<div className="stats shadow border border-base-300">
					<div className="stat py-4">
						<div className="stat-title text-xs">Upcoming</div>
						<div className="stat-value text-2xl">{upcomingEvents.length}</div>
					</div>
				</div>
			</div>

			{/* Controls */}
			<div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
				<div className="flex items-center gap-2">
					<button className="btn btn-sm" onClick={previousMonth}>
						<span className="iconify lucide--chevron-left size-4" />
					</button>
					<h2 className="text-lg font-semibold min-w-48 text-center">
						{selectedDate.toLocaleDateString("en-US", {
							month: "long",
							year: "numeric",
						})}
					</h2>
					<button className="btn btn-sm" onClick={nextMonth}>
						<span className="iconify lucide--chevron-right size-4" />
					</button>
					<button
						className="btn btn-sm btn-ghost"
						onClick={() => setSelectedDate(new Date())}
					>
						Today
					</button>
				</div>

				<div className="flex items-center gap-2">
					<select
						className="select select-bordered select-sm w-36"
						value={typeFilter}
						onChange={(e) => setTypeFilter(e.target.value as EventType | "all")}
					>
						<option value="all">All Types</option>
						<option value="meeting">Meetings</option>
						<option value="deadline">Deadlines</option>
						<option value="task">Tasks</option>
						<option value="reminder">Reminders</option>
						<option value="milestone">Milestones</option>
					</select>

					<div className="join">
						<button
							className={`btn btn-sm join-item ${viewMode === "month" ? "btn-active" : ""}`}
							onClick={() => setViewMode("month")}
						>
							<span className="iconify lucide--calendar size-4" />
							Month
						</button>
						<button
							className={`btn btn-sm join-item ${viewMode === "list" ? "btn-active" : ""}`}
							onClick={() => setViewMode("list")}
						>
							<span className="iconify lucide--list size-4" />
							List
						</button>
					</div>
				</div>
			</div>

			{/* Calendar or List View */}
			{viewMode === "month" ? (
				<div className="bg-base-100 rounded-box border border-base-300 overflow-hidden">
					{/* Weekday headers */}
					<div className="grid grid-cols-7 bg-base-200">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
							<div
								key={day}
								className="text-center text-sm font-medium p-2 border-r border-base-300 last:border-r-0"
							>
								{day}
							</div>
						))}
					</div>

					{/* Calendar grid */}
					<div className="grid grid-cols-7">
						{calendarDays.map((date, index) => {
							const isToday =
								date.toISOString().split("T")[0] ===
								today.toISOString().split("T")[0];
							const isCurrentMonth = date.getMonth() === month;

							return (
								<CalendarDay
									key={index}
									date={date}
									events={filteredEvents}
									isCurrentMonth={isCurrentMonth}
									isToday={isToday}
								/>
							);
						})}
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<h3 className="font-semibold">Upcoming Events</h3>
					{upcomingEvents.length === 0 ? (
						<div className="text-center py-12">
							<span className="iconify lucide--calendar-x size-16 text-base-content/20 mb-4" />
							<h3 className="text-lg font-medium mb-2">No upcoming events</h3>
							<p className="text-base-content/60 text-sm">
								Try adjusting your filters or add new events
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{upcomingEvents.map((event) => (
								<EventCard key={event.id} event={event} />
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
