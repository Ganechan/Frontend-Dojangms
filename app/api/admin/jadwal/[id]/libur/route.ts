// app/api/admin/jadwal/[id]/libur/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    const data = await serverFetch<{ message: string }>(
      `/api/admin/jadwal/${id}/libur`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Add Libur Jadwal API Error]:", err);

    const status = err?.status ?? 500;
    const message = err?.message ?? "Terjadi kesalahan internal server";

    return NextResponse.json({ message }, { status });
  }
}
