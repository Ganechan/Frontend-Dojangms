import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "25";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "active";
    const search = searchParams.get("search") || "";

    let url = `/api/admin/get/user?page=${page}&limit=${limit}&status=${status}`;
    if (role) url += `&role=${role}`;
    if (search) url += `&search=${search}`;

    const data = await serverFetch(url, { method: "GET" });
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
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
