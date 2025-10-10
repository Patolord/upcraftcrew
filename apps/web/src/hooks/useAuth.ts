"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "convex/react";
import { api } from "@upcraftcrew-os/backend/convex/_generated/api";
import { toast } from "sonner";

/**
 * Hook personalizado para gerenciar autenticação
 * Integra BetterAuth com Convex para sessão e dados do usuário
 */
export function useAuth() {
	const router = useRouter();

	// Buscar dados do usuário autenticado via Convex
	const user = useQuery(api.auth.getCurrentUser);

	// Estado de carregamento
	const isLoading = user === undefined;

	// Usuário está autenticado se houver dados
	const isAuthenticated = !!user;

	/**
	 * Fazer login
	 */
	const login = async (email: string, password: string, rememberMe = false) => {
		try {
			const result = await authClient.signIn.email({
				email,
				password,
				rememberMe,
			});

			if (result.error) {
				throw new Error(result.error.message || "Login failed");
			}

			return { success: true, data: result.data };
		} catch (error) {
			console.error("Login error:", error);
			return {
				success: false,
				error: error instanceof Error ? error.message : "Login failed",
			};
		}
	};

	/**
	 * Fazer registro
	 */
	const register = async (
		email: string,
		password: string,
		name: string
	) => {
		try {
			const result = await authClient.signUp.email({
				email,
				password,
				name,
			});

			if (result.error) {
				throw new Error(result.error.message || "Registration failed");
			}

			return { success: true, data: result.data };
		} catch (error) {
			console.error("Registration error:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Registration failed",
			};
		}
	};

	/**
	 * Fazer logout
	 */
	const logout = async () => {
		try {
			await authClient.signOut();
			toast.success("Logged out successfully");
			router.push("/auth/login");
			router.refresh();
			return { success: true };
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Failed to logout");
			return {
				success: false,
				error: error instanceof Error ? error.message : "Logout failed",
			};
		}
	};

	/**
	 * Solicitar reset de senha
	 */
	const forgotPassword = async (email: string) => {
		try {
			const result = await authClient.forgetPassword({
				email,
				redirectTo: "/auth/reset-password",
			});

			if (result.error) {
				throw new Error(result.error.message || "Failed to send reset email");
			}

			return { success: true };
		} catch (error) {
			console.error("Forgot password error:", error);
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to send reset email",
			};
		}
	};

	/**
	 * Resetar senha
	 */
	const resetPassword = async (newPassword: string) => {
		try {
			const result = await authClient.resetPassword({
				newPassword,
			});

			if (result.error) {
				throw new Error(result.error.message || "Failed to reset password");
			}

			return { success: true };
		} catch (error) {
			console.error("Reset password error:", error);
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to reset password",
			};
		}
	};

	return {
		// Dados do usuário
		user,
		isLoading,
		isAuthenticated,

		// Métodos de autenticação
		login,
		register,
		logout,
		forgotPassword,
		resetPassword,
	};
}
