import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    const data = await serverFetch(`/api/admin/kelas/${id}/pelatih?page=${page}&limit=${limit}`, {
      method: "GET",
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) return NextResponse.json({ message: "Sesi habis" }, { status: 401 });
      if (err.status === 403) return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}