"use client";

import { toast } from "sonner";
import { securityLogger } from "@/lib/security-logger";
import { Image } from "@/components/ui/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useId } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export const LoginForm = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const rememberMeId = useId();
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Form state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Validação básica
			if (!email || !password) {
				toast.error("Please fill in all fields");
				setIsLoading(false);
				return;
			}

			// Login usando BetterAuth
			const result = await authClient.signIn.email({
				email,
				password,
				rememberMe,
			});

			if (result.error) {
				// ✅ Log de falha de login
				securityLogger.loginFailed(
					email,
					result.error.message || "Invalid credentials",
					undefined,
					navigator?.userAgent
				);
				toast.error(result.error.message || "Login failed");
				setIsLoading(false);
				return;
			}

			// ✅ Log de login bem-sucedido
			securityLogger.loginSuccess(
				result.data?.user?.id || "unknown",
				email,
				undefined,
				navigator?.userAgent
			);
			toast.success("Login successful!");

			// Redirecionar para a página original ou dashboard
			const redirect = searchParams.get("redirect") || "/dashboard";
			router.push(redirect);
			router.refresh();
		} catch (error) {
			console.error("Login error:", error);
			toast.error("An unexpected error occurred");
			setIsLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		console.log("Attempting Google sign in...");
		// signIn.social faz redirect automático, não precisa de await
		authClient.signIn.social({
			provider: "google",
			callbackURL: "/dashboard",
		});
	};

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

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Password</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--key-round text-base-content/80 size-5" />
					<input
						className="grow focus:outline-0"
						placeholder="Password"
						type={showPassword ? "text" : "password"}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
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

			<div className="text-end">
				<Link
					className="label-text text-base-content/80 text-xs"
					href="/auth/forgot-password"
				>
					Forgot Password?
				</Link>
			</div>

		<div className="mt-4 flex items-center gap-3 md:mt-6">
			<input
				className="checkbox checkbox-sm checkbox-primary"
				type="checkbox"
				id={rememberMeId}
				checked={rememberMe}
				onChange={(e) => setRememberMe(e.target.checked)}
				disabled={isLoading}
			/>
			<label htmlFor={rememberMeId} className="text-sm">
				Remember me
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
						Logging in...
					</>
				) : (
					<>
						<span className="iconify lucide--log-in size-4" />
						Login
					</>
				)}
			</button>

			<Button
				type="button"
				className="btn btn-ghost btn-wide border-base-300 mt-4 max-w-full gap-3"
				onClick={handleGoogleLogin}
				disabled={isLoading}
			>
				<Image
					src="/images/brand-logo/google-mini.svg"
					className="size-6"
					alt=""
					width={24}
					height={24}
				/>
				Login with Google
			</Button>

			<p className="text-base-content/80 mt-4 text-center text-sm md:mt-6">
				Haven&apos;t account
				<Link
					className="text-primary ms-1 hover:underline"
					href="/auth/register"
				>
					Create One
				</Link>
			</p>
		</form>
	);
};
