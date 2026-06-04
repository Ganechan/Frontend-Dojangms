// app/api/admin/pelatih/[id]/sertifikasi/route.ts
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
        { message: "Data tidak ditemukan" },
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

// ── POST /api/admin/pelatih/[id]/sertifikasi — tambah sertifikasi ─────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Request body tidak valid" },
      { status: 400 },
    );
  }

  try {
    const data = await serverFetch(`/api/admin/pelatih/${id}/sertifikasi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
