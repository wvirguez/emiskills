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

/** Esquema de variables de Hotmart (opcionales para la web; obligatorias para el cliente de la API). */
const hotmartEnvSchema = z.object({
  HOTMART_CLIENT_ID: z
    .string({ error: "HOTMART_CLIENT_ID es obligatoria" })
    .min(1, "HOTMART_CLIENT_ID no puede estar vacía"),
  HOTMART_CLIENT_SECRET: z
    .string({ error: "HOTMART_CLIENT_SECRET es obligatoria" })
    .min(1, "HOTMART_CLIENT_SECRET no puede estar vacía"),
  HOTMART_BASIC_TOKEN: z
    .string({ error: "HOTMART_BASIC_TOKEN es obligatoria" })
    .min(1, "HOTMART_BASIC_TOKEN no puede estar vacía"),
  HOTMART_ENV: z
    .enum(["sandbox", "production"], {
      error: "HOTMART_ENV debe ser 'sandbox' o 'production'",
    })
    .default("sandbox"),
});

export type HotmartEnv = z.infer<typeof hotmartEnvSchema>;

/** Valida las variables de Hotmart; los mensajes nunca incluyen los valores. */
export function parseHotmartEnv(
  source: Record<string, string | undefined>
): HotmartEnv {
  const result = hotmartEnvSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `  - ${i.path.join(".") || "env"}: ${i.message}`)
      .join("\n");
    throw new Error(`Variables de entorno de Hotmart inválidas:\n${details}`);
  }
  return result.data;
}

let hotmartCached: HotmartEnv | undefined;

/** Variables de Hotmart validadas (lazy): solo fallan cuando se usa el cliente. */
export function getHotmartEnv(): HotmartEnv {
  hotmartCached ??= parseHotmartEnv(process.env);
  return hotmartCached;
}

/** Esquema del token del webhook de Hotmart (hottok); independiente de las credenciales de la API. */
const hotmartWebhookEnvSchema = z.object({
  HOTMART_HOTTOK: z
    .string({ error: "HOTMART_HOTTOK es obligatoria" })
    .min(1, "HOTMART_HOTTOK no puede estar vacía"),
});

export type HotmartWebhookEnv = z.infer<typeof hotmartWebhookEnvSchema>;

/** Valida el hottok del webhook; los mensajes nunca incluyen el valor. */
export function parseHotmartWebhookEnv(
  source: Record<string, string | undefined>
): HotmartWebhookEnv {
  const result = hotmartWebhookEnvSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Variables de entorno del webhook de Hotmart inválidas:\n${details}`);
  }
  return result.data;
}

/** Hottok validado (lazy, sin caché para reflejar cambios de entorno): solo falla al usar el webhook. */
export function getHotmartWebhookEnv(): HotmartWebhookEnv {
  return parseHotmartWebhookEnv(process.env);
}
