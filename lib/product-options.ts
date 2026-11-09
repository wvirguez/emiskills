/** Opciones tipadas para productos (monedas, idiomas, degradados). */

export const CURRENCIES = [
  "USD",
  "EUR",
  "MXN",
  "COP",
  "ARS",
  "CLP",
  "PEN",
  "BRL",
] as const;

export type Currency = (typeof CURRENCIES)[number];

export const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "Inglés" },
  { code: "pt", label: "Portugués" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const GRADIENT_PRESETS = [
  { value: "from-violet-500 to-fuchsia-500", label: "Violeta → Fucsia" },
  { value: "from-blue-500 to-cyan-500", label: "Azul → Cian" },
  { value: "from-emerald-500 to-teal-500", label: "Esmeralda → Turquesa" },
  { value: "from-amber-500 to-orange-500", label: "Ámbar → Naranja" },
  { value: "from-rose-500 to-pink-500", label: "Rosa → Rosado" },
  { value: "from-indigo-500 to-purple-500", label: "Índigo → Púrpura" },
  { value: "from-sky-500 to-blue-500", label: "Cielo → Azul" },
  { value: "from-lime-500 to-green-500", label: "Lima → Verde" },
  { value: "from-red-500 to-rose-500", label: "Rojo → Rosado" },
  { value: "from-orange-500 to-amber-500", label: "Naranja → Ámbar" },
] as const;

export type GradientPresetValue = (typeof GRADIENT_PRESETS)[number]["value"];

export function isValidCurrency(code: string): code is Currency {
  return CURRENCIES.includes(code as Currency);
}

export function isValidLanguage(code: string): code is LanguageCode {
  return LANGUAGES.some((l) => l.code === code);
}

export function isValidGradient(value: string): value is GradientPresetValue {
  return GRADIENT_PRESETS.some((g) => g.value === value);
}

export function getDefaultGradient(): GradientPresetValue {
  return GRADIENT_PRESETS[0].value;
}