"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardData } from "./types"

interface AbsensiCardProps {
    data: DashboardData | null
    loading: boolean
}

interface StatRowProps {
    label: string
    value: number
    valueClass?: string
}

function StatRow({ label, value, valueClass = "" }: StatRowProps) {
    return (
        <div className="flex items-center justify-between py-1">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
        </div>
    )
}

export function AbsensiCard({ data, loading }: AbsensiCardProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    const hari_ini = data?.absensi.hari_ini
    const minggu_ini = data?.absensi.minggu_ini
    const bulan_ini = data?.absensi.bulan_ini
    const persentase = hari_ini?.persentase_hadir ?? 0

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Statistik Absensi</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                {/* Hari Ini */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Hari Ini
                    </p>
                    <StatRow label="Total Absensi" value={hari_ini?.total ?? 0} />
                    <StatRow label="Hadir" value={hari_ini?.hadir ?? 0} valueClass="text-emerald-600" />
                    <StatRow label="Izin" value={hari_ini?.izin ?? 0} valueClass="text-blue-600" />
                    <StatRow label="Sakit" value={hari_ini?.sakit ?? 0} valueClass="text-yellow-600" />
                    <StatRow label="Alpha" value={hari_ini?.alpha ?? 0} valueClass="text-red-500" />
                    <div className="mt-3 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Persentase Kehadiran</span>
                            <span className="text-xs font-bold text-emerald-600">{persentase}%</span>
                        </div>
                        <Progress value={persentase} className="h-2" />
                    </div>
                </div>

                <Separator />

                {/* Minggu Ini */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Minggu Ini
                    </p>
                    <StatRow label="Total Absensi" value={minggu_ini?.total ?? 0} />
                    <StatRow label="Total Hadir" value={Number(minggu_ini?.hadir ?? 0)} valueClass="text-emerald-600" />
                </div>

                <Separator />

                {/* Bulan Ini */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                        Bulan Ini
                    </p>
                    <StatRow label="Total Absensi" value={bulan_ini?.total ?? 0} />
                    <StatRow label="Total Hadir" value={Number(bulan_ini?.hadir ?? 0)} valueClass="text-emerald-600" />
                </div>
            </CardContent>
        </Card>
    )
}
