"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewProjectModal } from "../projects/NewProjectModal";

export function DashboardHeader() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Dashboard</h1>
					<p className="text-base-content/60 text-sm mt-1">
						Welcome back! Here's what's happening today
					</p>
				</div>
				<Button
					className="btn btn-primary gap-2"
					onClick={() => setIsModalOpen(true)}
				>
					<span className="iconify lucide--plus size-5" />
					New Project
				</Button>
			</div>
			<NewProjectModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</>
	);
}
