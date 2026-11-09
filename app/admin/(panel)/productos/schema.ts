import { z } from "zod";
import { isValidCurrency, isValidLanguage, isValidGradient } from "@/lib/product-options";

const MAX_PRICE = 99_999_999.99;
const MAX_DECIMALS = 2;
const MAX_URL_LENGTH = 500;

/** Normaliza un string de precio (acepta coma o punto) a number. */
function normalizePrice(value: string): number {
  const normalized = value.trim().replace(",", ".");
  const parsed = Number(normalized);
  return parsed;
}

/** Valida que un string tenga máximo N decimales. */
function hasMaxDecimals(value: number, maxDecimals: number): boolean {
  const decimalPart = value.toString().split(".")[1];
  return !decimalPart || decimalPart.length <= maxDecimals;
}

/** Valida que una URL sea https y no exceda la longitud máxima. */
function validateHttpsUrl(url: string, maxLength: number): string | null {
  if (!url || url.trim() === "") return null;
  const trimmed = url.trim();
  if (trimmed.length > maxLength) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return null;
    return trimmed;
  } catch {
    return null;
  }
}

export const productSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),

  shortDescription: z
    .string()
    .trim()
    .min(10, "La descripción corta debe tener al menos 10 caracteres")
    .max(300, "La descripción corta no puede exceder 300 caracteres"),

  description: z
    .string()
    .max(5000, "La descripción no puede exceder 5000 caracteres")
    .optional()
    .transform((val) => (val?.trim() === "" ? null : val?.trim() ?? null))
    .nullable(),

  price: z
    .string()
    .refine((val) => val.trim() !== "", "El precio es requerido")
    .transform(normalizePrice)
    .refine((val) => !Number.isNaN(val), "El precio debe ser un número válido")
    .refine((val) => val >= 0, "El precio no puede ser negativo")
    .refine((val) => val <= MAX_PRICE, `El precio no puede exceder ${MAX_PRICE.toLocaleString("es-ES")}`)
    .refine((val) => hasMaxDecimals(val, MAX_DECIMALS), `El precio no puede tener más de ${MAX_DECIMALS} decimales`),

  currency: z
    .string()
    .refine(isValidCurrency, "Moneda inválida"),

  language: z
    .string()
    .refine(isValidLanguage, "Idioma inválido"),

  imageUrl: z
    .string()
    .optional()
    .transform((val) => validateHttpsUrl(val ?? "", MAX_URL_LENGTH))
    .nullable(),

  imageGradient: z
    .string()
    .optional()
    .transform((val) => {
      const trimmed = val?.trim() ?? "";
      if (trimmed === "") return null;
      return trimmed;
    })
    .refine((val) => val === null || isValidGradient(val), "Degradado inválido")
    .nullable(),

  affiliateUrl: z
    .string()
    .refine((val) => val.trim() !== "", "La URL de afiliado es requerida")
    .transform((val) => validateHttpsUrl(val.trim(), MAX_URL_LENGTH))
    .refine((val) => val !== null, "La URL de afiliado debe ser una URL https válida (máx. 500 caracteres)"),

  categoryId: z
    .coerce.number()
    .int("El ID de categoría debe ser un entero")
    .positive("El ID de categoría debe ser positivo"),

  platformId: z
    .coerce.number()
    .int("El ID de plataforma debe ser un entero")
    .positive("El ID de plataforma debe ser positivo"),

  isActive: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductFormData = z.input<typeof productSchema>;