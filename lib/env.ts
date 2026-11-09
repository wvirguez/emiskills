import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z
    .string({ error: "DATABASE_URL es obligatoria (ver .env.example)" })
    .min(1, "DATABASE_URL no puede estar vacía")
    .refine((v) => /^mysql:\/\//.test(v), {
      message: "DATABASE_URL debe empezar por mysql://",
    }),
});

export type Env = z.infer<typeof envSchema>;

/** Valida las variables de entorno; lanza un error claro si son inválidas. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "env"}: ${i.message}`)
      .join("\n");
    throw new Error(`Variables de entorno inválidas:\n${details}`);
  }
  return result.data;
}

let cached: Env | undefined;

/** Variables validadas (lazy, para no fallar durante el build sin .env). */
export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}

/** Esquema específico para variables de administrador. */
const adminEnvSchema = z.object({
  ADMIN_EMAIL: z
    .string({ error: "ADMIN_EMAIL es obligatoria" })
    .email("ADMIN_EMAIL debe ser un email válido"),
  ADMIN_PASSWORD_HASH: z
    .string({ error: "ADMIN_PASSWORD_HASH es obligatoria" })
    .regex(/^scrypt\$[0-9a-f]+\$[0-9a-f]+$/, {
      message:
        "ADMIN_PASSWORD_HASH debe tener formato scrypt$<salt hex>$<hash hex>",
    }),
  SESSION_SECRET: z
    .string({ error: "SESSION_SECRET es obligatoria" })
    .min(32, "SESSION_SECRET debe tener al menos 32 caracteres"),
});

export type AdminEnv = z.infer<typeof adminEnvSchema>;

/** Valida las variables de entorno de administrador. */
export function parseAdminEnv(
  source: Record<string, string | undefined>
): AdminEnv {
  const result = adminEnvSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "env"}: ${i.message}`)
      .join("\n");
    throw new Error(`Variables de entorno de administrador inválidas:\n${details}`);
  }
  return result.data;
}

let adminCached: AdminEnv | undefined;

/**
 * Variables de administrador validadas (lazy).
 * Separada de getEnv() para que el catálogo público no dependa de estas variables.
 */
export function getAdminEnv(): AdminEnv {
  adminCached ??= parseAdminEnv(process.env);
  return adminCached;
}