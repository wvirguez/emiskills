import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/** Genera un hash scrypt con salt aleatorio. Formato: scrypt$<salt-hex>$<hash-hex> */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

/** Verifica una contraseña contra su hash scrypt en tiempo constante. */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const parts = hash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") {
    return false;
  }

  const [, saltHex, hashHex] = parts;
  const salt = Buffer.from(saltHex, "hex");
  const expectedHash = Buffer.from(hashHex, "hex");

  const derivedHash = (await scryptAsync(password, salt, 64)) as Buffer;

  if (derivedHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(derivedHash, expectedHash);
}