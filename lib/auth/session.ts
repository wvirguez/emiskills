"use server";

import { cookies } from "next/headers";
import { cache } from "react";
import { sign, verifySessionToken, type SessionPayload, SESSION_DURATION_MS } from "./session-token";

const COOKIE_NAME = "admin_session";

/** Crea la cookie de sesión firmada. */
export async function createSession(): Promise<void> {
  const exp = Date.now() + SESSION_DURATION_MS;
  const payload: SessionPayload = { sub: "admin", exp };
  const token = sign(payload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(exp),
  });
}

/** Elimina la cookie de sesión. */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Verifica la sesión actual (DAL, cacheada por request). */
export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
});