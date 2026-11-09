import { createHmac, timingSafeEqual } from "node:crypto";
import { getAdminEnv } from "@/lib/env";

export const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 horas

export interface SessionPayload {
  sub: "admin";
  exp: number;
}

/** Firma un payload con HMAC-SHA256 usando SESSION_SECRET. */
export function sign(payload: SessionPayload): string {
  const { SESSION_SECRET } = getAdminEnv();
  const data = JSON.stringify(payload);
  const signature = createHmac("sha256", SESSION_SECRET).update(data).digest("hex");
  return `${data}.${signature}`;
}

/** Verifica la firma y expiración de un token de sesión. */
export function verifySessionToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;

  const [dataPart, signature] = token.split(".");
  if (!dataPart || !signature) return null;

  const { SESSION_SECRET } = getAdminEnv();
  const expectedSignature = createHmac("sha256", SESSION_SECRET).update(dataPart).digest("hex");

  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");

  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(dataPart);
  } catch {
    return null;
  }

  if (typeof payload.sub !== "string" || typeof payload.exp !== "number") return null;
  if (payload.sub !== "admin") return null;
  if (Date.now() >= payload.exp) return null;

  return payload;
}