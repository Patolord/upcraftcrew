"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export const RegisterAuth = () => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
			<div className="grid grid-cols-1 gap-x-4 xl:grid-cols-2">
				<fieldset className="fieldset">
					<legend className="fieldset-legend">First Name</legend>
					<label className="input w-full focus:outline-0">
						<span className="iconify lucide--user text-base-content/80 size-5"></span>
						<input
							className="grow focus:outline-0"
							placeholder="First Name"
							type="text"
						/>
					</label>
				</fieldset>
				<fieldset className="fieldset">
					<legend className="fieldset-legend">Last Name</legend>
					<label className="input w-full focus:outline-0">
						<span className="iconify lucide--user text-base-content/80 size-5"></span>
						<input
							className="grow focus:outline-0"
							placeholder="Last Name"
							type="text"
						/>
					</label>
				</fieldset>
			</div>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Username</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--user-square text-base-content/80 size-5"></span>
					<input
						className="grow focus:outline-0"
						placeholder="Username"
						type="text"
					/>
				</label>
			</fieldset>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Email Address</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--mail text-base-content/80 size-5"></span>
					<input
						className="grow focus:outline-0"
						placeholder="Email Address"
						type="email"
					/>
				</label>
			</fieldset>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Password</legend>
				<label className="input w-full focus:outline-0">
					<span className="iconify lucide--key-round text-base-content/80 size-5"></span>
					<input
						className="grow focus:outline-0"
						placeholder="Password"
						type={showPassword ? "text" : "password"}
					/>
					<Button
						className="btn btn-xs btn-ghost btn-circle"
						onClick={() => setShowPassword(!showPassword)}
						aria-label="Password"
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
					aria-label="Checkbox example"
					type="checkbox"
					id={`agreement-${useId()}`}
				/>
				<label htmlFor="agreement" className="text-sm">
					I agree with
					<span className="text-primary ms-1 cursor-pointer hover:underline">
						terms and conditions
					</span>
				</label>
			</div>
			<Link
				href="/dashboard"
				className="btn btn-primary btn-wide mt-4 max-w-full gap-3 md:mt-6"
			>
				<span className="iconify lucide--user-plus size-4" />
				Register
			</Link>

			<Button className="btn btn-ghost btn-wide border-base-300 mt-4 max-w-full gap-3">
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
		</>
	);
};
