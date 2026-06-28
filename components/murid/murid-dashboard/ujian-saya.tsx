"use client"

import { GraduationCap, CheckCircle, XCircle, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { MuridDashboardData } from "./types"

interface UjianSayaProps {
    data: MuridDashboardData | null
    loading: boolean
}

export function UjianSaya({ data, loading }: UjianSayaProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-lg bg-muted/50 p-3 flex flex-col gap-2">
                                <Skeleton className="h-6 w-8" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        ))}
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const ujian = data?.ujian
    const stat = ujian?.statistik
    const terbaru = ujian?.terbaru ?? null

    const statItems = [
        { label: "Total Ujian", value: stat?.total ?? 0, icon: GraduationCap, cls: "bg-purple-50 text-purple-600" },
        { label: "Lulus", value: Number(stat?.lulus) || 0, icon: CheckCircle, cls: "bg-emerald-50 text-emerald-600" },
        { label: "Tidak Lulus", value: Number(stat?.tidak_lulus) || 0, icon: XCircle, cls: "bg-red-50 text-red-500" },
        { label: "Terdaftar", value: Number(stat?.terdaftar) || 0, icon: Clock, cls: "bg-yellow-50 text-yellow-600" },
    ]

    function statusBadge(status: string) {
        const lower = status.toLowerCase()
        if (lower === "lulus") return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">{status}</Badge>
        if (lower === "tidak_lulus" || lower === "tidak lulus") return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 text-xs">{status}</Badge>
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0 text-xs capitalize">{status}</Badge>
    }

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Ujian Saya</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                    {statItems.map(({ label, value, icon: Icon, cls }) => (
                        <div key={label} className={cn("rounded-lg px-4 py-3 flex flex-col gap-1", cls.split(" ")[0])}>
                            <div className="flex items-center gap-1.5">
                                <Icon className={cn("size-4", cls.split(" ").slice(1).join(" "))} />
                                <p className={cn("text-2xl font-bold", cls.split(" ").slice(1).join(" "))}>{value}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                    ))}
                </div>

                {terbaru && (
                    <>
                        <Separator />
                        <div className="flex flex-col gap-2">
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Ujian Terbaru
                            </p>
                            <div className="rounded-lg border p-3 flex flex-col gap-2">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold">
                                        {terbaru.belt_asal} → {terbaru.belt_tujuan}
                                    </span>
                                    {statusBadge(terbaru.status)}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <MapPin className="size-3.5 shrink-0" />
                                    <span>{terbaru.lokasi}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Clock className="size-3.5 shrink-0" />
                                    <span>
                                        {new Date(terbaru.tanggal_mulai).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                        {terbaru.tanggal_selesai && terbaru.tanggal_selesai !== terbaru.tanggal_mulai && (
                                            <> – {new Date(terbaru.tanggal_selesai).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}</>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
