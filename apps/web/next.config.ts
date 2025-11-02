import withPWA from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
	reactCompiler: false,
	turbopack: {
		// Configure custom module resolution extensions
		resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json", ".css"],
		// Optional: Configure module aliases if needed
		resolveAlias: {
			// Example: '@': path.join(__dirname, 'src'),
		},
	},
};

export default withPWA({
	dest: "public",
	disable: process.env.NODE_ENV === "development",
	register: true,
	sw: "sw.js",
	fallbacks: {
		document: "/offline",
	},
})(nextConfig);
