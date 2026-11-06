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
