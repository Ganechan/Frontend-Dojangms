// app/api/admin/admins/[id]/route.ts
import { type NextRequest, NextResponse } from "next/server";
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
        { message: "Admin tidak ditemukan" },
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

// ── GET /api/admin/admins/[id] ────────────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (!Number.isFinite(numericId) || numericId < 1)
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });

  try {
    const data = await serverFetch(`/api/admin/get/user/${numericId}`);
    return NextResponse.json(data);
  } catch (err) {
    return handleApiError(err);
  }
}

// ── DELETE /api/admin/admins/[id] — soft delete ───────────────────────────────

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
