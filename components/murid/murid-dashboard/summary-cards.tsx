"use client"

import {
    School,
    CalendarDays,
    ClipboardCheck,
    Bell,
    Medal,
    GraduationCap,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { MuridDashboardData } from "./types"

interface SummaryCardsProps {
    data: MuridDashboardData | null
    loading: boolean
}

const cards = [
    {
        key: "kelas_aktif",
        label: "Kelas Aktif",
        icon: School,
        iconClass: "text-blue-600 bg-blue-50",
        valueClass: "text-blue-600",
    },
    {
        key: "total_jadwal",
        label: "Total Jadwal Latihan",
        icon: CalendarDays,
        iconClass: "text-indigo-600 bg-indigo-50",
        valueClass: "text-indigo-600",
    },
    {
        key: "persentase_kehadiran",
        label: "Persentase Kehadiran",
        icon: ClipboardCheck,
        iconClass: "text-emerald-600 bg-emerald-50",
        valueClass: "text-emerald-600",
        isProgress: true,
    },
    {
        key: "pengumuman_baru",
        label: "Pengumuman Baru",
        icon: Bell,
        iconClass: "text-yellow-600 bg-yellow-50",
        valueClass: "text-yellow-600",
    },
    {
        key: "total_prestasi",
        label: "Total Prestasi",
        icon: Medal,
        iconClass: "text-orange-600 bg-orange-50",
        valueClass: "text-orange-600",
    },
    {
        key: "total_ujian",
        label: "Total Ujian",
        icon: GraduationCap,
        iconClass: "text-purple-600 bg-purple-50",
        valueClass: "text-purple-600",
    },
]

function getValue(key: string, data: MuridDashboardData): number {
    switch (key) {
        case "kelas_aktif":
            return Number(data.kelas.aktif) || 0
        case "total_jadwal":
            return data.jadwal_terdekat.length
        case "persentase_kehadiran":
            return data.absensi.statistik.persentase_kehadiran
        case "pengumuman_baru":
            return data.pengumuman.length
        case "total_prestasi":
            return data.prestasi.total_prestasi
        case "total_ujian":
            return data.ujian.statistik.total
        default:
            return 0
    }
}

export function SummaryCards({ data, loading }: SummaryCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="p-4">
                        <CardContent className="p-0 flex flex-col gap-3">
                            <Skeleton className="size-10 rounded-lg" />
                            <Skeleton className="h-7 w-12" />
                            <Skeleton className="h-4 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {cards.map((card) => {
                const Icon = card.icon
                const value = data ? getValue(card.key, data) : 0
                return (
                    <Card key={card.key} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-0 flex flex-col gap-3">
                            <div className={cn("size-10 rounded-lg flex items-center justify-center", card.iconClass)}>
                                <Icon className="size-5" />
                            </div>
                            <p className={cn("text-2xl font-bold", card.valueClass)}>
                                {card.isProgress ? `${value}%` : value}
                            </p>
                            {card.isProgress && (
                                <Progress value={value} className="h-1.5" />
                            )}
                            <p className="text-xs text-muted-foreground leading-tight">{card.label}</p>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
