import type { Metadata } from "next";
import { PageTitle } from "@/components/PageTitle";
import { ProfileContent } from "@/components/profile/profile-content";

export const metadata: Metadata = {
	title: "Profile",
};

export default function ProfilePage() {
	return (
		<div className="p-6">
			<PageTitle
				title="My Profile"
				description="Manage your personal information and preferences"
			/>
			<ProfileContent />
		</div>
	);
}
