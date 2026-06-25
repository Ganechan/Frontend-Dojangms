import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const searchParams = req.nextUrl.searchParams;
    const murid_page = searchParams.get("murid_page") || "1";
    const murid_limit = searchParams.get("murid_limit") || "10";

    const url = `/api/pelatih/kelas/${id}?murid_page=${murid_page}&murid_limit=${murid_limit}`;
    const data = await serverFetch(url, { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error fetching class detail:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
