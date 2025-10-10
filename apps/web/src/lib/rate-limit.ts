import type { NextRequest } from "next/server";

interface RateLimitConfig {
	interval: number; // Tempo em ms (ex: 60000 = 1 min)
	uniqueTokenPerInterval: number; // Máximo de IPs únicos a trackear
}

interface TokenBucket {
	count: number;
	resetTime: number;
}

const cache = new Map<string, TokenBucket>();

export class RateLimiter {
	private config: RateLimitConfig;

	constructor(config: RateLimitConfig) {
		this.config = config;
	}

	async check(
		request: NextRequest,
		limit: number,
		identifier?: string
	): Promise<{ success: boolean; remaining: number; reset: number }> {
		const token =
			identifier || request.ip || request.headers.get("x-forwarded-for") || "anonymous";

		const now = Date.now();
		const tokenBucket = cache.get(token);

		// Limpar entradas antigas periodicamente
		if (cache.size > this.config.uniqueTokenPerInterval) {
			const oldestAllowedTime = now - this.config.interval;
			for (const [key, value] of cache.entries()) {
				if (value.resetTime < oldestAllowedTime) {
					cache.delete(key);
				}
			}
		}

		if (!tokenBucket || now > tokenBucket.resetTime) {
			// Novo token ou expirado, resetar
			const newBucket: TokenBucket = {
				count: 1,
				resetTime: now + this.config.interval,
			};
			cache.set(token, newBucket);

			return {
				success: true,
				remaining: limit - 1,
				reset: newBucket.resetTime,
			};
		}

		// Token existente e ainda válido
		tokenBucket.count++;
		cache.set(token, tokenBucket);

		const success = tokenBucket.count <= limit;
		const remaining = Math.max(0, limit - tokenBucket.count);

		return {
			success,
			remaining,
			reset: tokenBucket.resetTime,
		};
	}
}

// Rate limiters para diferentes tipos de requisições
export const authRateLimiter = new RateLimiter({
	interval: 15 * 60 * 1000, // 15 minutos
	uniqueTokenPerInterval: 500,
});

export const apiRateLimiter = new RateLimiter({
	interval: 60 * 1000, // 1 minuto
	uniqueTokenPerInterval: 500,
});

export const strictRateLimiter = new RateLimiter({
	interval: 60 * 60 * 1000, // 1 hora
	uniqueTokenPerInterval: 200,
});
