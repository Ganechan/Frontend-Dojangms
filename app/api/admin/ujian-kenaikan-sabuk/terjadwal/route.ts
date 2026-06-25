// app/api/admin/ujian-kenaikan-sabuk/terjadwal/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  try {
    const data = await serverFetch(
      "/api/admin/ujian-kenaikan-sabuk/terjadwal",
      {
        method: "GET",
      },
    );
    // Pastikan data selalu ada, minimal object kosong
    return NextResponse.json(data || {});
  } catch (err) {
    console.error("Error in /terjadwal route:", err);
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
