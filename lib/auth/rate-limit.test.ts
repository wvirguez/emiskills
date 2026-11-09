import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { checkLoginAttempt, registerFailure, resetAttempts, __resetForTests } from "@/lib/auth/rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    __resetForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("checkLoginAttempt permite IP sin intentos previos", () => {
    const result = checkLoginAttempt("192.168.1.1");
    expect(result.blocked).toBe(false);
  });

  it("registerFailure incrementa contador", () => {
    registerFailure("192.168.1.1");
    registerFailure("192.168.1.1");
    const entry = checkLoginAttempt("192.168.1.1");
    expect(entry.blocked).toBe(false);
  });

  it("bloquea al 6º intento fallido", () => {
    for (let i = 0; i < 5; i++) {
      registerFailure("192.168.1.1");
    }
    // 5 fallos: aún no bloquea
    expect(checkLoginAttempt("192.168.1.1").blocked).toBe(false);

    // 6º fallo
    registerFailure("192.168.1.1");
    expect(checkLoginAttempt("192.168.1.1").blocked).toBe(true);
  });

  it("se libera pasado el tiempo de ventana (15 min)", () => {
    for (let i = 0; i < 6; i++) {
      registerFailure("192.168.1.1");
    }
    expect(checkLoginAttempt("192.168.1.1").blocked).toBe(true);

    // Avanzar 15 minutos + 1 segundo
    vi.advanceTimersByTime(15 * 60 * 1000 + 1000);
    expect(checkLoginAttempt("192.168.1.1").blocked).toBe(false);
  });

  it("resetAttempts limpia los intentos tras login exitoso", () => {
    for (let i = 0; i < 6; i++) {
      registerFailure("192.168.1.1");
    }
    expect(checkLoginAttempt("192.168.1.1").blocked).toBe(true);

    resetAttempts("192.168.1.1");
    expect(checkLoginAttempt("192.168.1.1").blocked).toBe(false);
  });

  it("diferentes IPs tienen contadores independientes", () => {
    for (let i = 0; i < 6; i++) {
      registerFailure("192.168.1.1");
    }
    expect(checkLoginAttempt("192.168.1.1").blocked).toBe(true);
    expect(checkLoginAttempt("192.168.1.2").blocked).toBe(false);
  });

  it("checkLoginAttempt devuelve retryAfterMs cuando está bloqueado", () => {
    for (let i = 0; i < 6; i++) {
      registerFailure("192.168.1.1");
    }
    const result = checkLoginAttempt("192.168.1.1");
    expect(result.blocked).toBe(true);
    expect(result.retryAfterMs).toBeGreaterThan(0);
    expect(result.retryAfterMs).toBeLessThanOrEqual(15 * 60 * 1000);
  });
});