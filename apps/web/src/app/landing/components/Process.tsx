export const Process = () => {
	return (
		<div
			className="group container py-8 md:py-12 lg:py-16 2xl:py-28"
			id="process"
		>
			<div className="flex items-center justify-center gap-1.5">
				<div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
				<p className="text-base-content/60 group-hover:text-primary font-mono text-sm font-medium transition-all">
					Our Process
				</p>
				<div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
			</div>
			<p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">
				Our Development Process
			</p>
			<div className="mt-2 flex justify-center text-center">
				<p className="text-base-content/80 max-w-lg">
					From initial consultation to final deployment, we follow a proven
					process that ensures quality and transparency
				</p>
			</div>
			<div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-12 lg:mt-16 xl:grid-cols-4 2xl:mt-24">
				<div>
					<div className="flex items-center justify-center">
						<div className="bg-base-200/60 border-base-200 rounded-full border p-3">
							<span className="iconify lucide--zap block size-6"></span>
						</div>
					</div>
					<div className="card bg-base-200/60 border-base-200 mt-4 min-h-76 border p-5">
						<p className="text-center text-lg font-medium">
							Discovery & Planning
						</p>
						<p className="text-base-content/60 mt-1 text-center text-sm italic">
							We start by understanding your vision and requirements.
						</p>
						<div className="mt-6 space-y-1.5 space-x-1.5">
							<div className="bg-base-100 rounded-box border-base-200 inline-flex items-center gap-2 border px-3 py-1.5">
								<span className="iconify lucide--users"></span>
								Requirements gathering
							</div>
							<div className="bg-base-100 rounded-box border-base-200 inline-flex items-center gap-2 border px-3 py-1.5">
								<span className="iconify lucide--layout"></span>
								Wireframing
							</div>
							<div className="bg-base-100 rounded-box border-base-200 inline-flex items-center gap-2 border px-3 py-1.5">
								<span className="iconify lucide--calendar"></span>
								Timeline planning
							</div>
							<div className="bg-base-100 rounded-box border-base-200 inline-flex items-center gap-2 border px-3 py-1.5">
								<span className="iconify lucide--file-text"></span>
								Technical specification
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="flex items-center justify-center">
						<div className="from-primary to-secondary text-primary-content rounded-full border border-transparent bg-linear-to-br p-3">
							<span className="iconify lucide--settings block size-6"></span>
						</div>
					</div>
					<div className="card from-primary to-secondary text-primary-content mt-4 min-h-76 bg-linear-to-br p-5">
						<p className="text-center text-lg font-medium">
							Development & Design
						</p>
						<p className="text-primary-content/60 mt-1 text-center text-sm italic">
							Our team brings your vision to life with clean code
						</p>

						<div className="mt-10 text-center">
							<span className="iconify lucide--sparkles size-16 text-white/40"></span>
						</div>
						<div className="mt-10 flex flex-col items-center space-y-1.5 [--color-base-100:#ffffff66]">
							<div className="flex items-center gap-2">
								<div className="skeleton h-1.5 w-24 bg-white/20"></div>
								<div className="skeleton h-1.5 w-8 bg-white/20"></div>
							</div>
							<div className="skeleton h-1.5 w-50 bg-white/20"></div>
							<div className="flex items-center gap-2">
								<div className="skeleton h-1.5 w-8 bg-white/20"></div>
								<div className="skeleton h-1.5 w-16 bg-white/20"></div>
								<div className="skeleton h-1.5 w-12 bg-white/20"></div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="flex items-center justify-center">
						<div className="from-primary to-secondary rounded-full border border-transparent bg-linear-to-br p-0.5">
							<div className="bg-base-100 rounded-full p-2.5">
								<span className="iconify lucide--sparkles block size-6"></span>
							</div>
						</div>
					</div>
					<div className="from-primary to-secondary card mt-4 bg-linear-to-br p-1">
						<div className="bg-base-100 rounded-box min-h-74 p-5">
							<p className="text-center text-lg font-medium">
								Testing & Deployment
							</p>
							<p className="text-base-content/60 mt-1 text-center text-sm italic">
								Rigorous testing and seamless deployment to production
							</p>
							<div className="mt-5 space-y-2 space-x-2">
								<div className="border-base-200 rounded-box inline-flex items-center gap-2 border px-2.5 py-1">
									<span className="iconify lucide--check-circle"></span>
									Quality assurance
								</div>
								<div className="border-base-200 rounded-box inline-flex items-center gap-2 border px-2.5 py-1">
									<span className="iconify lucide--cloud-upload"></span>
									Cloud deployment
								</div>
								<div className="border-base-200 rounded-box inline-flex items-center gap-2 border px-2.5 py-1">
									<span className="iconify lucide--shield-check"></span>
									Security audit
								</div>
								<div className="border-base-200 rounded-box inline-flex items-center gap-2 border px-2.5 py-1">
									<span className="iconify lucide--rocket"></span>
									Go live
								</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div className="flex items-center justify-center">
						<div className="border-base-300 bg-base-100 rounded-full border border-dashed p-3">
							<span className="iconify lucide--user-cog block size-6"></span>
						</div>
					</div>
					<div className="card border-base-300 mt-4 min-h-76 border border-dashed p-5">
						<p className="text-center text-lg font-medium">Ongoing Support</p>
						<p className="text-base-content/60 mt-1 text-center text-sm italic">
							Continuous maintenance and support for your application.
						</p>

						<div className="mt-6 flex flex-wrap gap-2.5">
							<button className="btn btn-soft btn-primary btn-sm gap-2">
								<span className="iconify lucide--monitor size-4"></span>
								Performance Monitoring
							</button>
							<button className="btn btn-soft btn-primary btn-sm gap-2">
								<span className="iconify lucide--refresh-cw size-4"></span>
								Updates & Patches
							</button>
							<button className="btn btn-soft btn-primary btn-sm gap-2">
								<span className="iconify lucide--shield size-4"></span>
								Security Updates
							</button>
							<button className="btn btn-soft btn-primary btn-sm gap-2">
								<span className="iconify lucide--help-circle size-4"></span>
								Technical Support
							</button>
							<button className="btn btn-soft btn-primary btn-sm gap-2">
								<span className="iconify lucide--trending-up size-4"></span>
								Feature Enhancements
							</button>
							<button className="btn btn-soft btn-primary btn-sm gap-2">
								<span className="iconify lucide--code size-4"></span>
								Code Reviews
							</button>
							<button className="btn btn-ghost btn-primary btn-sm">More</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
