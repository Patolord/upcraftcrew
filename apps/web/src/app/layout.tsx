import type { Metadata } from "next";
import type React from "react";
import { Providers } from "@/components/providers";
import { ConfigProvider } from "@/contexts/config";
import "@/styles/app.css";

export const metadata: Metadata = {
	title: "UpCraftCrew",
	description: "UpCraftCrew",
	icons: {
		icon: [
			{
				url: "/favicon.ico",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/favicon.ico",
				media: "(prefers-color-scheme: dark)",
			},
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning className="group/html">
			<head>
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				{/* eslint-disable-next-line @next/next/no-sync-scripts */}
				<script type="text/javascript" src="/js/prefetch-config.js"></script>
			</head>
			<body>
				<Providers>
					<ConfigProvider>{children}</ConfigProvider>
				</Providers>
			</body>
		</html>
	);
}
