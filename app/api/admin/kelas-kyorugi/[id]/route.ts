import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await serverFetch(`/api/admin/kelas-kyorugi/${id}`, {
      method: "GET",
    });
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
      return NextResponse.json(
        { message: err.message },
        { status: err.status },
      );
    }
    console.error("Error fetching kyorugi class detail:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
