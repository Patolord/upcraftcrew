import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRateLimiter, strictRateLimiter } from "@/lib/rate-limit";
import { securityLogger, SecurityEventType } from "@/lib/security-logger";
import { validateCSRFToken, setCSRFCookie } from "@/lib/csrf";
import { validateSession } from "@/lib/validate-session";

// Helper para obter IP do request
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

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
  const clientIp = getClientIp(request);
  const method = request.method;

  // ✅ Validação CSRF apenas para métodos que modificam dados em API routes
  const isStateMutatingMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  const isApiRoute = pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/");
  
  if (isStateMutatingMethod && isApiRoute) {
    if (!validateCSRFToken(request)) {
      securityLogger.log({
        type: SecurityEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
        ip: clientIp,
        userAgent: request.headers.get("user-agent") || undefined,
        severity: "high",
        metadata: { reason: "Invalid CSRF token", route: pathname, method },
      });
      return new NextResponse("Forbidden - Invalid CSRF Token", { status: 403 });
    }
  }

  // ✅ Rate Limiting para rotas de autenticação
  if (SENSITIVE_AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const rateLimitResult = await authRateLimiter.check(
      request,
      5, // 5 tentativas por 15 minutos
      `auth:${pathname}`
    );

    if (!rateLimitResult.success) {
      // ✅ Log de rate limit excedido
      securityLogger.rateLimitExceeded(
        clientIp,
        pathname,
        request.headers.get("user-agent") || undefined
      );
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
  // Excluir rotas de OAuth e social sign-in do rate limiting
  const isOAuthRoute = 
    pathname.includes("/callback/") || 
    pathname.includes("/sign-in/social") ||
    pathname.includes("/sign-up/social");
  
  if (pathname.startsWith("/api/auth/") && !isOAuthRoute) {
    const rateLimitResult = await strictRateLimiter.check(
      request,
      20, // Aumentado de 10 para 20 requests por hora
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

  // ✅ Validação REAL de sessão via BetterAuth API
  if (isProtectedRoute) {
    if (!sessionToken) {
      // Log de tentativa de acesso sem token
      securityLogger.unauthorizedAccess(
        pathname,
        clientIp,
        request.headers.get("user-agent") || undefined
      );
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Validar se o token é válido, não expirado, e não revogado
    const validation = await validateSession(request);

    if (!validation.valid) {
      // ✅ Sessão inválida, expirada ou revogada
      securityLogger.log({
        type: SecurityEventType.INVALID_TOKEN,
        ip: clientIp,
        userAgent: request.headers.get("user-agent") || undefined,
        severity: "medium",
        metadata: { reason: "Invalid or expired session", route: pathname },
      });

      // Limpar cookie inválido e redirecionar
      const response = NextResponse.redirect(
        new URL("/auth/login?expired=true", request.url)
      );
      response.cookies.delete("better-auth.session_token");
      return response;
    }

    // ✅ Sessão válida - continuar
  }

  // ✅ Para rotas protegidas, adicionar headers de segurança e CSRF cookie
  if (isProtectedRoute && sessionToken) {
    let response = NextResponse.next();

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );

    // ✅ Content Security Policy (CSP)
    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://curious-rhinoceros-373.convex.cloud",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://curious-rhinoceros-373.convex.cloud https://accounts.google.com",
      "frame-src 'self' https://accounts.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");
    response.headers.set("Content-Security-Policy", cspHeader);

    // ✅ Adicionar CSRF cookie se não existir
    if (!request.cookies.get("csrf-token")) {
      response = setCSRFCookie(response);
    }

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
