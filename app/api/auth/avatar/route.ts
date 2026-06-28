// app/api/auth/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const path = searchParams.get("path");
  if (!path) {
    return new NextResponse("Missing path parameter", { status: 400 });
  }

  try {
    // Ambil token dari cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.warn("🟡 No auth token found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch langsung ke backend untuk binary image
    const response = await fetch(`${BACKEND_URL}/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.log("🔴 Backend returned error:", response.status);
      return new NextResponse("Not found", { status: 404 });
    }

    const buffer = await response.arrayBuffer();

    // Tentukan content-type berdasarkan ekstensi file
    const ext = path.split(".").pop()?.toLowerCase();
    const contentType =
      ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "png"
          ? "image/png"
          : ext === "gif"
            ? "image/gif"
            : ext === "webp"
              ? "image/webp"
              : "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // cache 1 hari
      },
    });
  } catch (err) {
    console.error("🔴 Error fetching avatar:", err);
    return new NextResponse("Avatar not found", { status: 404 });
  }
}
