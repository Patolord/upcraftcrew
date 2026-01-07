import { LandingI18nProvider } from "@/app/[locale]/providers/LandingI18nProvider";
import type { ReactNode } from "react";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
	return <LandingI18nProvider locale="en">{children}</LandingI18nProvider>;
}
