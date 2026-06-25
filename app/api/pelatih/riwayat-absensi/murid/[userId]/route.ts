// app/api/pelatih/riwayat-absensi/murid/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const jadwalId = searchParams.get("jadwalId") || "";
    const limit = searchParams.get("limit") || "20";

    let url = `/api/pelatih/riwayat-absensi/murid/${userId}?limit=${limit}`;
    if (jadwalId) url += `&jadwalId=${jadwalId}`;

    const data = await serverFetch(url, { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error fetching murid attendance history:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
