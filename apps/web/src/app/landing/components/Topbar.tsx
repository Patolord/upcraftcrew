"use client";

import Link from "next/link";
import type { UrlObject } from "url";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import { SECTION_IDS, type SectionId } from "@/app/landing/constants";
import { useLandingI18n } from "@/app/landing/providers/LandingI18nProvider";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Topbar = () => {
	const [scrollPosition, setScrollPosition] = useState<number>(0);
	const { locale, messages, switchLocale } = useLandingI18n();
	const {
		topbar: { menu, mobileNavigationLabel, languageSwitch },
	} = messages;

	const menuItems = useMemo(
		() =>
			menu.map((item) => {
				const target = item.target as SectionId;
				const sectionId = SECTION_IDS[target] ?? item.target;
				const href: UrlObject = {
					pathname: "/",
					hash: sectionId,
				};
				return {
					...item,
					href,
				};
			}),
		[menu],
	);

	const handleToggleLocale = useCallback(() => {
		const nextLocale = locale === "en" ? "pt-BR" : "en";
		switchLocale(nextLocale);
	}, [locale, switchLocale]);

	const languageToggleId = useId();
	const localeAbbreviations = useMemo(
		() => ({
			"pt-BR": "PT",
			en: "EN",
		}),
		[],
	);

	const handleScroll = useCallback(() => {
		setScrollPosition(window.scrollY);
	}, []);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [handleScroll]);

	return (
		<div
			className="group fixed start-0 end-0 top-0 z-10 flex justify-center md:top-4"
			data-at-top={scrollPosition < 30}
		>
			<div className="md:bg-base-100 bg-base-100/90 flex h-16 items-center gap-20 px-4 backdrop-blur-xs transition-all duration-500 group-data-[at-top=false]:shadow group-data-[at-top=true]:bg-transparent hover:group-data-[at-top=false]:shadow-lg max-md:grow max-md:justify-between md:rounded-full md:px-8">
				<div className="flex items-center gap-2">
					<div className="md:hidden">
						<div className="drawer">
							<input
								id="navigation-drawer"
								type="checkbox"
								className="drawer-toggle"
							/>
							<div className="drawer-content">
								<label
									htmlFor="navigation-drawer"
									className="btn btn-sm btn-ghost btn-square drawer-button"
								>
									<span className="iconify lucide--menu size-5"></span>
								</label>
							</div>
							<div className="drawer-side">
								<label
									htmlFor="navigation-drawer"
									aria-label="close sidebar"
									className="drawer-overlay"
								></label>
								<div className="bg-base-100 flex h-screen w-60 flex-col px-3 py-4">
									<div className="flex justify-start">
										<Link href="/">
											<Logo />
										</Link>
									</div>
									<div className="min-h-0 grow">
										<SimpleBar className="mt-5 size-full">
											<p className="text-base-content/60 mx-3 text-sm font-medium">
												{mobileNavigationLabel}
											</p>
											<ul className="menu mt-1 w-full p-0">
												{menuItems.map((item, index) => (
													<li key={index}>
														<Link
															key={index}
															href={item.href}
															className="hover:bg-base-200 rounded-box block px-3 py-1.5 text-sm"
														>
															{item.title}
														</Link>
													</li>
												))}
											</ul>
										</SimpleBar>
									</div>
								</div>
							</div>
						</div>
					</div>
					<Link href="/">
						<Logo />
					</Link>
				</div>
				<div className="hidden items-center gap-1 md:flex">
					{menuItems.map((item, index) => (
						<Link
							href={item.href}
							className="hover:bg-base-200 rounded-box block px-3 py-1.5 text-sm"
							key={index}
						>
							{item.title}
						</Link>
					))}
				</div>

				<div className="flex items-center gap-2">
					<span id={`${languageToggleId}-label`} className="sr-only">
						{languageSwitch.ariaLabel}
					</span>
					<div className="flex items-center gap-2 rounded-full bg-base-100/90 px-2 py-1">
						<span
							className="text-xs font-medium uppercase text-base-content/70"
							title={languageSwitch.options["pt-BR"]}
						>
							{localeAbbreviations["pt-BR"]}
						</span>
						<input
							className="toggle toggle-sm toggle-primary"
							id={languageToggleId}
							type="checkbox"
							role="switch"
							aria-labelledby={`${languageToggleId}-label`}
							checked={locale === "en"}
							onChange={handleToggleLocale}
						/>
						<span
							className="text-xs font-medium uppercase text-base-content/70"
							title={languageSwitch.options.en}
						>
							{localeAbbreviations.en}
						</span>
					</div>
					<ThemeToggle className="btn btn-sm btn-ghost btn-circle" />
				</div>
			</div>
		</div>
	);
};
