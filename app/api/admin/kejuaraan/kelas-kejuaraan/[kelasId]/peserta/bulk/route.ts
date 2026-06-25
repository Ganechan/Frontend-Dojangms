import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ kelasId: string }> },
) {
  try {
    const { kelasId } = await params;
    const body = await req.json(); // { user_ids: [1,2,3] }

    const data = await serverFetch(
      `/api/admin/kejuaraan/kelas-kejuaraan/${kelasId}/peserta/bulk`,
      {
        method: "DELETE",
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
    console.error("Error bulk deleting peserta:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
