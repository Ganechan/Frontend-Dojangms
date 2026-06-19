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
    const start_date = searchParams.get("start_date") || "";
    const end_date = searchParams.get("end_date") || "";

    let url = `/api/pelatih/riwayat-absensi/kelas/${id}`;
    if (start_date) url += `?start_date=${start_date}`;
    if (end_date) url += `${start_date ? "&" : "?"}end_date=${end_date}`;

    const data = await serverFetch(url, { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error fetching class attendance recap:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
