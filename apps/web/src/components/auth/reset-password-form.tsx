"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ResetPasswordForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Validações
			if (!formData.password || !formData.confirmPassword) {
				toast.error("Please fill in all fields");
				setIsLoading(false);
				return;
			}

			if (formData.password.length < 8) {
				toast.error("Password must be at least 8 characters");
				setIsLoading(false);
				return;
			}

			if (formData.password !== formData.confirmPassword) {
				toast.error("Passwords do not match");
				setIsLoading(false);
				return;
			}

			// Token de reset vem da URL (enviado por email)
			const token = searchParams.get("token");
			if (!token) {
				toast.error("Invalid or expired reset link");
				setIsLoading(false);
				return;
			}

			// Resetar senha usando BetterAuth
			const result = await authClient.resetPassword({
				newPassword: formData.password,
			});

			if (result.error) {
				toast.error(result.error.message || "Failed to reset password");
				setIsLoading(false);
				return;
			}

			toast.success("Password changed successfully!");

			// Redirecionar para login após 1 segundo
			setTimeout(() => {
				router.push("/auth/login");
			}, 1000);
		} catch (error) {
			console.error("Reset password error:", error);
			toast.error("An unexpected error occurred");
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">New Password</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--key-round text-base-content/80 size-5" />
					<input
						className="grow focus:outline-0"
						placeholder="New Password (min. 8 characters)"
						type={showPassword ? "text" : "password"}
						value={formData.password}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, password: e.target.value }))
						}
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

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Confirm Password</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--key-round text-base-content/80 size-5" />
					<input
						className="grow focus:outline-0"
						placeholder="Confirm Password"
						type={showPassword ? "text" : "password"}
						value={formData.confirmPassword}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								confirmPassword: e.target.value,
							}))
						}
						disabled={isLoading}
						required
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

			<button
				type="submit"
				className="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6"
				disabled={isLoading}
			>
				{isLoading ? (
					<>
						<span className="loading loading-spinner loading-sm" />
						Changing password...
					</>
				) : (
					<>
						<span className="iconify lucide--check size-4" />
						Change Password
					</>
				)}
			</button>

			<p className="mt-4 text-center text-sm md:mt-6">
				Remember your password?
				<Link
					className="text-primary ms-1.5 hover:underline"
					href="/auth/login"
				>
					Login
				</Link>
			</p>
		</form>
	);
};
