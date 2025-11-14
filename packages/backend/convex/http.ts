import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { registerAdminUser } from "./registerAdmin";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

// Admin registration endpoint
http.route({
	path: "/registerAdmin",
	method: "POST",
	handler: registerAdminUser,
});

export default http;
