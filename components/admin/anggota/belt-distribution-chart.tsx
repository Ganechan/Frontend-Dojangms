'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    type TooltipProps,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { BeltDistribution } from '@/types/admin/anggota';

// Jumlah belt di mana kita mulai aktifkan scroll + rotasi label
const SCROLL_THRESHOLD = 8;

// Lebar per kolom saat scroll aktif (px) — cukup lebar agar label -45° tidak bertumpuk
const COL_WIDTH = 72;

interface BeltDistributionChartProps {
    data: BeltDistribution[];
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-sm">
            <p className="mb-1 text-xs font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground">
                {payload[0].value}{' '}
                <span className="text-foreground/70">anggota</span>
            </p>
        </div>
    );
}

export function BeltDistributionChart({ data }: BeltDistributionChartProps) {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const peak = data.reduce(
        (best, d) => (d.count > best.count ? d : best),
        data[0] ?? { belt_name: '—', count: 0 },
    );
    const avg = data.length > 0 ? Math.round(total / data.length) : 0;

    // Aktifkan scroll horizontal jika data melebihi threshold
    const needsScroll = data.length > SCROLL_THRESHOLD;

    // Lebar canvas chart saat scroll aktif; minimal lebar penuh container
    const scrollWidth = needsScroll ? data.length * COL_WIDTH : undefined;

    // Tinggi bottom margin XAxis: lebih besar saat label dirotasi agar tidak terpotong
    const xAxisHeight = needsScroll ? 72 : 30;

    return (
        <Card className="flex flex-col gap-0 p-0">
            {/* Header */}
            <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-base font-medium">
                            Distribusi sabuk
                        </CardTitle>
                        <CardDescription className="mt-0.5 text-sm">
                            Jumlah anggota per tingkat sabuk
                        </CardDescription>
                    </div>
                    <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                        {data.length} tingkat
                    </span>
                </div>
            </CardHeader>

            {/* Metric row */}
            <div className="grid grid-cols-3 divide-x divide-border/60 border-y border-border/60">
                <div className="px-6 py-4">
                    <p className="text-xs text-muted-foreground">Total anggota</p>
                    <p className="mt-1 text-xl font-medium tabular-nums">{total}</p>
                </div>
                <div className="px-6 py-4">
                    <p className="text-xs text-muted-foreground">Sabuk terbanyak</p>
                    <p className="mt-1 text-xl font-medium leading-tight">
                        {peak.belt_name}
                    </p>
                </div>
                <div className="px-6 py-4">
                    <p className="text-xs text-muted-foreground">Rata-rata / sabuk</p>
                    <p className="mt-1 text-xl font-medium tabular-nums">{avg}</p>
                </div>
            </div>

            {/* Chart — wrapper scroll horizontal */}
            <CardContent className="px-2 pt-6 pb-4">
                <div className="overflow-x-auto">
                    <div style={{ width: scrollWidth ?? '100%', minWidth: '100%' }}>
                        <ResponsiveContainer width="100%" height={needsScroll ? 320 : 280}>
                            <AreaChart
                                data={data}
                                margin={{
                                    top: 8,
                                    right: 16,
                                    left: 0,
                                    bottom: needsScroll ? 8 : 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop
                                            offset="0%"
                                            stopColor="var(--chart-fill)"
                                            stopOpacity={0.15}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="var(--chart-fill)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border))"
                                    strokeOpacity={0.6}
                                />

                                <XAxis
                                    dataKey="belt_name"
                                    tickLine={false}
                                    axisLine={false}
                                    interval={0}
                                    height={xAxisHeight}
                                    // Rotasi hanya aktif saat scroll diperlukan
                                    angle={needsScroll ? -45 : 0}
                                    textAnchor={needsScroll ? 'end' : 'middle'}
                                    tick={{
                                        fontSize: 12,
                                        fill: 'hsl(var(--muted-foreground))',
                                    }}
                                    // dy menyesuaikan jarak vertikal tick dari garis axis
                                    dy={needsScroll ? 4 : 8}
                                />

                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: 'hsl(var(--muted-foreground))',
                                    }}
                                    tickFormatter={(v: number) => String(v)}
                                    width={32}
                                />

                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{
                                        stroke: 'hsl(var(--border))',
                                        strokeWidth: 1,
                                        strokeDasharray: '4 2',
                                    }}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    name="Jumlah"
                                    stroke="var(--chart-line)"
                                    strokeWidth={1}
                                    fill="url(#fillCount)"
                                    dot={{
                                        r: 3.5,
                                        fill: 'hsl(var(--background))',
                                        stroke: 'hsl(var(--primary))',
                                        strokeWidth: 2,
                                    }}
                                    activeDot={{
                                        r: 5.5,
                                        fill: 'hsl(var(--primary))',
                                        stroke: 'hsl(var(--background))',
                                        strokeWidth: 2,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Hint scroll — hanya muncul saat scroll aktif */}
                {needsScroll && (
                    <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
                        ← geser untuk melihat semua tingkat →
                    </p>
                )}
            </CardContent>
        </Card>
    );
}