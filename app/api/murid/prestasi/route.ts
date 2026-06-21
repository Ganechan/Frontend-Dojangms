import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";
    const tahun = searchParams.get("tahun") || "";
    const level = searchParams.get("level") || "";
    const hasil = searchParams.get("hasil") || "";

    let url = `/api/murid/prestasi?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (tahun) url += `&tahun=${encodeURIComponent(tahun)}`;
    if (level) url += `&level=${encodeURIComponent(level)}`;
    if (hasil) url += `&hasil=${encodeURIComponent(hasil)}`;

    const data = await serverFetch(url, { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error fetching prestasi:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
