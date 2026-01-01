"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import z from "zod";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

interface RegisterAuthProps {
	invitationToken: string;
	invitationEmail: string;
	invitationName: string;
}

export const RegisterAuth = ({
	invitationToken,
	invitationEmail,
	invitationName,
}: RegisterAuthProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();
	const checkboxId = useId();
	const acceptInvitation = useMutation(api.invitations.acceptInvitation);

	// Parse name from invitation (first name and last name)
	const nameParts = invitationName.trim().split(" ");
	const defaultFirstName = nameParts[0] || "";
	const defaultLastName = nameParts.slice(1).join(" ") || "";

	const form = useForm({
		defaultValues: {
			firstName: defaultFirstName,
			lastName: defaultLastName,
			username: "",
			email: invitationEmail,
			password: "",
			agreement: false,
		},
		onSubmit: async ({ value }) => {
			if (!value.agreement) {
				toast.error("Please agree to the terms and conditions");
				return;
			}

			// Validate that email matches invitation
			if (value.email !== invitationEmail) {
				toast.error("Email must match the invitation email");
				return;
			}

			// Combine first and last name for the auth client
			const fullName = `${value.firstName} ${value.lastName}`.trim();

			try {
				// Register the user
				await authClient.signUp.email(
					{
						email: value.email,
						password: value.password,
						name: fullName,
					},
					{
						onSuccess: async () => {
							// Mark invitation as accepted
							try {
								await acceptInvitation({
									email: value.email,
									token: invitationToken,
								});
								router.push("/dashboard");
								toast.success("Registration successful");
							} catch (error) {
								console.error("Failed to accept invitation:", error);
								// Still redirect, but show warning
								toast.warning("Registration successful, but failed to mark invitation as accepted");
								router.push("/dashboard");
							}
						},
						onError: (error) => {
							toast.error(error.error.message || error.error.statusText);
						},
					},
				);
			} catch (error) {
				console.error("Registration error:", error);
				toast.error("Failed to register. Please try again.");
			}
		},
		validators: {
			onSubmit: z.object({
				firstName: z.string().min(2, "First name must be at least 2 characters"),
				lastName: z.string().min(2, "Last name must be at least 2 characters"),
				username: z.string().min(3, "Username must be at least 3 characters"),
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
			<div className="grid grid-cols-1 gap-x-4 xl:grid-cols-2">
				<form.Field name="firstName">
					{(field) => (
						<fieldset className="fieldset">
							<legend className="fieldset-legend">First Name</legend>
							<label className="input w-full focus:outline-0">
								<span className="iconify lucide--user text-base-content/80 size-5"></span>
								<input
									className="grow focus:outline-0"
									placeholder="First Name"
									type="text"
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
				<form.Field name="lastName">
					{(field) => (
						<fieldset className="fieldset">
							<legend className="fieldset-legend">Last Name</legend>
							<label className="input w-full focus:outline-0">
								<span className="iconify lucide--user text-base-content/80 size-5"></span>
								<input
									className="grow focus:outline-0"
									placeholder="Last Name"
									type="text"
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
			</div>
			<form.Field name="username">
				{(field) => (
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Username</legend>
						<label className="input w-full focus:outline-0">
							<span className="iconify lucide--user-square text-base-content/80 size-5"></span>
							<input
								className="grow focus:outline-0"
								placeholder="Username"
								type="text"
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
								readOnly
								disabled
							/>
						</label>
						<p className="text-base-content/60 text-xs mt-1">
							Este email está associado ao seu convite.
						</p>
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
						<span className="iconify lucide--user-plus size-4" />
						{state.isSubmitting ? "Registering..." : "Register"}
					</Button>
				)}
			</form.Subscribe>

			<Button
				type="button"
				className="btn btn-ghost btn-wide border-base-300 mt-4 max-w-full gap-3"
				onClick={async () => {
					try {
						await authClient.signUp.social({
							provider: "google",
							callbackURL: "/dashboard",
						});
					} catch (error) {
						toast.error("Failed to register with Google");
						console.error("Google registration error:", error);
					}
				}}
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
