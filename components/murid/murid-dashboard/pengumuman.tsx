"use client"

import { Bell } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { MuridDashboardData } from "./types"

interface PengumumanProps {
    data: MuridDashboardData | null
    loading: boolean
}

function targetBadge(targetType: string) {
    const map: Record<string, { label: string; cls: string }> = {
        global: { label: "Global", cls: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
        kelas: { label: "Kelas", cls: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
        role: { label: "Role", cls: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
        individu: { label: "Individu", cls: "bg-orange-100 text-orange-700 hover:bg-orange-100" },
    }
    const entry = map[targetType]
    if (!entry) {
        return (
            <Badge className="border-0 text-xs font-medium bg-muted text-muted-foreground">{targetType}</Badge>
        )
    }
    const { label, cls } = entry
    return (
        <Badge className={cn("border-0 text-xs font-medium", cls)}>{label}</Badge>
    )
}

export function Pengumuman({ data, loading }: PengumumanProps) {
    if (loading) {
        return (
            <Card className="shadow-sm h-full flex flex-col">
                <CardHeader className="pb-3">
                    <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="flex flex-col gap-4 flex-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-4 flex flex-col gap-2">
                            <div className="flex items-start justify-between">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-3/4" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="pt-0">
                    <Skeleton className="h-9 w-full rounded-md" />
                </CardFooter>
            </Card>
        )
    }

    const list = data?.pengumuman ?? []

    return (
        <Card className="shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Pengumuman Terbaru</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 flex-1">
                {list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                        <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                            <Bell className="size-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Belum ada pengumuman.</p>
                    </div>
                ) : (
                    list.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-lg border p-4 flex flex-col gap-2 transition-colors hover:bg-muted/30"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold leading-tight line-clamp-2">{item.judul}</p>
                                {targetBadge(item.target_type)}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {item.isi}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-xs text-muted-foreground">
                                    {new Date(item.tanggal_publish).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">{item.pembuat_nama}</span>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
            <CardFooter className="pt-3">
                <Button variant="outline" className="w-full text-sm" asChild>
                    <Link href="/pengumuman">Lihat Semua Pengumuman</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
