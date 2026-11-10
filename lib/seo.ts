import type { Metadata } from "next";
import { SITE_LOCALE, SITE_NAME } from "@/lib/site";

type BuildMetadataInput = {
  /** Título de la página (la plantilla del layout añade " | EmiSkills"). */
  title: string;
  description: string;
  /** Ruta canónica relativa, p. ej. "/productos/" (resuelta con `metadataBase`). */
  path: string;
  /** Imagen OG absoluta o relativa; si falta, aplica `opengraph-image` del sitio. */
  image?: string | null;
  noindex?: boolean;
};

/** Metadatos comunes: title, description, canonical, Open Graph y Twitter. */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noindex,
}: BuildMetadataInput): Metadata {
  const images = image ? [{ url: image }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title,
      description,
      url: path,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: [image as string] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
