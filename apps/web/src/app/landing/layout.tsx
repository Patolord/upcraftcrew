import type { ReactNode } from "react";

import { LandingI18nProvider } from "@/app/landing/providers/LandingI18nProvider";

const LandingLayout = ({ children }: { children: ReactNode }) => {
	return <LandingI18nProvider>{children}</LandingI18nProvider>;
};

export default LandingLayout;

