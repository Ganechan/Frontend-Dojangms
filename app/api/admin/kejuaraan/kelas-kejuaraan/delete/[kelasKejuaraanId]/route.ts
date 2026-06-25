import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ kelasKejuaraanId: string }> },
) {
  try {
    const { kelasKejuaraanId } = await params;
    const data = await serverFetch(
      `/api/admin/kejuaraan/kelas-kejuaraan/delete/${kelasKejuaraanId}`,
      { method: "DELETE" },
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
    console.error("Error deleting championship class:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
