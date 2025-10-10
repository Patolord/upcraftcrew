/**
 * Security Event Logger
 *
 * Registra eventos de segurança importantes para auditoria e monitoramento.
 * Em produção, deve integrar com serviços como Sentry, LogRocket, ou Datadog.
 */

export enum SecurityEventType {
  // Autenticação
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILED = "LOGIN_FAILED",
  LOGOUT = "LOGOUT",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_FAILED = "REGISTER_FAILED",

  // Verificação de email
  EMAIL_VERIFICATION_SENT = "EMAIL_VERIFICATION_SENT",
  EMAIL_VERIFICATION_SUCCESS = "EMAIL_VERIFICATION_SUCCESS",
  EMAIL_VERIFICATION_FAILED = "EMAIL_VERIFICATION_FAILED",

  // Password
  PASSWORD_RESET_REQUESTED = "PASSWORD_RESET_REQUESTED",
  PASSWORD_RESET_SUCCESS = "PASSWORD_RESET_SUCCESS",
  PASSWORD_RESET_FAILED = "PASSWORD_RESET_FAILED",
  PASSWORD_CHANGE_SUCCESS = "PASSWORD_CHANGE_SUCCESS",
  PASSWORD_CHANGE_FAILED = "PASSWORD_CHANGE_FAILED",

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",

  // Acessos suspeitos
  UNAUTHORIZED_ACCESS_ATTEMPT = "UNAUTHORIZED_ACCESS_ATTEMPT",
  INVALID_TOKEN = "INVALID_TOKEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",

  // OAuth
  OAUTH_SUCCESS = "OAUTH_SUCCESS",
  OAUTH_FAILED = "OAUTH_FAILED",
}

export interface SecurityEvent {
  type: SecurityEventType;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  timestamp: number;
  metadata?: Record<string, any>;
  severity: "low" | "medium" | "high" | "critical";
}

class SecurityLogger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Log de evento de segurança
   */
  log(event: Omit<SecurityEvent, "timestamp">): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
    };

    // Em desenvolvimento: console.log colorido
    if (this.isDevelopment) {
      this.logToDevelopmentConsole(fullEvent);
    } else {
      // Em produção: enviar para serviço de monitoramento
      this.logToProduction(fullEvent);
    }

    // Eventos críticos: sempre alertar
    if (event.severity === "critical") {
      this.alertCriticalEvent(fullEvent);
    }
  }

  /**
   * Log formatado para desenvolvimento
   */
  private logToDevelopmentConsole(event: SecurityEvent): void {
    const colors = {
      low: "\x1b[32m",      // Verde
      medium: "\x1b[33m",   // Amarelo
      high: "\x1b[35m",     // Magenta
      critical: "\x1b[31m", // Vermelho
    };
    const reset = "\x1b[0m";
    const color = colors[event.severity];

    console.log(
      `${color}[SECURITY ${event.severity.toUpperCase()}]${reset} ${event.type}`,
      {
        userId: event.userId || "anonymous",
        email: event.email || "N/A",
        ip: event.ip || "unknown",
        timestamp: new Date(event.timestamp).toISOString(),
        ...event.metadata,
      }
    );
  }

  /**
   * Enviar para serviço de monitoramento em produção
   */
  private logToProduction(event: SecurityEvent): void {
    // TODO: Integrar com serviço de monitoramento
    // Exemplos:
    // - Sentry.captureEvent({ message: event.type, level: event.severity, ... })
    // - LogRocket.track(event.type, event)
    // - fetch("https://your-logging-service.com/api/security", { method: "POST", body: JSON.stringify(event) })

    console.warn("[SECURITY]", JSON.stringify(event));
  }

  /**
   * Alertar eventos críticos (email, SMS, Slack, etc.)
   */
  private alertCriticalEvent(event: SecurityEvent): void {
    // TODO: Implementar alertas para eventos críticos
    // Exemplos:
    // - Enviar email para equipe de segurança
    // - Enviar notificação para Slack
    // - Enviar SMS para administradores

    console.error("[CRITICAL SECURITY EVENT]", event);
  }

  /**
   * Helper: Log de login bem-sucedido
   */
  loginSuccess(userId: string, email: string, ip?: string, userAgent?: string): void {
    this.log({
      type: SecurityEventType.LOGIN_SUCCESS,
      userId,
      email,
      ip,
      userAgent,
      severity: "low",
    });
  }

  /**
   * Helper: Log de falha de login
   */
  loginFailed(email: string, reason: string, ip?: string, userAgent?: string): void {
    this.log({
      type: SecurityEventType.LOGIN_FAILED,
      email,
      ip,
      userAgent,
      severity: "medium",
      metadata: { reason },
    });
  }

  /**
   * Helper: Log de rate limit excedido
   */
  rateLimitExceeded(ip: string, route: string, userAgent?: string): void {
    this.log({
      type: SecurityEventType.RATE_LIMIT_EXCEEDED,
      ip,
      userAgent,
      severity: "high",
      metadata: { route },
    });
  }

  /**
   * Helper: Log de tentativa de acesso não autorizado
   */
  unauthorizedAccess(route: string, ip?: string, userAgent?: string): void {
    this.log({
      type: SecurityEventType.UNAUTHORIZED_ACCESS_ATTEMPT,
      ip,
      userAgent,
      severity: "high",
      metadata: { route },
    });
  }

  /**
   * Helper: Log de verificação de email enviada
   */
  emailVerificationSent(userId: string, email: string): void {
    this.log({
      type: SecurityEventType.EMAIL_VERIFICATION_SENT,
      userId,
      email,
      severity: "low",
    });
  }

  /**
   * Helper: Log de reset de senha solicitado
   */
  passwordResetRequested(email: string, ip?: string): void {
    this.log({
      type: SecurityEventType.PASSWORD_RESET_REQUESTED,
      email,
      ip,
      severity: "medium",
    });
  }
}

// Export singleton instance
export const securityLogger = new SecurityLogger();
