import { NextResponse } from "next/server";
import { BeltOption } from "@/types/auth";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET() {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json(
        { message: "Konfigurasi server bermasalah" },
        { status: 500 },
      );
    }

    let backendRes: Response;
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/public/get/belt`, {
        // Cache 5 menit — data sabuk jarang berubah
        next: { revalidate: 300 },
      });
    } catch (fetchError) {
      console.error("[Public Belts] Cannot reach backend:", fetchError);
      return NextResponse.json(
        { message: "Tidak dapat mengambil data sabuk" },
        { status: 503 },
      );
    }

    const contentType = backendRes.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { message: "Respons tidak valid dari server backend." },
        { status: 502 },
      );
    }

    const data = await backendRes.json();
    const belts: BeltOption[] = data.data ?? data;

    return NextResponse.json({ data: belts }, { status: 200 });
  } catch (error) {
    console.error("[Public Belts Error]:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan, silakan coba lagi" },
      { status: 500 },
    );
  }
}
