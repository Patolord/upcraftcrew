"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function UserMenu() {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await authClient.signOut();
			toast.success("Logged out successfully");
			router.push("/auth/login");
		} catch (error) {
			toast.error("Failed to log out");
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Button
				onClick={handleLogout}
				className="btn btn-ghost btn-sm gap-2"
			>
				<span className="iconify lucide--log-out size-4" />
				Logout
			</Button>
		</div>
	);
}

