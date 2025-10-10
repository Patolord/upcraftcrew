/**
 * IP Geolocation Service
 *
 * Detecta localização geográfica baseada no IP do usuário.
 * Usa APIs gratuitas com fallback.
 */

export interface GeolocationData {
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

export interface DeviceInfo {
  type: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
}

/**
 * Detectar geolocalização por IP usando ipapi.co (gratuito, 1000 req/dia)
 */
export async function getGeolocationFromIP(
  ip: string
): Promise<GeolocationData | null> {
  // Localhost e IPs privados
  if (
    !ip ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.")
  ) {
    return {
      country: "Local",
      city: "Development",
      region: "Dev",
    };
  }

  try {
    // Tentar ipapi.co primeiro (gratuito, 1000 req/dia)
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "UpcraftCrew/1.0" },
      next: { revalidate: 3600 }, // Cache por 1 hora
    });

    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country_name,
        city: data.city,
        region: data.region,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    }
  } catch (error) {
    console.warn("ipapi.co failed, trying fallback...");
  }

  try {
    // Fallback: ip-api.com (gratuito, sem limite para uso não comercial)
    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        country: data.country,
        city: data.city,
        region: data.regionName,
        latitude: data.lat,
        longitude: data.lon,
      };
    }
  } catch (error) {
    console.warn("ip-api.com failed");
  }

  return null;
}

/**
 * Detectar informações do dispositivo pelo User-Agent
 */
export function getDeviceInfo(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();

  // Detectar tipo de dispositivo
  let type: "desktop" | "mobile" | "tablet" = "desktop";
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    type = "mobile";
  } else if (/tablet|ipad/i.test(ua)) {
    type = "tablet";
  }

  // Detectar browser
  let browser = "Unknown";
  if (ua.includes("chrome") && !ua.includes("edge")) {
    browser = "Chrome";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("edge")) {
    browser = "Edge";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser = "Opera";
  }

  // Detectar OS
  let os = "Unknown";
  if (ua.includes("win")) {
    os = "Windows";
  } else if (ua.includes("mac")) {
    os = "macOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  } else if (ua.includes("android")) {
    os = "Android";
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    os = "iOS";
  }

  return { type, browser, os };
}

/**
 * Server-side: Extrair IP do request do Next.js
 */
export function getClientIP(request: Request): string | null {
  // Headers comuns de proxies e CDNs
  const headers = [
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip", // Cloudflare
    "x-client-ip",
    "x-cluster-client-ip",
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for pode ter múltiplos IPs, pegar o primeiro
      return value.split(",")[0].trim();
    }
  }

  return null;
}

/**
 * Client-side: Obter geolocalização via browser (requer permissão do usuário)
 */
export async function getBrowserGeolocation(): Promise<GeolocationData | null> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve(null);
      },
      { timeout: 5000 }
    );
  });
}
