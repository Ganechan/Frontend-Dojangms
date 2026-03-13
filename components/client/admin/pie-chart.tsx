// components/client/admin/pie-chart.tsx
"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// ✅ FIX: Import type dari types/dashboard.ts — tidak lagi didefinisikan ulang di sini
import type { ChartItem } from "@/types/dashboardAdmin";

interface SectionPieChartsProps {
  beltData: ChartItem[];
  ageData: ChartItem[];
  totalBeltMurid: number;
  totalAgeMurid: number;
}

const CHART_COLOR_VARS = [1, 2, 3, 4, 5];

function getComputedColor(variableName: string): string {
  if (typeof window === "undefined") return "#000000";
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(variableName).trim();
  return value || "#000000";
}

function useChartColors() {
  const [colors, setColors] = React.useState<string[]>([]);

  React.useEffect(() => {
    setColors(CHART_COLOR_VARS.map((i) => getComputedColor(`--chart-${i}`)));
  }, []);

  return colors;
}

function buildChartData(
  data: ChartItem[],
  colors: string[],
): Array<ChartItem & { fill: string }> {
  return data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length] || "#000000",
  }));
}

function buildConfig(data: ChartItem[]): ChartConfig {
  const config: ChartConfig = { value: { label: "Murid" } };
  data.forEach((item) => {
    config[item.name] = { label: item.name };
  });
  return config;
}

function PieChartCard({
  title,
  description,
  data,
  total,
  colors,
}: {
  title: string;
  description: string;
  data: ChartItem[];
  total: number;
  colors: string[];
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);

  const chartData = buildChartData(data, colors);
  const config = buildConfig(data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data.length > 0 ? (
          <>
            <ChartContainer
              config={config}
              className="mx-auto aspect-square max-h-[300px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {total.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Murid
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>

            {isLoaded && (
              <div className="grid grid-cols-2 gap-3 text-sm max-h-[200px] overflow-y-auto pr-2">
                {chartData.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-foreground truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground flex-shrink-0">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function SectionPieCharts({
  beltData,
  ageData,
  totalBeltMurid,
  totalAgeMurid,
}: SectionPieChartsProps) {
  const colors = useChartColors();

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
      <PieChartCard
        title="Komposisi Anggota"
        description="Berdasarkan Tingkatan Sabuk"
        data={beltData}
        total={totalBeltMurid}
        colors={colors}
      />
      <PieChartCard
        title="Komposisi Anggota"
        description="Berdasarkan Kelas Umur"
        data={ageData}
        total={totalAgeMurid}
        colors={colors}
      />
    </div>
  );
}
