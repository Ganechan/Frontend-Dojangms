import { NextRequest, NextResponse } from "next/server";
import { LoginPayload, LoginResponse } from "@/types/auth";

const BACKEND_URL = process.env.BACKEND_URL; // Server-side only, TIDAK pakai NEXT_PUBLIC

export async function POST(req: NextRequest) {
  try {
    const body: LoginPayload = await req.json();

    // Validasi input dasar di server
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
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

    // Forward request ke backend
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data: LoginResponse = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || "Login gagal" },
        { status: backendRes.status },
      );
    }

    const { token, user } = data.data;

    // Buat response dengan data user (tanpa token)
    const response = NextResponse.json(
      { message: "Login berhasil", user },
      { status: 200 },
    );

    // Simpan token di httpOnly cookie — TIDAK bisa diakses JavaScript
    response.cookies.set("auth_token", token, {
      httpOnly: true, // Tidak bisa diakses via document.cookie
      secure: process.env.NODE_ENV === "production", // HTTPS only di production
      sameSite: "strict", // Proteksi CSRF
      path: "/",
      maxAge: 60 * 60 * 24, // 24 jam (sesuaikan dengan exp token)
    });

    return response;
  } catch (error) {
    console.error("[Auth Login Error]:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan, silakan coba lagi" },
      { status: 500 },
    );
  }
}
