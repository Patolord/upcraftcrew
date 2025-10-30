import Hero from "@/app/landing/components/Hero";
import { Benefits } from "./components/Benefits";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { Integrations } from "./components/Integrations";
import { Pricing } from "./components/Pricing";
import { Process } from "./components/Process";
import { Testimonials } from "./components/Testimonials";
import { Topbar } from "./components/Topbar";

const LandingPage = () => {
	return (
		<>
			<Topbar />
			<Hero />
			<Features />
			<Process />
			<Benefits />
			<Integrations />
			<Testimonials />
			<Pricing />
			<Footer />
		</>
	);
};

export default LandingPage;
