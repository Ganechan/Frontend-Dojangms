import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pesertaId: string }> },
) {
  try {
    const { id: kejuaraanId, pesertaId } = await params;
    const body = await req.json();

    const data = await serverFetch(
      `/api/pelatih/ujian/${kejuaraanId}/peserta/${pesertaId}/edit`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      let errorDetail = err.message;
      if ((err as any).response) {
        try {
          const text = await (err as any).response.text();
          errorDetail = text || errorDetail;
        } catch {}
      }
      return NextResponse.json(
        { message: `Backend error: ${errorDetail}` },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
