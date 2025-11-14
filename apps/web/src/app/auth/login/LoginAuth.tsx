"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export const LoginAuth = () => {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const checkboxId = useId();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			agreement: false,
		},
		onSubmit: async ({ value }) => {
			if (!value.agreement) {
				toast.error("Please agree to the terms and conditions");
				return;
			}

			await authClient.signIn.email(
				{
					email: value.email,
					password: value.password,
				},
				{
					onSuccess: () => {
						router.push("/dashboard");
						toast.success("Login successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				email: z.string().email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
				agreement: z.boolean(),
			}),
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field name="email">
				{(field) => (
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Email Address</legend>
						<label className="input w-full focus:outline-0">
							<span className="iconify lucide--mail text-base-content/80 size-5"></span>
							<input
								className="grow focus:outline-0"
								placeholder="Email Address"
								type="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
						</label>
						{field.state.meta.errors.map((error) => (
							<p key={error?.message} className="text-red-500 text-xs mt-1">
								{error?.message}
							</p>
						))}
					</fieldset>
				)}
			</form.Field>

			<form.Field name="password">
				{(field) => (
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Password</legend>
						<label className="input w-full focus:outline-0">
							<span className="iconify lucide--key-round text-base-content/80 size-5"></span>
							<input
								className="grow focus:outline-0"
								placeholder="Password"
								type={showPassword ? "text" : "password"}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
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
						{field.state.meta.errors.map((error) => (
							<p key={error?.message} className="text-red-500 text-xs mt-1">
								{error?.message}
							</p>
						))}
					</fieldset>
				)}
			</form.Field>

			<div className="text-end">
				<Link
					className="label-text text-base-content/80 text-xs"
					href="/auth/forgot-password"
				>
					Forgot Password?
				</Link>
			</div>

			<form.Field name="agreement">
				{(field) => (
					<div className="mt-4 flex items-center gap-3 md:mt-6">
						<input
							className="checkbox checkbox-sm checkbox-primary"
							aria-label="Agreement checkbox"
							type="checkbox"
							id={`agreement-${checkboxId}`}
							checked={field.state.value}
							onChange={(e) => field.handleChange(e.target.checked)}
						/>
						<label htmlFor={`agreement-${checkboxId}`} className="text-sm">
							I agree with
							<span className="text-primary ms-1 cursor-pointer hover:underline">
								terms and conditions
							</span>
						</label>
					</div>
				)}
			</form.Field>

			<form.Subscribe>
				{(state) => (
					<Button
						type="submit"
						className="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6"
						disabled={!state.canSubmit || state.isSubmitting}
					>
						<span className="iconify lucide--log-in size-4" />
						{state.isSubmitting ? "Logging in..." : "Login"}
					</Button>
				)}
			</form.Subscribe>

			<Button
				type="button"
				className="btn btn-ghost btn-wide border-base-300 mt-4 max-w-full gap-3"
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
		</form>
	);
};
