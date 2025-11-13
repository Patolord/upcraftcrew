import { LandingI18nProvider } from "@/app/landing/providers/LandingI18nProvider";
import type { ReactNode } from "react";

export default function PortfolioLayout({ children }: { children: ReactNode }) {
	return <LandingI18nProvider>{children}</LandingI18nProvider>;
}
