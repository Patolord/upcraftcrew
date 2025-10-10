"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { toast } from "sonner";

export const RegisterForm = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		agreedToTerms: false,
	});

	const handleChange = (field: string, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const validateForm = () => {
		if (!formData.firstName.trim()) {
			toast.error("First name is required");
			return false;
		}
		if (!formData.lastName.trim()) {
			toast.error("Last name is required");
			return false;
		}
		if (!formData.email.trim()) {
			toast.error("Email is required");
			return false;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			toast.error("Please enter a valid email");
			return false;
		}
		if (formData.password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return false;
		}
		if (!formData.agreedToTerms) {
			toast.error("You must agree to the terms and conditions");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			// Registrar usando BetterAuth
			const result = await authClient.signUp.email({
				email: formData.email,
				password: formData.password,
				name: `${formData.firstName} ${formData.lastName}`,
			});

			if (result.error) {
				toast.error(result.error.message || "Registration failed");
				setIsLoading(false);
				return;
			}

			toast.success("Registration successful! Redirecting...");

			// Redirecionar para dashboard após registro bem-sucedido
			setTimeout(() => {
				router.push("/dashboard");
				router.refresh();
			}, 1000);
		} catch (error) {
			console.error("Registration error:", error);
			toast.error("An unexpected error occurred");
			setIsLoading(false);
		}
	};

	const handleGoogleRegister = async () => {
		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/dashboard",
			});
		} catch (error) {
			console.error("Google register error:", error);
			toast.error("Failed to register with Google");
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<div className="grid grid-cols-1 gap-x-4 xl:grid-cols-2">
				<fieldset className="fieldset">
					<legend className="fieldset-legend">First Name</legend>
					<label className="input w-full focus:outline-0">
						<span className="iconify lucide--user text-base-content/80 size-5" />
						<input
							className="grow focus:outline-0"
							placeholder="First Name"
							type="text"
							value={formData.firstName}
							onChange={(e) => handleChange("firstName", e.target.value)}
							disabled={isLoading}
							required
						/>
					</label>
				</fieldset>
				<fieldset className="fieldset">
					<legend className="fieldset-legend">Last Name</legend>
					<label className="input w-full focus:outline-0">
						<span className="iconify lucide--user text-base-content/80 size-5" />
						<input
							className="grow focus:outline-0"
							placeholder="Last Name"
							type="text"
							value={formData.lastName}
							onChange={(e) => handleChange("lastName", e.target.value)}
							disabled={isLoading}
							required
						/>
					</label>
				</fieldset>
			</div>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Email Address</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--mail text-base-content/80 size-5" />
					<input
						className="grow focus:outline-0"
						placeholder="Email Address"
						type="email"
						value={formData.email}
						onChange={(e) => handleChange("email", e.target.value)}
						disabled={isLoading}
						required
					/>
				</label>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Password</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--key-round text-base-content/80 size-5" />
					<input
						className="grow focus:outline-0"
						placeholder="Password (min. 8 characters)"
						type={showPassword ? "text" : "password"}
						value={formData.password}
						onChange={(e) => handleChange("password", e.target.value)}
						disabled={isLoading}
						required
						minLength={8}
					/>
					<Button
						type="button"
						className="btn btn-xs btn-ghost btn-circle"
						onClick={() => setShowPassword(!showPassword)}
						aria-label="Toggle password visibility"
					>
						{showPassword ? (
							<span className="iconify lucide--eye-off size-4" />
						) : (
							<span className="iconify lucide--eye size-4" />
						)}
					</Button>
				</label>
			</fieldset>

			<div className="mt-4 flex items-center gap-3 md:mt-6">
				<input
					className="checkbox checkbox-sm checkbox-primary"
					type="checkbox"
					id="agreement"
					checked={formData.agreedToTerms}
					onChange={(e) => handleChange("agreedToTerms", e.target.checked)}
					disabled={isLoading}
					required
				/>
				<label htmlFor="agreement" className="text-sm">
					I agree with
					<span className="text-primary ms-1 cursor-pointer hover:underline">
						terms and conditions
					</span>
				</label>
			</div>

			<button
				type="submit"
				className="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6"
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						<span className="loading loading-spinner loading-sm" />
						Creating account...
					</>
				) : (
					<>
						<span className="iconify lucide--user-plus size-4" />
						Register
					</>
				)}
			</button>

			<Button
				type="button"
				className="btn btn-ghost btn-wide border-base-300 mt-4 max-w-full gap-3"
				onClick={handleGoogleRegister}
				disabled={isLoading}
			>
				<Image
					src="/images/brand-logo/google-mini.svg"
					className="size-6"
					alt=""
					width={24}
					height={24}
				/>
				Register with Google
			</Button>

			<p className="text-base-content/80 mt-4 text-center text-sm md:mt-6">
				I have already to
				<Link className="text-primary ms-1 hover:underline" href="/auth/login">
					Login
				</Link>
			</p>
		</form>
	);
};
