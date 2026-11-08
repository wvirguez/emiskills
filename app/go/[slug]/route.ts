import { NextResponse } from "next/server";
import { getAffiliateUrlBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;

  try {
    const affiliateUrl = await getAffiliateUrlBySlug(slug);

    if (!affiliateUrl) {
      return new Response("Producto no disponible", {
        status: 404,
        headers: {
          "X-Robots-Tag": "noindex",
        },
      });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(affiliateUrl);
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