// app\api\public\belt\route.ts
import { NextResponse } from "next/server";
import { ApiError } from "@/lib/apiClient";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/public/get/belt`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new ApiError(res.status, `HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
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
