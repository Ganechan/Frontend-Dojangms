import { NextRequest, NextResponse } from "next/server";
import { RegisterPayload, RegisterResponse } from "@/types/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    const body: RegisterPayload = await req.json();

    // Validasi input dasar di server
    const { name, email, password, phone, tanggal_lahir } = body;
    if (!name || !email || !password || !phone || !tanggal_lahir) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password minimal 8 karakter" },
        { status: 400 },
      );
    }

    if (!BACKEND_URL) {
      console.error("BACKEND_URL environment variable is not set");
      return NextResponse.json(
        { message: "Konfigurasi server bermasalah" },
        { status: 500 },
      );
    }

    let backendRes: Response;
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (fetchError) {
      console.error("[Auth Register] Cannot reach backend:", fetchError);
      return NextResponse.json(
        {
          message:
            "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.",
        },
        { status: 503 },
      );
    }

    const contentType = backendRes.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const rawText = await backendRes.text();
      console.error("[Auth Register] Backend returned non-JSON response:", {
        status: backendRes.status,
        contentType,
        body: rawText.slice(0, 200),
      });
      return NextResponse.json(
        { message: "Respons tidak valid dari server backend." },
        { status: 502 },
      );
    }

    const data: RegisterResponse = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || "Pendaftaran gagal" },
        { status: backendRes.status },
      );
    }

    return NextResponse.json({ message: data.message }, { status: 201 });
  } catch (error) {
    console.error("[Auth Register Error]:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan, silakan coba lagi" },
      { status: 500 },
    );
  }
}
