/**
 * CSRF Protection
 *
 * Proteção contra Cross-Site Request Forgery usando Double Submit Cookie pattern.
 * BetterAuth já inclui proteção CSRF nativa em suas rotas de API.
 *
 * Esta implementação adiciona uma camada extra para rotas customizadas.
 */

import { NextRequest, NextResponse } from "next/server";

const CSRF_TOKEN_HEADER = "x-csrf-token";
const CSRF_COOKIE_NAME = "csrf-token";

/**
 * Gera um token CSRF aleatório
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Valida token CSRF usando Double Submit Cookie pattern
 */
export function validateCSRFToken(request: NextRequest): boolean {
  // GET, HEAD, OPTIONS não precisam de CSRF
  const method = request.method;
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return true;
  }

  // BetterAuth já protege suas próprias rotas
  if (request.nextUrl.pathname.startsWith("/api/auth/")) {
    return true;
  }

  // Verificar token no header vs cookie
  const headerToken = request.headers.get(CSRF_TOKEN_HEADER);
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (!headerToken || !cookieToken) {
    return false;
  }

  // Comparação constante de tempo para prevenir timing attacks
  return safeCompare(headerToken, cookieToken);
}

/**
 * Comparação constante de tempo
 */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Adiciona token CSRF à resposta
 */
export function setCSRFCookie(response: NextResponse): NextResponse {
  const token = generateCSRFToken();

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Precisa ser acessível pelo JavaScript
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 horas
  });

  return response;
}

/**
 * Hook do lado do cliente para obter token CSRF
 */
export function getCSRFToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(^|;\\s*)${CSRF_COOKIE_NAME}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Helper para fetch com CSRF token
 */
export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getCSRFToken();

  if (!token && options.method && !["GET", "HEAD", "OPTIONS"].includes(options.method)) {
    throw new Error("CSRF token not found. Ensure cookies are enabled.");
  }

  const headers = new Headers(options.headers);
  if (token) {
    headers.set(CSRF_TOKEN_HEADER, token);
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
  });
}
