import { describe, expect, it, vi } from "vitest";
import { verifySessionToken } from "@/lib/auth/session-token";
import { createHmac } from "node:crypto";

vi.mock("@/lib/env", () => ({
  getAdminEnv: vi.fn(() => ({
    ADMIN_EMAIL: "admin@test.com",
    ADMIN_PASSWORD_HASH: "scrypt$00000000000000000000000000000000$000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
    SESSION_SECRET: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  })),
}));

describe("verifySessionToken", () => {
  const secret = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const payload = { sub: "admin" as const, exp: Date.now() + 8 * 60 * 60 * 1000 };
  const data = JSON.stringify(payload);
  const validSignature = createHmac("sha256", secret).update(data).digest("hex");
  const validToken = `${data}.${validSignature}`;

  it("acepta un token válido", () => {
    const result = verifySessionToken(validToken);
    expect(result).toEqual(payload);
  });

  it("rechaza token manipulado (firma inválida)", () => {
    const tampered = `${data}.${"0".repeat(64)}`;
    const result = verifySessionToken(tampered);
    expect(result).toBeNull();
  });

  it("rechaza token firmado con otro secreto", () => {
    const otherSecret = "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210";
    const otherSignature = createHmac("sha256", otherSecret).update(data).digest("hex");
    const token = `${data}.${otherSignature}`;
    const result = verifySessionToken(token);
    expect(result).toBeNull();
  });

  it("rechaza token expirado", () => {
    const expiredPayload = { sub: "admin" as const, exp: Date.now() - 1000 };
    const expiredData = JSON.stringify(expiredPayload);
    const expiredSignature = createHmac("sha256", secret).update(expiredData).digest("hex");
    const expiredToken = `${expiredData}.${expiredSignature}`;
    const result = verifySessionToken(expiredToken);
    expect(result).toBeNull();
  });

  it("rechaza token sin firma", () => {
    const result = verifySessionToken(data);
    expect(result).toBeNull();
  });

  it("rechaza token sin datos", () => {
    const result = verifySessionToken(`.${validSignature}`);
    expect(result).toBeNull();
  });

  it("rechaza token con sub distinto de admin", () => {
    const badPayload = { sub: "user", exp: Date.now() + 8 * 60 * 60 * 1000 };
    const badData = JSON.stringify(badPayload);
    const badSignature = createHmac("sha256", secret).update(badData).digest("hex");
    const token = `${badData}.${badSignature}`;
    const result = verifySessionToken(token);
    expect(result).toBeNull();
  });

  it("rechaza token con JSON inválido", () => {
    const result = verifySessionToken(`no-es-json.${validSignature}`);
    expect(result).toBeNull();
  });

  it("rechaza undefined", () => {
    const result = verifySessionToken(undefined);
    expect(result).toBeNull();
  });
});