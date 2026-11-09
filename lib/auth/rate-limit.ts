interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, RateLimitEntry>();
const MAX_ATTEMPTS = 6;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutos

/** Verifica si una IP está bloqueada por exceso de intentos. */
export function checkLoginAttempt(ip: string): { blocked: boolean; retryAfterMs?: number } {
  const entry = attempts.get(ip);
  if (!entry) return { blocked: false };

  if (entry.count >= MAX_ATTEMPTS) {
    if (Date.now() < entry.resetAt) {
      return { blocked: true, retryAfterMs: entry.resetAt - Date.now() };
    }
    // Ventana expirada, limpiar
    attempts.delete(ip);
    return { blocked: false };
  }

  return { blocked: false };
}

/** Registra un intento fallido para una IP. */
export function registerFailure(ip: string): void {
  const now = Date.now();
  const entry = attempts.get(ip);

  if (!entry || now >= entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

/** Resetea los intentos de una IP (login exitoso). */
export function resetAttempts(ip: string): void {
  attempts.delete(ip);
}

/** Limpia entradas expiradas (útil para tests o mantenimiento). */
export function cleanupExpired(): void {
  const now = Date.now();
  for (const [ip, entry] of attempts.entries()) {
    if (now >= entry.resetAt) {
      attempts.delete(ip);
    }
  }
}

/** Resetea todo el estado (solo para tests). */
export function __resetForTests(): void {
  attempts.clear();
}