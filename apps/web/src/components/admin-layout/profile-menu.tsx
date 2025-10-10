"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export const ProfileMenu = () => {
	const { user, logout, isLoading } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	// Função para pegar iniciais do nome
	const getInitials = (name: string | null | undefined) => {
		if (!name) return "U";
		const parts = name.split(" ");
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	return (
		<div className="dropdown dropdown-bottom sm:dropdown-end max-sm:dropdown-center">
			<div className="flex cursor-pointer items-center gap-3">
				<div className="avatar bg-base-200 size-12 overflow-hidden rounded-full px-1 pt-1">
					{user?.image ? (
						<img src={user.image} alt={user.name || "User"} />
					) : (
						<div className="bg-primary text-primary-content flex size-full items-center justify-center font-semibold">
							{getInitials(user?.name)}
						</div>
					)}
				</div>
			</div>

			<div className="dropdown-content mt-2 w-54">
				{/* User Info Section */}
				{user && (
					<div className="bg-base-100 rounded-box shadow-lg mb-1.5 p-3">
						<div className="flex items-center gap-3">
							<div className="avatar bg-base-200 size-10 overflow-hidden rounded-full">
								{user.image ? (
									<img src={user.image} alt={user.name || "User"} />
								) : (
									<div className="bg-primary text-primary-content flex size-full items-center justify-center font-semibold text-sm">
										{getInitials(user.name)}
									</div>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<p className="font-medium text-sm truncate">
									{user.name || "User"}
								</p>
								<p className="text-xs text-base-content/60 truncate">
									{user.email}
								</p>
							</div>
						</div>
					</div>
				)}

				<div className="bg-base-100 rounded-box shadow-lg">
					<ul className="menu w-full p-2">
						<li>
							<Link href="/profile">
								<span className="iconify lucide--user size-4.5" />
								<span>My Profile</span>
							</Link>
						</li>
						<li>
							<Link href="/settings">
								<span className="iconify lucide--settings size-4.5" />
								<span>Settings</span>
							</Link>
						</li>
						<li>
							<Link href="/projects">
								<span className="iconify lucide--folder-open size-4.5" />
								<span>My Projects</span>
							</Link>
						</li>
					</ul>
				</div>

				<div className="bg-base-100 rounded-box mt-1.5 shadow-lg">
					<ul className="menu w-full p-2">
						<li className="menu-title">Select Team</li>
						<li>
							<div>
								<div className="from-primary to-primary/80 mask mask-squircle text-primary-content flex size-5 items-center justify-center bg-linear-to-b leading-none font-medium">
									C
								</div>
								<p className="grow text-sm">Creative Hub</p>
							</div>
						</li>
						<li>
							<div>
								<div className="from-secondary to-secondary/80 mask mask-squircle text-secondary-content flex size-5 items-center justify-center bg-linear-to-b leading-none font-medium">
									D
								</div>
								<p className="grow text-sm">Design Squad</p>
								<span className="iconify lucide--check size-4 opacity-60"></span>
							</div>
						</li>
						<li>
							<div>
								<div className="from-error to-error/80 mask mask-squircle text-error-content flex size-5 items-center justify-center bg-linear-to-b leading-none font-medium">
									M
								</div>
								<p className="grow text-sm">Marketing Team</p>
							</div>
						</li>
					</ul>
				</div>

				<div className="bg-base-100 rounded-box mt-1.5 shadow-lg">
					<ul className="menu w-full p-2">
						<li>
							<button
								type="button"
								onClick={handleLogout}
								className="text-error hover:bg-error/10"
								disabled={isLoading}
							>
								<span className="iconify lucide--log-out size-4.5" />
								<span>Sign Out</span>
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};
