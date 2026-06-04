// app/api/admin/pelatih/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

type Params = { params: Promise<{ id: string }> };

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

// ── GET /api/admin/pelatih/[id] ───────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (!Number.isFinite(numericId) || numericId < 1)
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });

  try {
    const data = await serverFetch(`/api/admin/get/user/pelatih/${numericId}`);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// ── PATCH /api/admin/pelatih/[id] — update profil/sabuk/spesialisasi/sertifikasi

export async function PATCH(req: NextRequest, { params }: Params) {
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
    const data = await serverFetch(`/api/admin/update/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// ── DELETE /api/admin/pelatih/[id] — soft delete ──────────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    const data = await serverFetch(`/api/admin/softdelete/user/${id}`, {
      method: "PATCH",
    });
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}
