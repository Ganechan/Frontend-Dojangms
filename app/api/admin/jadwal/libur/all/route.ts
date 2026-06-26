import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const tanggal_start = searchParams.get("tanggal_start") || "";
    const tanggal_end = searchParams.get("tanggal_end") || "";

    let url = `/api/admin/jadwal/libur/all?page=${page}&limit=${limit}`;
    if (tanggal_start)
      url += `&tanggal_start=${encodeURIComponent(tanggal_start)}`;
    if (tanggal_end) url += `&tanggal_end=${encodeURIComponent(tanggal_end)}`;

    const data = await serverFetch(url, { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        return NextResponse.json(
          { message: "Sesi habis, silakan login kembali" },
          { status: 401 },
        );
      }
      if (err.status === 403) {
        return NextResponse.json(
          { message: "Anda tidak memiliki akses" },
          { status: 403 },
        );
      }
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error fetching holiday schedule:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
