import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar si la ruta comienza con /admin
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin-session")
    
    // Si es una solicitud a la API de autenticación, permitir
    if (request.nextUrl.pathname.startsWith("/admin/api/auth")) {
      return NextResponse.next()
    }

    // Si no hay sesión y no es la página de login, redirigir al login
    if (!adminSession?.value) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"]
}
