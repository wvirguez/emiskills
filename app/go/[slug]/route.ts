import { NextResponse } from "next/server";
import { getAffiliateTargetBySlug } from "@/lib/products";
import { recordClick } from "@/lib/clicks";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;

  try {
    const target = await getAffiliateTargetBySlug(slug);

    if (!target) {
      return new Response("Producto no disponible", {
        status: 404,
        headers: {
          "X-Robots-Tag": "noindex",
        },
      });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(target.affiliateUrl);
    } catch {
      return new Response("Producto no disponible", {
        status: 404,
        headers: {
          "X-Robots-Tag": "noindex",
        },
      });
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return new Response("Producto no disponible", {
        status: 404,
        headers: {
          "X-Robots-Tag": "noindex",
        },
      });
    }

    try {
      await recordClick({
        productId: target.id,
        referer: request.headers.get("referer"),
      });
    } catch {
      console.error("[go] No se pudo registrar el clic", { slug });
    }

    const redirectResponse = NextResponse.redirect(parsedUrl.toString(), 307);
    redirectResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    redirectResponse.headers.set("Cache-Control", "no-store");
    return redirectResponse;
  } catch {
    // Error genérico de BD: no filtrar detalles, registrar y devolver 404
    console.error("[go] Error al procesar la redirección", { slug });
    return new Response("Producto no disponible", {
      status: 404,
      headers: {
        "X-Robots-Tag": "noindex",
      },
    });
  }
}