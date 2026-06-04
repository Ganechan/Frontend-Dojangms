// app/api/admin/pelatih/[id]/sertifikasi/[sertifikasiId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

function handleApiError(err: unknown) {
  if (err instanceof ApiError) {
    if (err.status === 401)
      return NextResponse.json(
        { message: "Sesi habis, silakan login kembali" },
        { status: 401 },
      );
    if (err.status === 403)
      return NextResponse.json(
        { message: "Anda tidak memiliki akses" },
        { status: 403 },
      );
    if (err.status === 404)
      return NextResponse.json(
        { message: "Sertifikasi tidak ditemukan" },
        { status: 404 },
      );
    if (err.status === 400)
      return NextResponse.json({ message: err.message }, { status: 400 });
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
  return NextResponse.json(
    { message: "Terjadi kesalahan server" },
    { status: 500 },
  );
}

// ── DELETE /api/admin/pelatih/[id]/sertifikasi/[sertifikasiId] ────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; sertifikasiId: string }> },
) {
  const { id, sertifikasiId } = await params;

  try {
    const data = await serverFetch(
      `/api/admin/pelatih/${id}/sertifikasi/${sertifikasiId}`,
      { method: "DELETE" },
    );
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
