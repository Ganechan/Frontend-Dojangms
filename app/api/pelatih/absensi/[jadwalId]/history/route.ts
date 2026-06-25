// app\api\pelatih\absensi\[jadwalId]\history\route.ts
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
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const filter = searchParams.get("filter") || "";

    let url = `/api/pelatih/absensi/history/${jadwalId}?page=${page}&limit=${limit}`;
    if (filter) url += `&filter=${filter}`;

    const data = await serverFetch(url, { method: "GET" });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error fetching attendance history:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
