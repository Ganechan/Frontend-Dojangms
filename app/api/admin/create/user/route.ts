// app\api\admin\create\user\route.ts
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ambil auth_token dari cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const response = await fetch(`${BACKEND_URL}/api/admin/create/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { message: responseText || `HTTP Error ${response.status}` };
    }

    if (!response.ok) {
      console.error(
        "[Create User API Error Response]:",
        response.status,
        responseText,
      );
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[Create User Internal Error]:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan internal server: " + err.message },
      { status: 500 },
    );
  }
}
