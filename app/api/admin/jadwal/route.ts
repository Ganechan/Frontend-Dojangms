// app/api/admin/jadwal/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import type { ScheduleApiResponse } from "@/types/admin/jadwal";

export async function GET(req: NextRequest) {
  try {
    const { search } = new URL(req.url);

    const data = await serverFetch<ScheduleApiResponse>(
      `/api/admin/jadwal${search}`,
      { method: "GET" },
    );

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Get Jadwal API Error]:", err);

    const status = err?.status ?? 500;
    const message = err?.message ?? "Terjadi kesalahan internal server";

    return NextResponse.json({ message }, { status });
  }
}
