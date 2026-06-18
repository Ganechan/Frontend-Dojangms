import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ jadwalId: string; tanggal: string }> },
) {
  try {
    const { jadwalId, tanggal } = await params;
    const body = await req.json();

    const data = await serverFetch(
      `/api/pelatih/absensi/${jadwalId}/${tanggal}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error updating attendance:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
