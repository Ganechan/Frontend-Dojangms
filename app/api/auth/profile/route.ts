// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

// GET handler (ambil profile)
export async function GET(req: NextRequest) {
  try {
    // Bisa gunakan serverFetch atau fetch langsung
    const data = await serverFetch("/api/auth/profile", { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

// PUT handler (update profile dengan foto)
export async function PUT(req: NextRequest) {
  try {
    // Ambil token dari cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token found" },
        { status: 401 },
      );
    }

    // Baca FormData dari request (mengandung file dan text fields)
    const formData = await req.formData();

    // Kirim FormData ke backend (tanpa Content-Type, biar fetch yang set boundary)
    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type; fetch akan set boundary otomatis untuk FormData
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      // Jika backend mengirim validasi error, kita teruskan
      return NextResponse.json(
        {
          message: data.message || "Gagal memperbarui profil",
          errors: data.errors,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
