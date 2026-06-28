"use client"

import { Medal, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import type { MuridDashboardData } from "./types"

interface PrestasiProps {
    data: MuridDashboardData | null
    loading: boolean
}

export function Prestasi({ data, loading }: PrestasiProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="rounded-lg bg-muted/50 p-3 flex flex-col gap-2">
                                <Skeleton className="h-6 w-8" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        ))}
                    </div>
                    <Separator />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    const prestasi = data?.prestasi
    const list = prestasi?.terbaru ?? []
    const hasPrestasi = list.length > 0

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Prestasi Saya</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-orange-50 px-4 py-3 flex flex-col gap-1">
                        <p className="text-2xl font-bold text-orange-600">{prestasi?.total_prestasi ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Total Prestasi</p>
                    </div>
                    <div className="rounded-lg bg-yellow-50 px-4 py-3 flex flex-col gap-1">
                        <p className="text-2xl font-bold text-yellow-600">{prestasi?.total_juara ?? 0}</p>
                        <p className="text-xs text-muted-foreground">Total Juara</p>
                    </div>
                </div>

                <Separator />

                {!hasPrestasi ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                        <div className="size-14 rounded-full bg-muted flex items-center justify-center">
                            <Medal className="size-7 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Belum Ada Prestasi</p>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-48">
                            Ikuti kejuaraan untuk mulai mengumpulkan prestasi.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {list.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                            >
                                <div className="size-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5">
                                    <Trophy className="size-4 text-yellow-600" />
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <p className="text-sm font-semibold leading-tight truncate">{item.nama_kejuaraan}</p>
                                    <p className="text-xs text-orange-600 font-medium">{item.juara}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
