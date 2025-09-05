"use client";

import { motion, type Variants } from "motion/react";

const data = [
	{
		title: "Bespoke Solutions",
		description:
			"Tailored web applications designed specifically for your business goals",
		iconClass: "bg-green-500/10 text-green-600",
		icon: "lucide--code",
	},
	{
		title: "Cost-Effective Development",
		description:
			"Offshore rates without compromise on quality or communication",
		iconClass: "bg-yellow-600/10 text-yellow-600",
		icon: "lucide--pound-sterling",
	},
	{
		title: "Clear Communication",
		description:
			"English-speaking developers with flexible hours across multiple time zones",
		iconClass: "bg-red-500/10 text-red-500",
		icon: "lucide--message-circle",
	},
	{
		title: "Proven Expertise",
		description:
			"Full-stack web apps, SaaS platforms, and modern landing pages",
		iconClass: "bg-purple-500/10 text-purple-500",
		icon: "lucide--award",
	},
	{
		title: "Personal Attention",
		description: "Direct access to senior developers, not a faceless team",
		iconClass: "bg-orange-500/10 text-orange-500",
		icon: "lucide--user-check",
	},
	{
		title: "Reliable Delivery",
		description:
			"Consistent project delivery with transparent progress updates",
		iconClass: "bg-teal-500/10 text-teal-600",
		icon: "lucide--clock",
	},
];

const containerVariants: Variants = {
	hidden: { opacity: 1 },
	visible: {
		opacity: 1,
		transition: { staggerChildren: 0.2 }, // Stagger each feature
	},
};

const featureVariants: Variants = {
	hidden: { opacity: 0, y: 50, scale: 0.8 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: "spring", stiffness: 100, damping: 12, duration: 0.8 },
	},
};

export const Benefits = () => {
	return (
		<div
			className="group bg-base-200/25 container scroll-mt-12 rounded-2xl py-8 md:py-12 lg:py-16 2xl:py-28"
			id="benefits"
		>
			<div className="grid gap-6 lg:grid-cols-2 lg:gap-8 2xl:gap-12">
				<div>
					<div className="flex items-center gap-1.5 max-lg:justify-center">
						<div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
						<p className="text-base-content/60 group-hover:text-primary font-mono text-sm font-medium transition-all">
							Why Choose Us
						</p>
						<div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
					</div>
					<p className="mt-2 text-2xl font-semibold max-lg:text-center sm:text-3xl">
						Why Work With Us?
					</p>
					<div className="mt-2 flex max-lg:justify-center max-lg:text-center">
						<p className="text-base-content/80 max-w-lg">
							We are a boutique software studio specialising in React, Next.js,
							and modern cloud solutions. Small enough to give you personal
							attention, skilled enough to deliver enterprise-grade results.
						</p>
					</div>
				</div>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.4 }}
					variants={containerVariants}
					className="grid h-fit gap-6 sm:grid-cols-2"
				>
					{data.map((item, index) => (
						<motion.div
							variants={featureVariants}
							className="card bg-base-100 p-4 shadow"
							key={index}
						>
							<div className={`rounded-box w-fit p-1.5 ${item.iconClass}`}>
								<span className={`iconify ${item.icon} block size-5`}></span>
							</div>
							<p className="mt-2 font-medium">{item.title}</p>
							<p className="text-base-content/80 text-sm">{item.description}</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	);
};
