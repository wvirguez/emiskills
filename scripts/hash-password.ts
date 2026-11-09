#!/usr/bin/env tsx
/**
 * Genera un hash scrypt para la contraseña de administrador.
 * Uso: npm run admin:hash -- <password>
 *      npm run admin:hash (lee de stdin)
 */

import { scrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

async function main() {
  let password: string;

  if (process.argv[2]) {
    password = process.argv[2];
  } else {
    // Leer de stdin
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    password = Buffer.concat(chunks).toString("utf8").trimEnd();
  }

  if (!password) {
    console.error("Error: contraseña vacía");
    process.exit(1);
  }

  const hashed = await hashPassword(password);
  console.log(hashed);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});