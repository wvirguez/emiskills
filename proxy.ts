import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth/session-token";

export const config = {
  matcher: ["/admin/:path*"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso a /admin/login sin sesión
  if (pathname === "/admin/login") {
    const token = request.cookies.get("admin_session")?.value;
    const session = verifySessionToken(token);

    // Si ya hay sesión válida, redirigir al panel
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Sin sesión, permitir acceso a la página de login
    return NextResponse.next();
  }

  // Para todas las demás rutas /admin/*, verificar sesión
  const token = request.cookies.get("admin_session")?.value;
  const session = verifySessionToken(token);

  if (!session) {
    // Sin sesión válida, redirigir a login
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sesión válida, continuar
  return NextResponse.next();
}