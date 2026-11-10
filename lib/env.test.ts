import { describe, expect, it } from "vitest";
import { parseEnv, parseAdminEnv, parseHotmartEnv } from "@/lib/env";

describe("parseEnv", () => {
  it("acepta una DATABASE_URL de MySQL válida", () => {
    const env = parseEnv({ DATABASE_URL: "mysql://u:p@localhost:3306/emiskills" });
    expect(env.DATABASE_URL).toContain("mysql://");
  });

  it("falla con mensaje claro si falta DATABASE_URL", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it("falla si no es una URL mysql://", () => {
    expect(() => parseEnv({ DATABASE_URL: "postgres://x" })).toThrow(/mysql:\/\//);
  });
});

describe("parseAdminEnv", () => {
  const validAdminEnv = {
    ADMIN_EMAIL: "admin@example.com",
    ADMIN_PASSWORD_HASH: "scrypt$abcdef123456$fedcba654321",
    SESSION_SECRET: "a".repeat(32),
  };

  it("acepta variables de administrador válidas", () => {
    const env = parseAdminEnv(validAdminEnv);
    expect(env.ADMIN_EMAIL).toBe("admin@example.com");
    expect(env.ADMIN_PASSWORD_HASH).toBe(validAdminEnv.ADMIN_PASSWORD_HASH);
    expect(env.SESSION_SECRET).toBe(validAdminEnv.SESSION_SECRET);
  });

  it("falla si falta ADMIN_EMAIL", () => {
    expect(() => parseAdminEnv({ ...validAdminEnv, ADMIN_EMAIL: undefined })).toThrow(
      /ADMIN_EMAIL es obligatoria/
    );
  });

  it("falla si ADMIN_EMAIL no es un email válido", () => {
    expect(() =>
      parseAdminEnv({ ...validAdminEnv, ADMIN_EMAIL: "no-es-email" })
    ).toThrow(/ADMIN_EMAIL debe ser un email válido/);
  });

  it("falla si falta ADMIN_PASSWORD_HASH", () => {
    expect(() =>
      parseAdminEnv({ ...validAdminEnv, ADMIN_PASSWORD_HASH: undefined })
    ).toThrow(/ADMIN_PASSWORD_HASH es obligatoria/);
  });

  it("falla si ADMIN_PASSWORD_HASH no tiene formato scrypt válido", () => {
    expect(() =>
      parseAdminEnv({ ...validAdminEnv, ADMIN_PASSWORD_HASH: "bcrypt$hash" })
    ).toThrow(/scrypt\$\<salt hex\>\$\<hash hex\>/);
  });

  it("falla si ADMIN_PASSWORD_HASH tiene formato incorrecto (falta salt)", () => {
    expect(() =>
      parseAdminEnv({ ...validAdminEnv, ADMIN_PASSWORD_HASH: "scrypt$hash" })
    ).toThrow(/scrypt\$\<salt hex\>\$\<hash hex\>/);
  });

  it("falla si falta SESSION_SECRET", () => {
    expect(() =>
      parseAdminEnv({ ...validAdminEnv, SESSION_SECRET: undefined })
    ).toThrow(/SESSION_SECRET es obligatoria/);
  });

  it("falla si SESSION_SECRET tiene menos de 32 caracteres", () => {
    expect(() =>
      parseAdminEnv({ ...validAdminEnv, SESSION_SECRET: "a".repeat(31) })
    ).toThrow(/SESSION_SECRET debe tener al menos 32 caracteres/);
  });

  it("acepta SESSION_SECRET de exactamente 32 caracteres", () => {
    const env = parseAdminEnv({ ...validAdminEnv, SESSION_SECRET: "a".repeat(32) });
    expect(env.SESSION_SECRET).toHaveLength(32);
  });
});

describe("parseHotmartEnv", () => {
  const valid = {
    HOTMART_CLIENT_ID: "id-123",
    HOTMART_CLIENT_SECRET: "secreto-xyz",
    HOTMART_BASIC_TOKEN: "basic-abc",
  };

  it("acepta variables válidas y usa sandbox por defecto", () => {
    expect(parseHotmartEnv(valid).HOTMART_ENV).toBe("sandbox");
  });

  it("acepta production", () => {
    expect(parseHotmartEnv({ ...valid, HOTMART_ENV: "production" }).HOTMART_ENV).toBe("production");
  });

  it.each(["HOTMART_CLIENT_ID", "HOTMART_CLIENT_SECRET", "HOTMART_BASIC_TOKEN"])(
    "falla si falta %s",
    (key) => {
      const source: Record<string, string | undefined> = { ...valid };
      delete source[key];
      expect(() => parseHotmartEnv(source)).toThrow(key);
    }
  );

  it("rechaza HOTMART_ENV inválido", () => {
    expect(() => parseHotmartEnv({ ...valid, HOTMART_ENV: "staging" })).toThrow("HOTMART_ENV");
  });

  it("el mensaje de error no contiene los valores", () => {
    try {
      parseHotmartEnv({ ...valid, HOTMART_ENV: "staging", HOTMART_BASIC_TOKEN: "" });
      throw new Error("debía fallar");
    } catch (e) {
      const msg = (e as Error).message;
      expect(msg).not.toContain("secreto-xyz");
      expect(msg).not.toContain("id-123");
    }
  });
});
