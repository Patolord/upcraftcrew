"use client";

import Link from "next/link";

import { SECTION_IDS } from "@/app/landing/constants";
import { useLandingI18n } from "@/app/landing/providers/LandingI18nProvider";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Footer = () => {
	const { messages } = useLandingI18n();
	const { footer, common } = messages;
	const currentYear = new Date().getFullYear().toString();
	const copyright = footer.legal.copyright.replace("{year}", currentYear);

	return (
		<div
			className="group/section border-base-200 bg-neutral/1 scroll-mt-12 rounded-t-xl border-t pt-2 md:pt-12 lg:pt-8 2xl:pt-14"
			id={SECTION_IDS.contact}
		>
			<div className="container">
				<div className="flex items-center justify-center gap-1.5">
					<div className="bg-primary/80 h-2 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
					<p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
						{footer.eyebrow}
					</p>
					<div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
				</div>
				<p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">
					{footer.title}
				</p>
				<div className="mt-2 flex justify-center text-center">
					<p className="text-base-content/80 max-w-lg">{footer.description}</p>
				</div>
				<div className="mt-8 flex items-start justify-center gap-4">
					<div>
						<div className="input w-40 sm:w-64">
							<span className="iconify lucide--mail text-base-content/80 size-5"></span>
							<input
								name="email"
								placeholder={common.form.emailPlaceholder}
								type="email"
							/>
						</div>
						<p className="text-base-content/60 mt-0.5 text-sm italic">
							{common.form.emailHelper}
						</p>
					</div>
					<Button className="btn btn-primary">{footer.cta}</Button>
				</div>
				<div className="mt-8 grid gap-6 md:mt-16 lg:grid-cols-2 xl:mt-24 2xl:mt-32">
					<div className="col-span-1">
						<div>
							<Link href="/">
								<Logo className="h-7.5" />
							</Link>
							<p className="text-base-content/80 mt-4 max-w-sm leading-5">
								{footer.summary}
							</p>
							<div className="mt-6 flex items-center gap-3">
								<Link href="https://play.google.com/store/apps/details?id=com.upcraftcrew.app" target="_blank">
									<img
										src="/images/brand-logo/google.svg"
										className="size-5 dark:invert"
										alt="Google Play"
									/>
								</Link>
								<Link href="https://apps.apple.com/br/app/upcraftcrew/id6734444444444444" target="_blank">
									<img
										src="/images/brand-logo/apple.svg"
										className="size-7 dark:invert"
										alt="Apple Store"
									/>
								</Link>
								<Link
									href="https://github.com/upcraftcrew"
									target="_blank"
									className="flex items-center gap-3"
								>
									<img
										src="/images/brand-logo/github.svg"
										className="size-6 dark:invert"
										alt="GitHub"
									/>
								</Link>
								<Link
									href="https://x.com/upcraftcrew"
									target="_blank"
									className="flex items-center gap-3"
									>
									<img
										src="/images/brand-logo/x.svg"
										className="size-5 dark:invert"
										alt="X"
										/>
									</Link>
							</div>
						</div>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<h2 className="text-lg font-medium">{footer.quickLinks.title}</h2>
							<div className="mt-2 flex flex-col gap-2">
								{footer.quickLinks.items.map((item) => (
									<Link className="hover:link-primary" href="#" key={item}>
										{item}
									</Link>
								))}
							</div>
						</div>
						<div>
							<h2 className="text-lg font-medium">{footer.resources.title}</h2>
							<div className="mt-2 flex flex-col gap-2">
								{footer.resources.items.map((item, index) => {
									const isCommunity = index === 3;
									return isCommunity ? (
										<Link
											href="#"
											className="hover:link-primary flex items-center gap-2"
											key={item}
										>
											{item}
											<div className="badge badge-sm badge-primary rounded-full">
												{footer.communityBadge}
											</div>
										</Link>
									) : (
										<Link className="hover:link-primary" href="#" key={item}>
											{item}
										</Link>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr className="text-base-200 mt-8" />
			<div className="container flex flex-wrap items-center justify-between gap-2 py-4">
				<p>{copyright}</p>
				<p>
					{footer.legal.credit.prefix}{" "}
					<Link
						href="https://x.com/withden_"
						className="text-blue-500 transition-all hover:text-blue-600"
						target="_blank"
					>
						{footer.legal.credit.linkLabel}
					</Link>
				</p>
				<div className="inline-flex items-center gap-4">
					<Link href="#" className="hover:link-primary link link-hover">
						{footer.legal.terms}
					</Link>
					<Link href="#" className="hover:link-primary link link-hover">
						{footer.legal.privacy}
					</Link>
				</div>
			</div>
		</div>
	);
};

