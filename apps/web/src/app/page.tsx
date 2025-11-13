import type { Metadata } from "next";

import Landing from "./landing/page";
import { LandingI18nProvider } from "./landing/providers/LandingI18nProvider";

export const metadata: Metadata = {
	title: "Landing - Product Preview",
};
const LandingPage = () => {
	return (
		<LandingI18nProvider>
			<Landing />
		</LandingI18nProvider>
	);
};

export default LandingPage;
