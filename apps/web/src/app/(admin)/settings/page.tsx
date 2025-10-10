import type { Metadata } from "next";
import { PageTitle } from "@/components/PageTitle";
import { SettingsContent } from "@/components/settings/settings-content";

export const metadata: Metadata = {
	title: "Settings",
};

export default function SettingsPage() {
	return (
		<div className="p-6">
			<PageTitle
				title="Settings"
				description="Manage your account settings and preferences"
			/>
			<SettingsContent />
		</div>
	);
}
