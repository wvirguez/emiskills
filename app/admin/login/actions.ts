"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";
import { checkLoginAttempt, registerFailure, resetAttempts } from "@/lib/auth/rate-limit";
import { getAdminEnv } from "@/lib/env";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export type LoginState = { error?: string; success?: boolean };

export async function login(prevState: LoginState | undefined, formData: FormData): Promise<LoginState> {
  const validated = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: "Credenciales incorrectas." };
  }

  const { email, password } = validated.data;
  const forwardedFor = (await headers()).get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";

  const rateLimit = checkLoginAttempt(ip);
  if (rateLimit.blocked) {
    return { error: "Demasiados intentos. Inténtalo más tarde." };
  }

  const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH } = getAdminEnv();

  if (email !== ADMIN_EMAIL) {
    registerFailure(ip);
    return { error: "Credenciales incorrectas." };
  }

  const passwordOk = await verifyPassword(password, ADMIN_PASSWORD_HASH);
  if (!passwordOk) {
    registerFailure(ip);
    return { error: "Credenciales incorrectas." };
  }

  resetAttempts(ip);
  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect("/admin/login");
}