"use client"

import { ClipboardCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { MuridDashboardData } from "./types"

interface RiwayatAbsensiProps {
    data: MuridDashboardData | null
    loading: boolean
}

function statusBadge(status: string) {
    const lower = status.toLowerCase()
    const map: Record<string, string> = {
        hadir: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
        izin: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
        sakit: "bg-blue-100 text-blue-700 hover:bg-blue-100",
        alpha: "bg-red-100 text-red-700 hover:bg-red-100",
    }
    return (
        <Badge className={cn("border-0 text-xs font-medium capitalize", map[lower] ?? "bg-muted text-muted-foreground")}>
            {status}
        </Badge>
    )
}

function leftBar(status: string) {
    const lower = status.toLowerCase()
    const map: Record<string, string> = {
        hadir: "border-l-emerald-400",
        izin: "border-l-yellow-400",
        sakit: "border-l-blue-400",
        alpha: "border-l-red-400",
    }
    return map[lower] ?? "border-l-muted"
}

export function RiwayatAbsensi({ data, loading }: RiwayatAbsensiProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-36" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-3 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    const riwayat = data?.absensi.terbaru ?? []

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Absensi Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {riwayat.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                        <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                            <ClipboardCheck className="size-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Belum ada riwayat absensi.</p>
                    </div>
                ) : (
                    riwayat.map((item, idx) => (
                        <div
                            key={`${item.tanggal}-${idx}`}
                            className={cn(
                                "rounded-lg border border-l-4 p-3 flex flex-col gap-1.5 transition-colors hover:bg-muted/30",
                                leftBar(item.status)
                            )}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {new Date(item.tanggal).toLocaleDateString("id-ID", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                                {statusBadge(item.status)}
                            </div>
                            <p className="text-sm font-medium leading-tight">{item.jadwal_nama}</p>
                            {item.catatan && (
                                <p className="text-xs text-muted-foreground leading-relaxed">{item.catatan}</p>
                            )}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
