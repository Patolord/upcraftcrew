import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRateLimiter, strictRateLimiter } from "@/lib/rate-limit";

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/api/auth",
];

// Rotas protegidas que exigem autenticação
const PROTECTED_ROUTES = [
  "/dashboard",
  "/projects",
  "/team",
  "/schedule",
  "/finance",
  "/reports",
  "/profile",
  "/settings",
];

// Rotas sensíveis com rate limiting mais rigoroso
const SENSITIVE_AUTH_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Rate Limiting para rotas de autenticação
  if (SENSITIVE_AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const rateLimitResult = await authRateLimiter.check(
      request,
      5, // 5 tentativas por 15 minutos
      `auth:${pathname}`
    );

    if (!rateLimitResult.success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
          ),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(rateLimitResult.reset),
        },
      });
    }
  }

  // ✅ Rate Limiting para API routes
  if (pathname.startsWith("/api/auth/")) {
    const rateLimitResult = await strictRateLimiter.check(
      request,
      10, // 10 requests por hora
      `api:${pathname}`
    );

    if (!rateLimitResult.success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
          ),
        },
      });
    }

    return NextResponse.next();
  }

  // Verificar se o usuário tem sessão válida
  const sessionToken = request.cookies.get("better-auth.session_token");

  // Se está em rota pública, permitir acesso
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Se está em rota protegida
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ✅ Validação melhorada: verifica se token existe
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Para rotas protegidas, adicionar headers de segurança
  if (isProtectedRoute && sessionToken) {
    const response = NextResponse.next();

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );

    return response;
  }

  // Usuário autenticado tentando acessar rotas de auth (login, register)
  if (isPublicRoute && sessionToken && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirecionar raiz "/" para dashboard se autenticado, senão para login
  if (pathname === "/") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Configuração do matcher para aplicar o middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
