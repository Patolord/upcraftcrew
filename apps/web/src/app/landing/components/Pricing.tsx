"use client";

import { SECTION_IDS } from "@/app/landing/constants";
import { useLandingI18n } from "@/app/landing/providers/LandingI18nProvider";

export const Pricing = () => {
	const { messages } = useLandingI18n();
	const { pricing } = messages;
	const [webEssentials, businessPro, enterprise] = pricing.plans;

	return (
		<div
			className="group/section container py-8 md:py-12 lg:py-16 2xl:py-28"
			id={SECTION_IDS.pricing}
		>
			<div className="flex items-center justify-center gap-1.5">
				<div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
				<p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
					{pricing.eyebrow}
				</p>
				<div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
			</div>
			<p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">
				{pricing.title}
			</p>
			<div className="mt-2 flex justify-center text-center">
				<p className="text-base-content/80 max-w-lg">{pricing.description}</p>
			</div>

			<div className="mt-6 flex items-center justify-center lg:mt-8 2xl:mt-12">
				<div className="tabs tabs-box tabs-sm relative">
					<label className="tab">
						<input
							type="radio"
							name="plan_duration"
							defaultChecked
							value="project"
						/>
						<p className="mx-2">{pricing.tabs.projectBased}</p>
					</label>

					<label className="tab gap-0">
						<input type="radio" name="plan_duration" value="retainer" />
						<div className="gap mx-2 flex items-center gap-1.5">
							<span className="iconify lucide--award size-4"></span>
							<p>{pricing.tabs.retainer}</p>
						</div>
					</label>
					<div className="*:stroke-success/80 absolute -end-10 -bottom-6 -rotate-40 max-sm:hidden">
						<svg
							className="h-14"
							viewBox="0 0 111 111"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M24.2436 22.2464C21.9361 40.1037 24.1434 58.4063 36.2372 72.8438C47.1531 85.8753 63.0339 89.4997 72.0241 72.3997C76.2799 64.3049 75.9148 51.8626 68.2423 45.8372C59.6944 39.1242 52.5684 51.4637 52.3146 58.6725C51.7216 75.5092 64.21 92.4339 82.5472 94.5584C104.262 97.0741 103.365 74.6027 103.226 74.6577"
								strokeWidth="3"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M8.04486 34.0788C9.99828 33.6914 11.5767 32.5391 13.211 31.4701C18.5769 27.9613 23.2345 22.4666 24.743 16.0889C25.3522 23.1615 28.5274 32.1386 35.2148 35.4439"
								stroke="inherit"
								strokeWidth="4"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
					<p className="text-success absolute -end-30 bottom-4 text-sm font-semibold max-sm:hidden">
						{pricing.tabs.bestValue}
					</p>
				</div>
			</div>
			<div className="mt-6 grid grid-cols-1 gap-8 lg:mt-12 xl:grid-cols-3 2xl:mt-16">
				<div className="card bg-base-100 border-base-300 flex flex-col border border-dashed p-6">
					<div className="flex justify-between gap-3">
						<div>
							<p className="text-2xl font-semibold">{webEssentials.title}</p>
							<p className="text-base-content/80 text-sm">
								{webEssentials.subtitle}
							</p>
						</div>
					</div>
					<div className="mt-6 text-center">
						<p className="text-5xl leading-0 font-semibold">
							<span className="text-base-content/80 align-super text-xl font-medium">
								£
							</span>
							<span className="relative inline-block h-8 w-20">
								<span className="absolute start-0 top-1/2 -translate-y-1/2 scale-100 opacity-100 transition-all duration-500 group-has-[[value=project]:checked]/section:scale-100 group-has-[[value=project]:checked]/section:opacity-100 group-has-[[value=retainer]:checked]/section:scale-0 group-has-[[value=retainer]:checked]/section:opacity-0">
									{webEssentials.prices.project}
								</span>
								<span className="absolute start-0 top-1/2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-500 group-has-[[value=retainer]:checked]/section:scale-100 group-has-[[value=retainer]:checked]/section:opacity-100 group-has-[[value=project]:checked]/section:scale-0 group-has-[[value=project]:checked]/section:opacity-0">
									{webEssentials.prices.retainer}
								</span>
							</span>
						</p>
						<p className="text-base-content/80 mt-3 text-sm">
							<span className="group-has-[[value=project]:checked]/section:inline group-has-[[value=retainer]:checked]/section:hidden">
								{webEssentials.priceLabel.project}
							</span>
							<span className="group-has-[[value=project]:checked]/section:hidden group-has-[[value=retainer]:checked]/section:inline">
								{webEssentials.priceLabel.retainer}
							</span>
						</p>
					</div>
					<p className="text-base-content/80 mt-6 text-sm font-medium">
						{pricing.sectionsLabel}
					</p>
					<div className="mt-2.5 space-y-1.5">
						{webEssentials.features.map((feature) => (
							<div className="flex items-center gap-2" key={feature.label}>
								<span
									className={`iconify ${
										feature.included
											? "lucide--check text-success"
											: "lucide--x text-error"
									} size-4.5`}
								></span>
								{feature.label}
							</div>
						))}
					</div>
					<p className="text-base-content/70 mt-12 text-center font-medium italic">
						{webEssentials.quote}
					</p>
					<button className="btn btn-outline border-base-300 mt-6 gap-2.5">
						<span className="iconify lucide--arrow-right size-4"></span>
						{webEssentials.cta}
					</button>
				</div>
				<div className="card bg-base-100 border-base-300 flex flex-col border p-6">
					<div className="flex justify-between gap-3">
						<p className="text-primary text-2xl font-semibold">
							{businessPro.title}
						</p>
						{businessPro.badge ? (
							<div className="badge badge-primary badge-sm shadow-primary/10 shadow-lg">
								{businessPro.badge}
							</div>
						) : null}
					</div>
					<p className="text-base-content/80 text-sm">{businessPro.subtitle}</p>
					<div className="mt-6 text-center">
						<p className="text-primary text-5xl leading-0 font-semibold">
							<span className="text-base-content/80 align-super text-xl font-medium">
								£
							</span>
							<span className="relative inline-block h-8 w-20">
								<span className="absolute start-0 top-1/2 -translate-y-1/2 scale-100 opacity-100 transition-all duration-500 group-has-[[value=project]:checked]/section:scale-100 group-has-[[value=project]:checked]/section:opacity-100 group-has-[[value=retainer]:checked]/section:scale-0 group-has-[[value=retainer]:checked]/section:opacity-0">
									{businessPro.prices.project}
								</span>
								<span className="absolute start-0 top-1/2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-500 group-has-[[value=retainer]:checked]/section:scale-100 group-has-[[value=retainer]:checked]/section:opacity-100 group-has-[[value=project]:checked]/section:scale-0 group-has-[[value=project]:checked]/section:opacity-0">
									{businessPro.prices.retainer}
								</span>
							</span>
						</p>
						<p className="text-base-content/80 mt-3 text-sm">
							<span className="group-has-[[value=project]:checked]/section:inline group-has-[[value=retainer]:checked]/section:hidden">
								{businessPro.priceLabel.project}
							</span>
							<span className="group-has-[[value=project]:checked]/section:hidden group-has-[[value=retainer]:checked]/section:inline">
								{businessPro.priceLabel.retainer}
							</span>
						</p>
					</div>

					<p className="text-base-content/80 mt-6 text-sm font-medium">
						{pricing.sectionsLabel}
					</p>
					<div className="mt-2.5 space-y-1.5">
						{businessPro.features.map((feature) => (
							<div className="flex items-center gap-2" key={feature.label}>
								<span className="iconify lucide--check text-success size-4.5"></span>
								{feature.label}
							</div>
						))}
					</div>
					<p className="text-base-content/70 mt-12 text-center font-medium italic">
						{businessPro.quote}
					</p>
					<button className="btn btn-primary mt-6 gap-2.5">
						<span className="iconify lucide--rocket size-4"></span>
						{businessPro.cta}
					</button>
				</div>
				<div className="card bg-base-100 border-base-300 flex flex-col border p-6">
					<div className="flex justify-between gap-3">
						<p className="text-2xl font-semibold">{enterprise.title}</p>
						{enterprise.badge ? (
							<div className="badge badge-neutral badge-sm shadow-neutral/10 shadow-lg">
								{enterprise.badge}
							</div>
						) : null}
					</div>
					<p className="text-base-content/80 text-sm">{enterprise.subtitle}</p>

					<div className="mt-6 text-center">
						<p className="text-5xl leading-0 font-semibold">
							<span className="text-base-content/80 align-super text-xl font-medium">
								£
							</span>
							<span className="relative inline-block h-8 w-20">
								<span className="absolute start-0 top-1/2 -translate-y-1/2 scale-100 opacity-100 transition-all duration-500 group-has-[[value=project]:checked]/section:scale-100 group-has-[[value=project]:checked]/section:opacity-100 group-has-[[value=retainer]:checked]/section:scale-0 group-has-[[value=retainer]:checked]/section:opacity-0">
									{enterprise.prices.project}
								</span>
								<span className="absolute start-0 top-1/2 -translate-y-1/2 scale-0 opacity-0 transition-all duration-500 group-has-[[value=retainer]:checked]/section:scale-100 group-has-[[value=retainer]:checked]/section:opacity-100 group-has-[[value=project]:checked]/section:scale-0 group-has-[[value=project]:checked]/section:opacity-0">
									{enterprise.prices.retainer}
								</span>
							</span>
						</p>
						<p className="text-base-content/80 mt-3 text-sm">
							<span className="group-has-[[value=project]:checked]/section:inline group-has-[[value=retainer]:checked]/section:hidden">
								{enterprise.priceLabel.project}
							</span>
							<span className="group-has-[[value=project]:checked]/section:hidden group-has-[[value=retainer]:checked]/section:inline">
								{enterprise.priceLabel.retainer}
							</span>
						</p>
					</div>
					<p className="text-base-content/80 mt-6 text-sm font-medium">
						{pricing.sectionsLabel}
					</p>
					<div className="mt-2.5 space-y-1.5">
						{enterprise.features.map((feature) => (
							<div className="flex items-center gap-2" key={feature.label}>
								<span className="iconify lucide--check text-success size-4.5"></span>
								{feature.label}
							</div>
						))}
					</div>
					<p className="text-base-content/70 mt-12 text-center font-medium italic">
						{enterprise.quote}
					</p>
					<button className="btn btn-neutral mt-6 gap-2.5">
						<span className="iconify lucide--phone size-4"></span>
						{enterprise.cta}
					</button>
				</div>
			</div>
		</div>
	);
};

