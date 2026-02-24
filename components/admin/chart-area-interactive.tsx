// components\admin\chart-area-interactive.tsx
"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

export const description = "An interactive area chart";

const chartConfig = {
  totalMurid: {
    label: "Total Murid",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export interface ChartDataItem {
  period: string;
  muridAktif: number;
  totalMurid: number;
}

export interface ChartAllData {
  "7days": ChartDataItem[];
  "1month": ChartDataItem[];
  "3months": ChartDataItem[];
}

const TIME_RANGE_MAP = {
  "7d": "7days",
  "30d": "1month",
  "90d": "3months",
} as const;

type TimeRangeKey = keyof typeof TIME_RANGE_MAP;

const TIME_RANGE_STORAGE_KEY = "chart:student-registration:timeRange";

function isValidTimeRange(value: unknown): value is TimeRangeKey {
  return value === "7d" || value === "30d" || value === "90d";
}

function ChartSkeleton() {
  return (
    <div className="h-[250px] w-full rounded-md border bg-card p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-end gap-2">
          <Skeleton className="h-24 w-6" />
          <Skeleton className="h-16 w-6" />
          <Skeleton className="h-32 w-6" />
          <Skeleton className="h-20 w-6" />
          <Skeleton className="h-28 w-6" />
          <Skeleton className="h-14 w-6" />
          <Skeleton className="h-36 w-6" />
          <Skeleton className="h-24 w-6" />
          <Skeleton className="h-28 w-6" />
          <Skeleton className="h-18 w-6" />
        </div>
        <Skeleton className="h-3 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

type Props = {
  allData: ChartAllData | null;
};

export function ChartAreaInteractive({ allData }: Props) {
  const isMobile = useIsMobile();

  // initial stabil untuk hydration
  const [timeRange, setTimeRange] = React.useState<TimeRangeKey>("7d");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // load last selected range
    try {
      const saved = window.localStorage.getItem(TIME_RANGE_STORAGE_KEY);
      if (isValidTimeRange(saved)) setTimeRange(saved);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(TIME_RANGE_STORAGE_KEY, timeRange);
    } catch {
      // ignore
    }
  }, [timeRange, mounted]);

  const chartData = React.useMemo(() => {
    if (!allData) return [];
    return allData[TIME_RANGE_MAP[timeRange]];
  }, [allData, timeRange]);

  const handleTimeRangeChange = (value: string) => {
    if (!value) return;
    if (isValidTimeRange(value)) setTimeRange(value);
  };

  // Karena data sudah diprefetch di server, "loading" client biasanya tidak diperlukan.
  // Tapi saat streaming/suspense, bisa saja komponen ini muncul belakangan.
  // Kita pakai skeleton pendek saat belum mounted agar ToggleGroup tidak mismatch.
  const showMountedSkeleton = !mounted;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Registration date for the latest student
          </span>
          <span className="@[540px]/card:hidden">
            Latest student registration
          </span>
        </CardDescription>

        <CardAction>
          {/* Desktop ToggleGroup */}
          {showMountedSkeleton ? (
            <div className="hidden @[767px]/card:block">
              <Skeleton className="h-9 w-[340px] rounded-md" />
            </div>
          ) : (
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={handleTimeRangeChange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
              <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
              <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            </ToggleGroup>
          )}

          {/* Mobile Select */}
          {showMountedSkeleton ? (
            <div className="@[767px]/card:hidden">
              <Skeleton className="h-9 w-40 rounded-md" />
            </div>
          ) : (
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 7 days" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  Last 3 months
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {!allData ? (
          // kalau fetch server gagal / env salah
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : showMountedSkeleton ? (
          // skeleton ringan saat menunggu mounted (menghindari mismatch)
          <ChartSkeleton />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillTotalMurid" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-totalMurid)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-totalMurid)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="period"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="totalMurid"
                type="monotone"
                fill="url(#fillTotalMurid)"
                stroke="var(--color-totalMurid)"
                stackId="a"
                baseValue={0}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
