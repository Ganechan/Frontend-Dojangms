import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jadwalId: string }> },
) {
  try {
    const { jadwalId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const tanggal = searchParams.get("tanggal");
    if (!tanggal) {
      return NextResponse.json(
        { success: false, message: "Parameter tanggal wajib diisi" },
        { status: 400 },
      );
    }
    const url = `/api/pelatih/absensi/${jadwalId}?tanggal=${tanggal}`;
    const data = await serverFetch(url, { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error fetching attendance detail:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
