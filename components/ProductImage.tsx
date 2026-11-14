/**
 * Imagen del producto sobre el degradado (que queda como fondo/fallback).
 * Es decorativa: el título del producto ya describe la tarjeta.
 * Se usa <img> (no next/image) porque `images.unoptimized` está activo.
 */
export default function ProductImage({
  src,
  fit = "cover",
}: {
  src: string | null;
  fit?: "cover" | "contain";
}) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
    />
  );
}
