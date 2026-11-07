/** Utilidades de presentación de productos (sin acceso a datos). */

export const DEFAULT_GRADIENT = "from-violet-500 to-fuchsia-500";

const LANGUAGE_NAMES: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  pt: "Portugués",
};

export function formatLanguage(code: string): string {
  return LANGUAGE_NAMES[code.toLowerCase()] ?? code.toUpperCase();
}

export function formatPrice(price: number, currency: string): string {
  return `${price.toFixed(2)} ${currency}`;
}

export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}
