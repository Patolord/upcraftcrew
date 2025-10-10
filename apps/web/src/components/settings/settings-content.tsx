"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SettingsContent = () => {
	const { user, isLoading } = useAuth();
	const router = useRouter();
	const [showPasswordFields, setShowPasswordFields] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const handleChangePassword = async () => {
		if (!passwordData.currentPassword || !passwordData.newPassword) {
			toast.error("Please fill in all password fields");
			return;
		}

		if (passwordData.newPassword.length < 8) {
			toast.error("New password must be at least 8 characters");
			return;
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		setIsSaving(true);
		try {
			// TODO: Implementar change password via BetterAuth
			toast.success("Password changed successfully");
			setShowPasswordFields(false);
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
		} catch (error) {
			toast.error("Failed to change password");
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);

		if (!confirmed) return;

		try {
			// TODO: Implementar delete account
			toast.success("Account deleted");
			router.push("/auth/login");
		} catch (error) {
			toast.error("Failed to delete account");
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-12">
				<span className="loading loading-spinner loading-lg" />
			</div>
		);
	}

	return (
		<div className="mt-6 grid gap-6">
			{/* Account Settings */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<h3 className="card-title">
						<span className="iconify lucide--user-cog size-5" />
						Account Settings
					</h3>

					<div className="mt-4 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Email Address</p>
								<p className="text-sm text-base-content/60">{user?.email}</p>
							</div>
							{user?.emailVerified ? (
								<div className="badge badge-success gap-2">
									<span className="iconify lucide--check size-3" />
									Verified
								</div>
							) : (
								<button
									type="button"
									className="btn btn-sm btn-warning"
									onClick={() => toast.info("Verification email sent!")}
								>
									Verify Email
								</button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Security Settings */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<h3 className="card-title">
						<span className="iconify lucide--shield size-5" />
						Security
					</h3>

					<div className="mt-4 space-y-4">
						{/* Change Password */}
						<div className="border-b border-base-300 pb-4">
							<div className="flex items-center justify-between mb-2">
								<div>
									<p className="font-medium">Password</p>
									<p className="text-sm text-base-content/60">
										Change your password regularly to keep your account secure
									</p>
								</div>
								<button
									type="button"
									className="btn btn-sm btn-outline"
									onClick={() => setShowPasswordFields(!showPasswordFields)}
								>
									{showPasswordFields ? "Cancel" : "Change Password"}
								</button>
							</div>

							{showPasswordFields && (
								<div className="mt-4 space-y-3 bg-base-200/50 p-4 rounded-lg">
									<fieldset className="fieldset">
										<legend className="fieldset-legend">
											Current Password
										</legend>
										<input
											type="password"
											className="input w-full"
											value={passwordData.currentPassword}
											onChange={(e) =>
												setPasswordData((prev) => ({
													...prev,
													currentPassword: e.target.value,
												}))
											}
											placeholder="Enter current password"
										/>
									</fieldset>

									<fieldset className="fieldset">
										<legend className="fieldset-legend">New Password</legend>
										<input
											type="password"
											className="input w-full"
											value={passwordData.newPassword}
											onChange={(e) =>
												setPasswordData((prev) => ({
													...prev,
													newPassword: e.target.value,
												}))
											}
											placeholder="Enter new password (min. 8 characters)"
											minLength={8}
										/>
									</fieldset>

									<fieldset className="fieldset">
										<legend className="fieldset-legend">
											Confirm New Password
										</legend>
										<input
											type="password"
											className="input w-full"
											value={passwordData.confirmPassword}
											onChange={(e) =>
												setPasswordData((prev) => ({
													...prev,
													confirmPassword: e.target.value,
												}))
											}
											placeholder="Confirm new password"
										/>
									</fieldset>

									<button
										type="button"
										className="btn btn-primary btn-sm w-full"
										onClick={handleChangePassword}
										disabled={isSaving}
									>
										{isSaving ? (
											<span className="loading loading-spinner loading-sm" />
										) : (
											<>
												<span className="iconify lucide--save size-4" />
												Update Password
											</>
										)}
									</button>
								</div>
							)}
						</div>

						{/* Two-Factor Authentication */}
						<div className="border-b border-base-300 pb-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Two-Factor Authentication</p>
									<p className="text-sm text-base-content/60">
										Add an extra layer of security to your account
									</p>
								</div>
								<button
									type="button"
									className="btn btn-sm btn-outline"
									onClick={() => toast.info("2FA setup coming soon")}
								>
									Enable 2FA
								</button>
							</div>
						</div>

						{/* Active Sessions */}
						<div>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium">Active Sessions</p>
									<p className="text-sm text-base-content/60">
										Manage devices where you're currently logged in
									</p>
								</div>
								<button
									type="button"
									className="btn btn-sm btn-ghost"
									onClick={() => toast.info("Session management coming soon")}
								>
									View Sessions
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Preferences */}
			<div className="card bg-base-100 shadow-lg">
				<div className="card-body">
					<h3 className="card-title">
						<span className="iconify lucide--settings size-5" />
						Preferences
					</h3>

					<div className="mt-4 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Email Notifications</p>
								<p className="text-sm text-base-content/60">
									Receive updates about your projects and activities
								</p>
							</div>
							<input
								type="checkbox"
								className="toggle toggle-primary"
								defaultChecked
							/>
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Marketing Emails</p>
								<p className="text-sm text-base-content/60">
									Receive tips, news and promotions
								</p>
							</div>
							<input type="checkbox" className="toggle toggle-primary" />
						</div>
					</div>
				</div>
			</div>

			{/* Danger Zone */}
			<div className="card bg-error/10 border border-error/20 shadow-lg">
				<div className="card-body">
					<h3 className="card-title text-error">
						<span className="iconify lucide--alert-triangle size-5" />
						Danger Zone
					</h3>

					<div className="mt-4 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="font-medium">Delete Account</p>
								<p className="text-sm text-base-content/60">
									Permanently delete your account and all data. This cannot be
									undone.
								</p>
							</div>
							<button
								type="button"
								className="btn btn-error btn-outline"
								onClick={handleDeleteAccount}
							>
								Delete Account
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
