import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; kelasId: string }> },
) {
  try {
    const { id, kelasId } = await params;
    const body = await req.json();

    const data = await serverFetch(
      `/api/admin/kejuaraan/${id}/kelas-kejuaraan/${kelasId}/peserta/bulk`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401)
        return NextResponse.json({ message: "Sesi habis" }, { status: 401 });
      if (err.status === 403)
        return NextResponse.json({ message: "Akses ditolak" }, { status: 403 });
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error bulk adding participants:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
