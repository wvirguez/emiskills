import { getSiteEnv } from "@/lib/env";

export const SITE_NAME = "EmiSkills";
export const SITE_LOCALE = "es_LA";
export const SITE_DEFAULT_TITLE = "EmiSkills - Hub de Productos Digitales";
export const SITE_DEFAULT_DESCRIPTION =
  "Encuentra cursos, ebooks, plantillas y membresías de varios productores en un solo catálogo. Curaduría honesta: somos afiliados y la compra se hace en la plataforma del productor.";

/**
 * URL absoluta para una ruta del sitio. Respeta `trailingSlash: true`:
 * "/productos" → "<SITE_URL>/productos/"; "/" → "<SITE_URL>/".
 */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  const withSlash = clean.endsWith("/") ? clean : `${clean}/`;
  return `${getSiteEnv().SITE_URL}${withSlash}`;
}
