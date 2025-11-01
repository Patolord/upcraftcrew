import type { Metadata, Viewport } from "next";
import type React from "react";
import { Providers } from "@/components/providers";
import { ConfigProvider } from "@/contexts/config";
import "@/styles/app.css";

export const metadata: Metadata = {
	title: "UpCraftCrew",
	description: "UpCraftCrew - Gestão de Projetos e Equipes",
	manifest: "/manifest.json",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "UpCraftCrew",
	},
	formatDetection: {
		telephone: false,
	},
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
			{ url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
		],
	},
};

export const viewport: Viewport = {
	themeColor: "#000000",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="pt-BR" suppressHydrationWarning className="group/html">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=5"
				/>
				<meta name="theme-color" content="#000000" />
				<meta name="mobile-web-app-capable" content="yes" />
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
