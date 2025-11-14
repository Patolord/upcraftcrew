"use client";

import { useCurrency, CURRENCIES, type Currency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useMemo } from "react";

export function CurrencySelector() {
	const { currency, setCurrency, config } = useCurrency();
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const menuId = useRef(`currency-menu-${Math.random().toString(36).substr(2, 9)}`);
	
	const currencies = useMemo(() => Object.values(CURRENCIES), []);
	const currentIndex = useMemo(
		() => currencies.findIndex((curr) => curr.code === currency),
		[currencies, currency]
	);

	const handleSelectCurrency = (newCurrency: Currency) => {
		setCurrency(newCurrency);
		closeMenu();
	};

	const closeMenu = () => {
		setIsOpen(false);
		setActiveIndex(-1);
		triggerRef.current?.focus();
	};

	const openMenu = () => {
		setIsOpen(true);
		// Set initial active index to current selected currency
		setActiveIndex(currentIndex >= 0 ? currentIndex : 0);
	};

	// Focus management: focus the active menu item when menu opens or active index changes
	useEffect(() => {
		if (isOpen && menuRef.current && activeIndex >= 0) {
			const menuItems = menuRef.current.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
			if (menuItems[activeIndex]) {
				menuItems[activeIndex].focus();
			}
		}
	}, [isOpen, activeIndex]);

	// Keyboard navigation
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setActiveIndex((prev) => (prev + 1) % currencies.length);
					break;
				case "ArrowUp":
					e.preventDefault();
					setActiveIndex((prev) => (prev - 1 + currencies.length) % currencies.length);
					break;
				case "Home":
					e.preventDefault();
					setActiveIndex(0);
					break;
				case "End":
					e.preventDefault();
					setActiveIndex(currencies.length - 1);
					break;
				case "Enter":
				case " ":
					e.preventDefault();
					if (activeIndex >= 0 && activeIndex < currencies.length) {
						handleSelectCurrency(currencies[activeIndex].code);
					}
					break;
				case "Escape":
					e.preventDefault();
					closeMenu();
					break;
				case "Tab":
					// Close menu on Tab to allow normal focus flow
					closeMenu();
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, activeIndex, currencies]);

	// Click outside to close
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			if (
				menuRef.current &&
				triggerRef.current &&
				!menuRef.current.contains(e.target as Node) &&
				!triggerRef.current.contains(e.target as Node)
			) {
				closeMenu();
			}
		};

		// Use capture phase to handle before other handlers
		document.addEventListener("mousedown", handleClickOutside, true);
		return () => document.removeEventListener("mousedown", handleClickOutside, true);
	}, [isOpen]);

	return (
		<div className="relative">
			<Button
				ref={triggerRef}
				className="btn btn-ghost btn-sm gap-2"
				onClick={() => (isOpen ? closeMenu() : openMenu())}
				type="button"
				aria-haspopup="menu"
				aria-expanded={isOpen}
				aria-controls={isOpen ? menuId.current : undefined}
			>
				<span className="iconify lucide--badge-dollar-sign size-4" />
				<span className="hidden sm:inline">{config.symbol} {config.code}</span>
				<span className="sm:hidden">{config.symbol}</span>
				<span className={`iconify lucide--chevron-down size-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</Button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={closeMenu}
						aria-hidden="true"
					/>
					<div
						ref={menuRef}
						id={menuId.current}
						className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50"
						role="menu"
						aria-label="Currency selection"
						aria-activedescendant={
							activeIndex >= 0 ? `${menuId.current}-item-${activeIndex}` : undefined
						}
					>
						<div className="p-2">
							<div className="px-3 py-2 text-xs font-semibold text-base-content/60 uppercase">
								Select Currency
							</div>
							{currencies.map((curr, index) => (
								<button
									key={curr.code}
									id={`${menuId.current}-item-${index}`}
									type="button"
									role="menuitem"
									tabIndex={index === activeIndex ? 0 : -1}
									aria-label={`Select ${curr.name}`}
									aria-current={currency === curr.code ? "true" : undefined}
									onClick={() => handleSelectCurrency(curr.code)}
									onMouseEnter={() => setActiveIndex(index)}
									onFocus={() => setActiveIndex(index)}
									className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-100 ${
										currency === curr.code ? "bg-primary/10 text-primary" : ""
									}`}
								>
									<div className="flex items-center gap-3">
										<span className="text-xl">{curr.symbol}</span>
										<div className="text-left">
											<p className="font-medium text-sm">{curr.code}</p>
											<p className="text-xs text-base-content/60">{curr.name}</p>
										</div>
									</div>
									{currency === curr.code && (
										<span className="iconify lucide--check size-4" />
									)}
								</button>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
