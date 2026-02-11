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

export const description = "An interactive area chart";

const chartConfig = {
  registration: {
    label: "Registrasi",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  tanggal_lahir: string;
  status: string;
  created_at: string;
  roles: string;
  current_belt: string;
  belt_achieved_at: string;
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<
    Array<{ date: string; registration: number }>
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
        const response = await fetch(`${BASE_URL}/api/admin/get/user`);
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          const dateMap = new Map<string, number>();

          result.data.forEach((user: UserData) => {
            const createdAtDate = new Date(user.created_at);
            const jakartaDate = new Date(
              createdAtDate.toLocaleString("en-US", {
                timeZone: "Asia/Jakarta",
              }),
            );
            const dateStr = jakartaDate.toISOString().split("T")[0];

            dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
          });

          const data = Array.from(dateMap, ([date, count]) => ({
            date,
            registration: count,
          })).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

          setChartData(data);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filteredData = (() => {
    let daysToSubtract = 90;
    if (timeRange == "30d") {
      daysToSubtract = 30;
    } else if (timeRange == "7d") {
      daysToSubtract = 7;
    }

    const now = new Date();
    const jakartaOffset = 7 * 60;
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const jakartaTime = new Date(utcTime + jakartaOffset * 60 * 1000);

    const jakartaTodayStr = jakartaTime.toISOString().split("T")[0];

    const startDate = new Date(jakartaTime);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    const startDateStr = startDate.toISOString().split("T")[0];

    const existingDataMap = new Map(
      chartData.map((item) => [item.date, item.registration]),
    );

    const result: Array<{ date: string; registration: number }> = [];

    let currentDate = new Date(startDateStr + "T00:00:00Z");
    const endDate = new Date(jakartaTodayStr + "T00:00:00Z");

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        registration: existingDataMap.get(dateStr) ?? 0,
      });
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return result;
  })();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Student Registration</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {loading
              ? "Loading..."
              : "Registration date for the latest student"}
          </span>
          <span className="@[540px]/card:hidden">
            {loading ? "Loading..." : "Latest student registration"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <p className="text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient
                  id="fillRegistration"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-registration)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-registration)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {/* ✅ Dot ditambahkan di sini */}
              <Area
                dataKey="registration"
                type="monotone" // ✅ Ubah dari "natural" ke "monotone"
                fill="url(#fillRegistration)"
                stroke="var(--color-registration)"
                stackId="a"
                baseValue={0} // ✅ Tambahkan ini untuk memastikan baseline di 0
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.registration === 0)
                    return <React.Fragment key={payload.date} />;
                  return (
                    <circle
                      key={payload.date}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="var(--color-registration)"
                      stroke="none"
                    />
                  );
                }}
                activeDot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.registration === 0)
                    return <React.Fragment key={payload.date} />;
                  return (
                    <circle
                      key={payload.date}
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill="var(--color-registration)"
                      stroke="none"
                    />
                  );
                }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
