"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

export const ProfileContent = () => {
	const { user, isLoading } = useAuth();
	const [isEditing, setIsEditing] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		bio: "",
		location: "",
		website: "",
	});

	// Atualizar formData quando user carregar
	useState(() => {
		if (user) {
			setFormData({
				name: user.name || "",
				email: user.email || "",
				bio: "",
				location: "",
				website: "",
			});
		}
	});

	const handleSave = async () => {
		try {
			// TODO: Implementar atualização de perfil via Convex mutation
			toast.success("Profile updated successfully!");
			setIsEditing(false);
		} catch (error) {
			toast.error("Failed to update profile");
		}
	};

	const getInitials = (name: string | null | undefined) => {
		if (!name) return "U";
		const parts = name.split(" ");
		if (parts.length >= 2) {
			return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-12">
				<span className="loading loading-spinner loading-lg" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="alert alert-error">
				<span>Failed to load user data</span>
			</div>
		);
	}

	return (
		<div className="mt-6 grid gap-6">
			{/* Profile Header Card */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<div className="flex items-start gap-6">
						{/* Avatar */}
						<div className="avatar">
							<div className="size-24 rounded-full bg-base-200">
								{user.image ? (
									<img src={user.image} alt={user.name || "User"} />
								) : (
									<div className="bg-primary text-primary-content flex size-full items-center justify-center text-3xl font-bold">
										{getInitials(user.name)}
									</div>
								)}
							</div>
						</div>

						{/* User Info */}
						<div className="flex-1">
							<h2 className="text-2xl font-bold">{user.name}</h2>
							<p className="text-base-content/60">{user.email}</p>

							{user.emailVerified ? (
								<div className="badge badge-success mt-2 gap-2">
									<span className="iconify lucide--check size-3" />
									Email Verified
								</div>
							) : (
								<div className="badge badge-warning mt-2 gap-2">
									<span className="iconify lucide--alert-circle size-3" />
									Email Not Verified
								</div>
							)}
						</div>

						{/* Edit Button */}
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => setIsEditing(!isEditing)}
						>
							{isEditing ? (
								<>
									<span className="iconify lucide--x size-4" />
									Cancel
								</>
							) : (
								<>
									<span className="iconify lucide--pencil size-4" />
									Edit Profile
								</>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Edit Form */}
			{isEditing && (
				<div className="card bg-base-100 shadow-lg">
					<div className="card-body">
						<h3 className="card-title">Edit Profile Information</h3>

						<div className="mt-4 space-y-4">
							<fieldset className="fieldset">
								<legend className="fieldset-legend">Full Name</legend>
								<input
									type="text"
									className="input w-full"
									value={formData.name}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, name: e.target.value }))
									}
									placeholder="Your name"
								/>
							</fieldset>

							<fieldset className="fieldset">
								<legend className="fieldset-legend">Email</legend>
								<input
									type="email"
									className="input w-full"
									value={formData.email}
									disabled
									placeholder="your@email.com"
								/>
								<label className="label">
									<span className="label-text-alt text-base-content/60">
										Email cannot be changed directly. Contact support if needed.
									</span>
								</label>
							</fieldset>

							<fieldset className="fieldset">
								<legend className="fieldset-legend">Bio</legend>
								<textarea
									className="textarea textarea-bordered w-full"
									rows={3}
									value={formData.bio}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, bio: e.target.value }))
									}
									placeholder="Tell us about yourself..."
								/>
							</fieldset>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<fieldset className="fieldset">
									<legend className="fieldset-legend">Location</legend>
									<input
										type="text"
										className="input w-full"
										value={formData.location}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												location: e.target.value,
											}))
										}
										placeholder="City, Country"
									/>
								</fieldset>

								<fieldset className="fieldset">
									<legend className="fieldset-legend">Website</legend>
									<input
										type="url"
										className="input w-full"
										value={formData.website}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												website: e.target.value,
											}))
										}
										placeholder="https://example.com"
									/>
								</fieldset>
							</div>
						</div>

						<div className="card-actions justify-end mt-6">
							<button
								type="button"
								className="btn btn-ghost"
								onClick={() => setIsEditing(false)}
							>
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-primary"
								onClick={handleSave}
							>
								<span className="iconify lucide--save size-4" />
								Save Changes
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Account Information */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<h3 className="card-title">Account Information</h3>

					<div className="mt-4 space-y-3">
						<div className="flex justify-between py-2 border-b border-base-300">
							<span className="text-base-content/60">User ID</span>
							<span className="font-mono text-sm">{user.id}</span>
						</div>

						<div className="flex justify-between py-2 border-b border-base-300">
							<span className="text-base-content/60">Account Created</span>
							<span>
								{user.createdAt
									? new Date(user.createdAt).toLocaleDateString()
									: "N/A"}
							</span>
						</div>

						<div className="flex justify-between py-2 border-b border-base-300">
							<span className="text-base-content/60">Last Updated</span>
							<span>
								{user.updatedAt
									? new Date(user.updatedAt).toLocaleDateString()
									: "N/A"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
