"use client"

import { MapPin, Clock, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { JadwalTerdekat } from "./types"

interface JadwalLatihanCardProps {
    data: JadwalTerdekat[]
    loading: boolean
}

function EmptyJadwal() {
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="size-14 rounded-full bg-muted flex items-center justify-center">
                <CalendarDays className="size-7 text-muted-foreground" />
            </div>
            <div>
                <p className="text-sm font-medium">Belum Ada Jadwal</p>
                <p className="text-xs text-muted-foreground mt-1">Belum ada jadwal latihan yang terdaftar.</p>
            </div>
        </div>
    )
}

function formatJam(mulai: string, selesai: string) {
    const fmt = (t: string) => t.substring(0, 5).replace(":", ".")
    return `${fmt(mulai)} - ${fmt(selesai)}`
}

export function JadwalLatihanCard({ data, loading }: JadwalLatihanCardProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-4 flex flex-col gap-2">
                            <Skeleton className="h-4 w-40" />
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
                <CardTitle className="text-base font-semibold">Jadwal Latihan Terdekat</CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <EmptyJadwal />
                ) : (
                    <div className="flex flex-col gap-3">
                        {data.map((jadwal) => (
                            <div
                                key={jadwal.id}
                                className="rounded-lg border bg-card p-4 flex flex-col gap-2 hover:bg-muted/40 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm font-semibold leading-tight">{jadwal.jadwal_nama}</p>
                                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                                        {jadwal.kelas_nama}
                                    </Badge>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <CalendarDays className="size-3.5 flex-shrink-0" />
                                        <span className="text-xs capitalize">{jadwal.hari}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <Clock className="size-3.5 flex-shrink-0" />
                                        <span className="text-xs">{formatJam(jadwal.jam_mulai, jadwal.jam_selesai)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <MapPin className="size-3.5 flex-shrink-0" />
                                        <span className="text-xs">{jadwal.lokasi}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
