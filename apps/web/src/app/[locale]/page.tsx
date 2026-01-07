import { Suspense } from "react";

import { Benefits } from "./components/Benefits";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Portfolio } from "./components/Portfolio";
import { Pricing } from "./components/Pricing";
import { Process } from "./components/Process";
import { Topbar } from "./components/Topbar";

const LandingPage = () => {
	return (
		<>
			<Suspense fallback={<div className="h-20" />}>
				<Topbar />
			</Suspense>
			<Hero />
			<Suspense fallback={<div />}>
				<Portfolio />
			</Suspense>
			<Features />
			<Process />
			<Benefits />
			<Suspense fallback={<div />}>
				<Pricing />
			</Suspense>
			<Footer />
		</>
	);
};

export default LandingPage;

