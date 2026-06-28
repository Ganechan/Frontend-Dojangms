"use client"

import { BookOpen, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { DashboardData } from "./types"

interface KelasSummaryProps {
    data: DashboardData | null
    loading: boolean
}

export function KelasSummary({ data, loading }: KelasSummaryProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-36" />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                </CardContent>
            </Card>
        )
    }

    const items = [
        {
            label: "Total Kelas",
            value: data?.kelas.total ?? 0,
            icon: BookOpen,
            iconClass: "text-foreground bg-muted",
            valueClass: "",
        },
        {
            label: "Kelas Aktif",
            value: Number(data?.kelas.aktif ?? 0),
            icon: CheckCircle,
            iconClass: "text-emerald-600 bg-emerald-50",
            valueClass: "text-emerald-600",
        },
        {
            label: "Kelas Nonaktif",
            value: Number(data?.kelas.nonaktif ?? 0),
            icon: XCircle,
            iconClass: "text-red-500 bg-red-50",
            valueClass: "text-red-500",
        },
    ]

    return (
        <Card className="shadow-sm h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Ringkasan Kelas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                {items.map((item) => {
                    const Icon = item.icon
                    return (
                        <div
                            key={item.label}
                            className="flex items-center gap-3 rounded-lg border bg-card p-3"
                        >
                            <div className={cn("size-9 rounded-md flex items-center justify-center flex-shrink-0", item.iconClass)}>
                                <Icon className="size-4" />
                            </div>
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                <span className="text-xs text-muted-foreground">{item.label}</span>
                                <span className={cn("text-xl font-bold", item.valueClass)}>{item.value}</span>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
