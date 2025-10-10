"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const ForgotPasswordForm = () => {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				toast.error("Please enter a valid email address");
				setIsLoading(false);
				return;
			}

			// Enviar email de reset usando BetterAuth
			const result = await authClient.forgetPassword({
				email,
				redirectTo: "/auth/reset-password",
			});

			if (result.error) {
				toast.error(result.error.message || "Failed to send reset email");
				setIsLoading(false);
				return;
			}

			setEmailSent(true);
			toast.success("Password reset link sent to your email!");
		} catch (error) {
			console.error("Forgot password error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	if (emailSent) {
		return (
			<div className="text-center">
				<div className="bg-success/10 text-success rounded-lg p-4 mb-6">
					<span className="iconify lucide--mail-check size-12 mx-auto mb-2" />
					<p className="font-medium">Email Sent!</p>
					<p className="text-sm mt-1">
						Check your inbox for password reset instructions.
					</p>
				</div>
				<Link
					className="text-primary hover:underline"
					href="/auth/login"
				>
					Back to Login
				</Link>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Email Address</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--mail text-base-content/80 size-5" />
					<input
						className="grow focus:outline-0"
						placeholder="Email Address"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={isLoading}
						required
					/>
				</label>
			</fieldset>

			<button
				type="submit"
				className="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6"
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						<span className="loading loading-spinner loading-sm" />
						Sending...
					</>
				) : (
					<>
						<span className="iconify lucide--mail-plus size-4" />
						Send Reset Link
					</>
				)}
			</button>

			<p className="text-base-content/80 mt-4 text-center text-sm md:mt-6">
				Remember your password?
				<Link
					className="text-primary ms-1 hover:underline"
					href="/auth/login"
				>
					Login
				</Link>
			</p>
		</form>
	);
};
