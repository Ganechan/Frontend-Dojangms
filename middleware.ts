// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTPayload } from "jose";

// Route yang hanya untuk tamu (belum login)
const AUTH_ROUTES = ["/login", "/register"];

/**
 * Peta route → role yang diizinkan (strict).
 * Setiap role HANYA bisa akses route miliknya sendiri.
 * Admin TIDAK bisa akses /murid, murid TIDAK bisa akses /pelatih, dst.
 *
 * Kalau ingin admin bisa akses semua, ubah jadi:
 *   "/murid": ["murid", "admin"]
 */
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/pelatih": ["pelatih"],
  "/murid": ["murid"],
};

// ─── JWT verification dengan jose ────────────────────────────────────────────

interface AppJwtPayload extends JWTPayload {
  id: number;
  email: string;
  roles: string[];
}

async function verifyJwt(token: string): Promise<AppJwtPayload | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as AppJwtPayload;
  } catch {
    // Token invalid, expired, atau signature tidak cocok
    return null;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;

  // 1. Halaman auth (login/register) — redirect ke home jika sudah login
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!token) return NextResponse.next();

    const payload = await verifyJwt(token);
    if (!payload) return NextResponse.next();

    return NextResponse.redirect(
      new URL(getDefaultRoute(payload.roles), req.url),
    );
  }

  // 2. Cek apakah route ini butuh role tertentu
  const requiredRoles = getRequiredRoles(pathname);
  if (!requiredRoles) return NextResponse.next(); // Route publik, bebas akses

  // 3. Belum login sama sekali
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Verifikasi token (signature + expiry) dengan jose
  const payload = await verifyJwt(token);

  // Token invalid atau expired → paksa login ulang
  if (!payload) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
    return response;
  }

  // 5. Cek apakah user punya role yang diperlukan
  const hasAccess = requiredRoles.some((role) => payload.roles.includes(role));
  if (!hasAccess) {
    // Tolak akses → redirect ke halaman default sesuai role user
    return NextResponse.redirect(
      new URL(getDefaultRoute(payload.roles), req.url),
    );
  }

  return NextResponse.next();
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function getRequiredRoles(pathname: string): string[] | null {
  for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) return roles;
  }
  return null;
}

/**
 * Halaman default setelah login / setelah akses ditolak.
 * User dengan multi-role diarahkan ke role tertinggi yang dimiliki.
 */
function getDefaultRoute(roles: string[]): string {
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("pelatih")) return "/pelatih";
  if (roles.includes("murid")) return "/murid";
  return "/";
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|logo_dojang.png).*)",
  ],
};
