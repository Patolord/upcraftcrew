"use client";

import { useCurrency, CURRENCIES, type Currency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CurrencySelector() {
	const { currency, setCurrency, config } = useCurrency();
	const [isOpen, setIsOpen] = useState(false);

	const handleSelectCurrency = (newCurrency: Currency) => {
		setCurrency(newCurrency);
		setIsOpen(false);
	};

	return (
		<div className="relative">
			<Button
				className="btn btn-ghost btn-sm gap-2"
				onClick={() => setIsOpen(!isOpen)}
				type="button"
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
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>
					<div className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50">
						<div className="p-2">
							<div className="px-3 py-2 text-xs font-semibold text-base-content/60 uppercase">
								Selecionar Moeda
							</div>
							{Object.values(CURRENCIES).map((curr) => (
								<button
									key={curr.code}
									type="button"
									onClick={() => handleSelectCurrency(curr.code)}
									className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-base-200 transition-colors ${
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

