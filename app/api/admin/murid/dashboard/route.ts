import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";
import { ApiError } from "@/lib/apiClient";

export async function GET(req: NextRequest) {
    try {
        const data = await serverFetch("/api/admin/murid/dashboard", {
            method: "GET",
        });
        return NextResponse.json(data);
    } catch (err) {
        if (err instanceof ApiError) {
            if (err.status === 401) {
                return NextResponse.json(
                    { message: "Sesi habis, silakan login kembali" },
                    { status: 401 }
                );
            }
            if (err.status === 403) {
                return NextResponse.json(
                    { message: "Anda tidak memiliki akses" },
                    { status: 403 }
                );
            }
            return NextResponse.json(
                { message: err.message },
                { status: err.status }
            );
        }
        console.error("Error fetching murid dashboard:", err);
        return NextResponse.json(
            { message: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}