// Validate required environment variables at module load time
if (!process.env.SITE_URL) {
	throw new Error(
		"Missing required environment variable: SITE_URL\n" +
			"Please set this in your .env file or deployment configuration.",
	);
}

if (!process.env.CONVEX_SITE_URL) {
	throw new Error(
		"Missing required environment variable: CONVEX_SITE_URL\n" +
			"Please set this in your .env file or deployment configuration.",
	);
}

const siteUrl = process.env.SITE_URL;
const convexSiteUrl = process.env.CONVEX_SITE_URL;

// Additional validation for URL format
if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
	throw new Error(
		`SITE_URL must be a valid URL starting with http:// or https://. Got: ${siteUrl}`,
	);
}

if (
	!convexSiteUrl.startsWith("http://") &&
	!convexSiteUrl.startsWith("https://")
) {
	throw new Error(
		`CONVEX_SITE_URL must be a valid URL starting with http:// or https://. Got: ${convexSiteUrl}`,
	);
}

export default {
	providers: [
		{
			domain: siteUrl,
			applicationID: "convex",
		},
		{
			domain: convexSiteUrl,
			applicationID: "convex",
		},
	],
};
