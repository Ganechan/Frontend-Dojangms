"use client"

import { MapPin, Clock, CalendarDays, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { MuridDashboardData, JadwalTerdekat } from "./types"

interface JadwalLatihanProps {
    data: MuridDashboardData | null
    loading: boolean
}

function tipeBadge(tipe: JadwalTerdekat["tipe"]) {
    if (tipe === "kelas") {
        return (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 text-xs font-medium">
                Kelas
            </Badge>
        )
    }
    return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs font-medium">
            Latihan Wajib
        </Badge>
    )
}

export function JadwalLatihan({ data, loading }: JadwalLatihanProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-4 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-40" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    const jadwal = data?.jadwal_terdekat ?? []

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Jadwal Latihan Terdekat</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {jadwal.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                        <div className="size-14 rounded-full bg-muted flex items-center justify-center">
                            <CalendarDays className="size-7 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Belum ada jadwal latihan.</p>
                    </div>
                ) : (
                    jadwal.map((item) => (
                        <div
                            key={item.id}
                            className={cn(
                                "rounded-lg border p-4 flex flex-col gap-2 transition-colors hover:bg-muted/40",
                                item.tipe === "kelas" ? "border-l-4 border-l-blue-400" : "border-l-4 border-l-emerald-400"
                            )}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold leading-tight">{item.jadwal_nama}</p>
                                {tipeBadge(item.tipe)}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CalendarDays className="size-3.5 shrink-0" />
                                <span>{item.hari}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="size-3.5 shrink-0" />
                                <span>{item.jam_mulai} - {item.jam_selesai}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="size-3.5 shrink-0" />
                                <span>{item.lokasi}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <BookOpen className="size-3.5 shrink-0" />
                                <span>{item.sumber_nama}</span>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    )
}
