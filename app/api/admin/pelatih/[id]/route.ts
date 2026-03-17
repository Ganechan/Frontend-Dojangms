import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // validasi id harus angka positif
    const numericId = parseInt(id, 10);
    if (!Number.isFinite(numericId) || numericId < 1) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const data = await serverFetch(`/api/admin/get/user/pelatih/${numericId}`);
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        return NextResponse.json(
          { message: "Sesi habis, silakan login kembali" },
          { status: 401 },
        );
      }
      if (err.status === 403) {
        return NextResponse.json(
          { message: "Anda tidak memiliki akses" },
          { status: 403 },
        );
      }
      if (err.status === 404) {
        return NextResponse.json(
          { message: "Pelatih tidak ditemukan" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
