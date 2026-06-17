import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "10";
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    let url = `/api/admin/pengumuman?page=${page}&per_page=${per_page}`;
    if (status) url += `&status=${status}`;
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
    console.error("Error fetching announcements:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await serverFetch("/api/admin/pengumuman", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}