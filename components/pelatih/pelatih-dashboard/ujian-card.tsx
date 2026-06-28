"use client"

import { GraduationCap, MapPin, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Ujian } from "./types"

interface UjianCardProps {
    data: Ujian[]
    loading: boolean
}

function formatTanggal(tanggal: string): string {
    return new Date(tanggal).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

function formatRentangTanggal(start: string, end: string): string {
    const startDate = new Date(start)
    const endDate = new Date(end)
    if (startDate.getTime() === endDate.getTime()) {
        return formatTanggal(start)
    }
    return `${formatTanggal(start)} - ${formatTanggal(end)}`
}

function EmptyUjian() {
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center">
                <GraduationCap className="size-7 text-muted-foreground" />
            </div>
            <div>
                <p className="text-sm font-medium">Belum Ada Ujian</p>
                <p className="text-xs text-muted-foreground mt-1">Ujian mendatang akan tampil di sini.</p>
            </div>
        </div>
    )
}

export function UjianCard({ data, loading }: UjianCardProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-4 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-5 w-20" />
                            </div>
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-3 w-36" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Ujian Akan Datang</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <EmptyUjian />
                ) : (
                    <div className="flex flex-col gap-3">
                        {data.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg border bg-card p-4 flex flex-col gap-2 hover:bg-muted/40 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-semibold leading-tight">{item.keterangan}</p>
                                    <Badge
                                        variant="secondary"
                                        className="text-xs flex-shrink-0 bg-purple-50 text-purple-600 border-purple-200"
                                    >
                                        {item.hari_menuju >= 0 ? `${item.hari_menuju} Hari Lagi` : "Sudah Lewat"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <GraduationCap className="size-3.5 flex-shrink-0 text-purple-500" />
                                    <span className="text-xs capitalize">{item.level_ujian}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="size-3.5 flex-shrink-0" />
                                    <span className="text-xs">{item.lokasi}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <Calendar className="size-3.5 flex-shrink-0" />
                                    <span className="text-xs">{formatRentangTanggal(item.tanggal_mulai, item.tanggal_selesai)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
