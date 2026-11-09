import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("hashPassword / verifyPassword", () => {
  it("hashPassword genera hash con formato scrypt$<salt>$<hash>", async () => {
    const hash = await hashPassword("mi-clave-secreta");
    expect(hash).toMatch(/^scrypt\$[0-9a-f]+\$[0-9a-f]+$/);
  });

  it("verifyPassword acepta la contraseña correcta", async () => {
    const hash = await hashPassword("mi-clave-secreta");
    const ok = await verifyPassword("mi-clave-secreta", hash);
    expect(ok).toBe(true);
  });

  it("verifyPassword rechaza una contraseña incorrecta", async () => {
    const hash = await hashPassword("mi-clave-secreta");
    const ok = await verifyPassword("otra-clave", hash);
    expect(ok).toBe(false);
  });

  it("verifyPassword rechaza hash mal formado sin lanzar", async () => {
    const ok = await verifyPassword("cualquiera", "no-es-un-hash-valido");
    expect(ok).toBe(false);
  });

  it("verifyPassword rechaza hash con algoritmo incorrecto", async () => {
    const ok = await verifyPassword("cualquiera", "bcrypt$salty$hashy");
    expect(ok).toBe(false);
  });

  it("verifyPassword rechaza hash con partes insuficientes", async () => {
    const ok = await verifyPassword("cualquiera", "scrypt$solo-salt");
    expect(ok).toBe(false);
  });
});