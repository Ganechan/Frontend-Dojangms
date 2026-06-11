import { type NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const data = await serverFetch("/api/admin/jadwal/create", {
            method: "POST",
            body: JSON.stringify(body),
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

        return NextResponse.json(
            { message: "Terjadi kesalahan server" },
            { status: 500 },
        );
    }
}
