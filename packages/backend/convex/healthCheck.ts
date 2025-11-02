import { query } from "./_generated/server";

// Query: Health check
export const get = query({
	args: {},
	handler: async () => {
		return "OK";
	},
});
