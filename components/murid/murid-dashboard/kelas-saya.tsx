"use client"

import { School, CalendarDays, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { MuridDashboardData } from "./types"

interface KelasSayaProps {
    data: MuridDashboardData | null
    loading: boolean
}

export function KelasSaya({ data, loading }: KelasSayaProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex flex-col gap-2 mt-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const kelasList = data?.kelas.terbaru ?? []
    const kelas = kelasList[0] ?? null

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Kelas Saya</CardTitle>
            </CardHeader>
            <CardContent>
                {!kelas ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                        <div className="size-14 rounded-full bg-muted flex items-center justify-center">
                            <School className="size-7 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Belum terdaftar di kelas manapun.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-base font-bold leading-tight">{kelas.nama}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {kelas.deskripsi}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 pt-1">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="size-4 text-emerald-500 shrink-0" />
                                <span className="text-xs text-muted-foreground">Status</span>
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs font-medium ml-auto">
                                    {kelas.status}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-blue-500 shrink-0" />
                                <span className="text-xs text-muted-foreground">Bergabung</span>
                                <span className="text-xs font-medium ml-auto">
                                    {new Date(kelas.tanggal_bergabung).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <School className="size-4 text-indigo-500 shrink-0" />
                                <span className="text-xs text-muted-foreground">Jadwal Aktif</span>
                                <span className="text-xs font-bold text-indigo-600 ml-auto">
                                    {kelas.jadwal_aktif} jadwal
                                </span>
                            </div>
                        </div>

                        {kelasList.length > 1 && (
                            <p className="text-xs text-muted-foreground pt-1 border-t">
                                +{kelasList.length - 1} kelas lainnya
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
