import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pesertaId: string }> },
) {
  try {
    const { id: ujianId, pesertaId } = await params;
    const body = await req.json();

    const data = await serverFetch(
      `/api/pelatih/ujian/${ujianId}/peserta/${pesertaId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
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
    console.error("Error updating peserta status:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
