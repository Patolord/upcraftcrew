import { createAuth } from "@upcraftcrew-os/backend/convex/auth";
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import type { GenericDataModel } from "convex/server";
import type { CreateAuth } from "@convex-dev/better-auth";

export const getToken = () => {
	return getTokenNextjs(createAuth as CreateAuth<GenericDataModel>);
};
