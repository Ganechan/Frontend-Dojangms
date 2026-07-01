import { type NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

interface RouteParams {
  params: Promise<{ id: string }>;
}

type SendPengumumanBody =
  | {
      action: "sekarang";
    }
  | {
      action: "terjadwal";
      scheduled_at: string;
    };

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = (await req.json()) as SendPengumumanBody;

    if (!body.action) {
      return NextResponse.json(
        { message: "Action wajib diisi" },
        { status: 400 },
      );
    }

    if (body.action === "terjadwal" && !body.scheduled_at) {
      return NextResponse.json(
        { message: "scheduled_at wajib diisi untuk pengiriman terjadwal" },
        { status: 400 },
      );
    }

    const data = await serverFetch(`/api/admin/pengumuman/${id}/kirim`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Kirim Pengumuman API Error]:", err);

    const status = err?.status ?? 500;
    const message = err?.message ?? "Terjadi kesalahan internal server";

    return NextResponse.json({ message }, { status });
  }
}
