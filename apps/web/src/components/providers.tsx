"use client";

import * as React from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { Toaster } from "sonner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			<CurrencyProvider>
				<Toaster richColors position="top-center" />
				{children}
			</CurrencyProvider>
		</ConvexBetterAuthProvider>
	);
}
