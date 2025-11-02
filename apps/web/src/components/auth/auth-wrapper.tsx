"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

interface AuthWrapperProps {
	children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
	return (
		<>
			<Authenticated>{children}</Authenticated>

			<Unauthenticated>
				<RedirectToLogin />
			</Unauthenticated>

			<AuthLoading>
				<div className="min-h-screen flex items-center justify-center bg-base-200">
					<div className="flex flex-col items-center gap-4">
						<span className="loading loading-spinner loading-lg"></span>
						<p className="text-lg">Loading...</p>
					</div>
				</div>
			</AuthLoading>
		</>
	);
}

function RedirectToLogin() {
	const router = useRouter();

	useEffect(() => {
		router.push("/auth/login");
	}, [router]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200">
			<div className="flex flex-col items-center gap-4">
				<span className="loading loading-spinner loading-lg"></span>
				<p className="text-lg">Redirecting to login...</p>
			</div>
		</div>
	);
}

