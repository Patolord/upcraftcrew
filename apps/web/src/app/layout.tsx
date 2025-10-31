import type { Metadata, Viewport } from "next";
import type React from "react";
import { Providers } from "@/components/providers";
import { ConfigProvider } from "@/contexts/config";
import "@/styles/app.css";

export const metadata: Metadata = {
	title: "UpCraftCrew",
	description: "UpCraftCrew - Plataforma de Gestão de Projetos",
	manifest: "/manifest.json",
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
		apple: [
			{
				url: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
		],
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "UpCraftCrew",
	},
};

export const viewport: Viewport = {
	themeColor: "#3b82f6",
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
