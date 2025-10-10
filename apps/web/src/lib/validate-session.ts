/**
 * Session Validation Utilities
 *
 * Valida tokens de sessão do BetterAuth no middleware via API
 */

import { NextRequest } from "next/server";

/**
 * Validar sessão via BetterAuth API
 *
 * Faz request interno para o endpoint do BetterAuth que valida a sessão.
 * Este é o método mais seguro pois:
 * - Verifica se o token é válido
 * - Verifica se a sessão não expirou
 * - Detecta sessões revogadas
 * - Usa a própria lógica de validação do BetterAuth
 */
export async function validateSession(
  request: NextRequest
): Promise<{ valid: boolean; userId?: string }> {
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    return { valid: false };
  }

  try {
    // Fazer request interno para o endpoint do BetterAuth
    const baseUrl = process.env.SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/session`, {
      method: "GET",
      headers: {
        Cookie: `better-auth.session_token=${sessionToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();

    // BetterAuth retorna { user, session } se válido
    if (data.user && data.session) {
      return {
        valid: true,
        userId: data.user.id,
      };
    }

    return { valid: false };
  } catch (error) {
    console.error("Session validation error:", error);
    return { valid: false };
  }
}
