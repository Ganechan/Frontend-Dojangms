// app\api\pelatih\kejuaraan\[id]\peserta\[pesertaId]\route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; pesertaId: string }> }, // perhatikan: id, bukan kejuaraanId
) {
  try {
    const { id: kejuaraanId, pesertaId } = await params; // alias id menjadi kejuaraanId
    const body = await req.json();
    console.log("🔵 Payload to backend:", body);

    const data = await serverFetch(
      `/api/pelatih/kejuaraan/${kejuaraanId}/peserta/${pesertaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      // Coba ambil response body dari error untuk detail
      let errorDetail = err.message;
      if ((err as any).response) {
        try {
          const text = await (err as any).response.text();
          errorDetail = text || errorDetail;
        } catch {}
      }
      console.error("🔴 Backend error:", errorDetail);
      return NextResponse.json(
        { message: `Backend error: ${errorDetail}` },
        { status: err.status },
      );
    }
    console.error("🔴 Error updating peserta hasil:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
