import { NextRequest, NextResponse } from "next/server";

// Route yang butuh login
const PROTECTED_ROUTES = ["/dashboard"];

// Route yang hanya untuk tamu (belum login)
const AUTH_ROUTES = ["/login", "/register"];

// Route yang butuh role tertentu
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/dashboard/pelatih": ["pelatih", "admin"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;
  const isAuthenticated = Boolean(token);

  // Redirect user yang sudah login dari halaman auth
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Cek protected routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Cek role untuk route tertentu
    // Note: untuk validasi role yang ketat, decode JWT di sini
    // atau gunakan session cookie terpisah yang berisi roles
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo_dojang.png).*)",
  ],
};
