import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
	title: "Register",
};

const RegisterPage = () => {
	return (
		<div className="flex flex-col items-stretch p-8 lg:p-16">
			<div className="flex items-center justify-between">
				<Link href="/dashboard">
					<Logo />
				</Link>
				<ThemeToggle className="btn btn-circle btn-outline border-base-300" />
			</div>
			<h3 className="mt-8 text-center text-xl font-semibold md:mt-12 lg:mt-24">
				Register
			</h3>
			<h3 className="text-base-content/70 mt-2 text-center text-sm">
				Seamless Access, Secure Connection: Your Gateway to a Personalized
				Experience.
			</h3>
			<div className="mt-6 md:mt-10">
				<RegisterForm />
			</div>
		</div>
	);
};

export default RegisterPage;
