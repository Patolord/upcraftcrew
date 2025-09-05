import Link from "next/link";

import { Logo } from "@/components/Logo";

export const Footer = () => {
	return (
		<div
			className="group/section border-base-200 bg-neutral/1 scroll-mt-12 rounded-t-xl border-t pt-8 md:pt-12 lg:pt-16 2xl:pt-28"
			id="contact"
		>
			<div className="container">
				<div className="flex items-center justify-center gap-1.5">
					<div className="bg-primary/80 h-4 w-0.5 translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
					<p className="text-base-content/60 group-hover/section:text-primary font-mono text-sm font-medium transition-all">
						Stay Connected
					</p>
					<div className="bg-primary/80 h-4 w-0.5 -translate-x-1.5 rounded-full opacity-0 transition-all group-hover/section:translate-x-0 group-hover/section:opacity-100" />
				</div>
				<p className="mt-2 text-center text-2xl font-semibold sm:text-3xl">
					Ready to Start Your Project?
				</p>
				<div className="mt-2 flex justify-center text-center">
					<p className="text-base-content/80 max-w-lg">
						Let's discuss your web development needs. Get a free consultation
						and see how we can help bring your vision to life.
					</p>
				</div>
				<div className="mt-8 flex items-start justify-center gap-4">
					<div>
						<div className="input w-40 sm:w-64">
							<span className="iconify lucide--mail text-base-content/80 size-5"></span>
							<input name="email" placeholder="Email Address" type="email" />
						</div>
						<p className="text-base-content/60 mt-0.5 text-sm italic">
							Never spam!
						</p>
					</div>
					<button className="btn btn-primary">Get Free Consultation</button>
				</div>
				<div className="mt-8 grid gap-6 md:mt-16 lg:grid-cols-2 xl:mt-24 2xl:mt-32">
					<div className="col-span-1">
						<div>
							<Link href="/">
								<Logo className="h-7.5" />
							</Link>
							<p className="text-base-content/80 mt-4 max-w-sm leading-5">
								Boutique software studio specialising in React, Next.js, and
								modern cloud solutions. Small enough to give you personal
								attention, skilled enough to deliver enterprise-grade results.
							</p>
							<div className="mt-6 flex items-center gap-3">
								<button
									className="btn btn-ghost btn-square border-base-300 btn-sm max-w-full gap-3"
									aria-label="Google"
								>
									<img
										src="/images/brand-logo/google.svg"
										className="size-5 dark:invert"
										alt="Google"
									/>
								</button>
								<button
									className="btn btn-ghost btn-square border-base-300 btn-sm max-w-full gap-3"
									aria-label="Apple"
								>
									<img
										src="/images/brand-logo/apple.svg"
										className="size-5 dark:invert"
										alt="Apple"
									/>
								</button>
								<button
									className="btn btn-ghost btn-square border-base-300 btn-sm max-w-full gap-3"
									aria-label="Github"
								>
									<img
										src="/images/brand-logo/github.svg"
										className="size-5 dark:invert"
										alt="Github"
									/>
								</button>
								<button
									className="btn btn-ghost btn-square border-base-300 btn-sm max-w-full gap-3"
									aria-label="X"
								>
									<img
										src="/images/brand-logo/x.svg"
										className="size-4 dark:invert"
										alt="X"
									/>
								</button>
							</div>
						</div>
					</div>
					<div className="grid gap-6 md:grid-cols-2">
						<div>
							<h2 className="text-lg font-medium">Quick Links</h2>
							<div className="mt-2 flex flex-col gap-2">
								<Link className="hover:link-primary" href="#">
									Home
								</Link>
								<Link className="hover:link-primary" href="#">
									Features
								</Link>
								<Link className="hover:link-primary" href="#">
									Pricing
								</Link>
								<Link className="hover:link-primary" href="#">
									About Us
								</Link>
								<Link className="hover:link-primary" href="#">
									Contact
								</Link>
							</div>
						</div>
						<div>
							<h2 className="text-lg font-medium">Resources</h2>
							<div className="mt-2 flex flex-col gap-2">
								<Link className="hover:link-primary" href="#">
									Documentation
								</Link>
								<Link className="hover:link-primary" href="#">
									Help Center
								</Link>
								<Link className="hover:link-primary" href="#">
									FAQs
								</Link>
								<Link
									href="#"
									className="hover:link-primary flex items-center gap-2"
								>
									Community{" "}
									<div className="badge badge-sm badge-primary rounded-full">
										New
									</div>
								</Link>

								<Link className="hover:link-primary" href="#">
									Blog
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<hr className="text-base-200 mt-8" />
			<div className="container flex flex-wrap items-center justify-between gap-2 py-4">
				<p>© {new Date().getFullYear()} Upcraft Crew</p>
				<p>
					Concept to Reality by
					<Link
						href="https://x.com/withden_"
						className="ms-1 text-blue-500 transition-all hover:text-blue-600"
						target="_blank"
					>
						Upcraft Crew
					</Link>
				</p>
				<div className="inline-flex items-center gap-4">
					<Link href="#" className="hover:link-primary link link-hover">
						Terms
					</Link>
					<Link href="#" className="hover:link-primary link link-hover">
						Privacy Policy
					</Link>
				</div>
			</div>
		</div>
	);
};
