/**
 * Utilidad para generar slugs a partir de nombres.
 * Solo usa caracteres ASCII: a-z, 0-9 y guion.
 */

export function slugify(name: string): string {
  // Normalizar NFD y eliminar diacríticos (tildes, etc.)
  let slug = name.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  // Reemplazar ñ por n
  slug = slug.replace(/ñ/g, "n").replace(/Ñ/g, "n");
  // Convertir a minúsculas
  slug = slug.toLowerCase();
  // Reemplazar cualquier carácter que no sea a-z, 0-9 por guion
  slug = slug.replace(/[^a-z0-9]+/g, "-");
  // Colapsar guiones repetidos
  slug = slug.replace(/-+/g, "-");
  // Recortar guiones de los extremos
  slug = slug.replace(/^-+|-+$/g, "");
  // Máximo 50 caracteres
  if (slug.length > 50) {
    slug = slug.slice(0, 50).replace(/-+$/, "");
  }
  return slug;
}