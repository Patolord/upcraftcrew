import { Suspense } from "react";
import { Benefits } from "./components/Benefits";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Integrations } from "./components/Integrations";
import { Portfolio } from "./components/Portfolio";
import { Pricing } from "./components/Pricing";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { Topbar } from "./components/Topbar";

const LandingPage = () => {
	return (
		<>
			<Topbar />
			<Hero />
			<Suspense fallback={<div />}>
				<Portfolio />
			</Suspense>
			<Features />
			<Process />
			<Benefits />
			<Integrations />
			<Testimonials />
			<Suspense fallback={<div />}>
				<Pricing />
			</Suspense>
			<Footer />
		</>
	);
};

export default LandingPage;
