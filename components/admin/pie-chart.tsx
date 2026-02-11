"use client";

import * as React from "react";
import { Label, Legend, Pie, PieChart } from "recharts";

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

// Types
interface User {
  id: number;
  name: string;
  email: string;
  tanggal_lahir: string;
  status: string;
  roles: string;
  current_belt: string;
}

interface Belt {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

interface AgeClass {
  id: number;
  name: string;
  min_age: number;
  max_age: number | null;
}

// Age classes definition
const ageClasses: AgeClass[] = [
  { id: 1, name: "Pra-Cadet", min_age: 6, max_age: 11 },
  { id: 2, name: "Cadet", min_age: 12, max_age: 14 },
  { id: 3, name: "Junior", min_age: 15, max_age: 17 },
  { id: 4, name: "Senior", min_age: 18, max_age: null },
];

// Helper function to get computed color from CSS variable
function getComputedColor(variableName: string): string {
  if (typeof window === "undefined") return "#000000";
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(variableName).trim();
  return value || "#000000";
}

// Helper function to calculate age
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

// Helper function to get age class
function getAgeClass(birthDate: string): string {
  const age = calculateAge(birthDate);
  const ageClass = ageClasses.find((ac) => {
    if (ac.max_age === null) {
      return age >= ac.min_age;
    }
    return age >= ac.min_age && age <= ac.max_age;
  });
  return ageClass?.name || "Unknown";
}

export function SectionPieCharts() {
  const chartColors = [1, 2, 3, 4, 5];
  const [beltData, setBeltData] = React.useState<
    Array<{ name: string; value: number; fill: string }>
  >([]);
  const [ageData, setAgeData] = React.useState<
    Array<{ name: string; value: number; fill: string }>
  >([]);
  const [beltConfig, setBeltConfig] = React.useState<ChartConfig>({
    value: { label: "Murid" },
  });
  const [ageConfig, setAgeConfig] = React.useState<ChartConfig>({
    value: { label: "Murid" },
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

        // Fetch users
        const userResponse = await fetch(`${BASE_URL}/api/admin/get/user`);
        const userData = await userResponse.json();
        const muridAktifList = userData.data?.filter(
          (user: User) => user.roles === "murid" && user.status === "active"
        ) || [];

        // Fetch belts
        const beltResponse = await fetch(`${BASE_URL}/api/public/get/belt`);
        const beltData = await beltResponse.json();
        const beltList = beltData.data || [];

        // Calculate belt distribution
        const beltCountMap = new Map<string, number>();
        muridAktifList.forEach((user: User) => {
          const beltName = user.current_belt;
          beltCountMap.set(beltName, (beltCountMap.get(beltName) || 0) + 1);
        });

        // Create belt chart data with colors - use order from beltList
        const beltChartData = beltList
          .map((belt: Belt) => {
            const count = beltCountMap.get(belt.name) || 0;
            return {
              name: belt.name,
              value: count,
              beltId: belt.id,
            };
          })
          .filter((item) => item.value > 0)
          .sort((a, b) => beltList.findIndex((b) => b.id === a.beltId) - beltList.findIndex((b) => b.id === b.beltId));

        // Get colors for belts
        const colors = chartColors.map((i) => getComputedColor(`--chart-${i}`));
        const beltDataWithColors = beltChartData.map((item, index) => ({
          ...item,
          fill: colors[index % colors.length],
        }));

        // Create belt config
        const newBeltConfig: ChartConfig = {
          value: { label: "Murid" },
        };
        beltChartData.forEach((item) => {
          newBeltConfig[item.name] = {
            label: item.name,
            color: "hsl(var(--chart-1))",
          };
        });
        setBeltConfig(newBeltConfig);
        setBeltData(beltDataWithColors);

        // Calculate age class distribution
        const ageCountMap = new Map<string, number>();
        muridAktifList.forEach((user: User) => {
          const ageClass = getAgeClass(user.tanggal_lahir);
          ageCountMap.set(ageClass, (ageCountMap.get(ageClass) || 0) + 1);
        });

        // Create age chart data maintaining order from ageClasses
        const ageChartData = ageClasses
          .map((ac) => ({
            name: ac.name,
            value: ageCountMap.get(ac.name) || 0,
          }))
          .filter((item) => item.value > 0);

        const ageDataWithColors = ageChartData.map((item, index) => ({
          ...item,
          fill: colors[index % colors.length],
        }));

        // Create age config
        const newAgeConfig: ChartConfig = {
          value: { label: "Murid" },
        };
        ageChartData.forEach((item) => {
          newAgeConfig[item.name] = {
            label: item.name,
            color: "hsl(var(--chart-1))",
          };
        });
        setAgeConfig(newAgeConfig);
        setAgeData(ageDataWithColors);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalBelt = React.useMemo(() => {
    return beltData.reduce((acc, curr) => acc + curr.value, 0);
  }, [beltData]);

  const totalAge = React.useMemo(() => {
    return ageData.reduce((acc, curr) => acc + curr.value, 0);
  }, [ageData]);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
      {/* Pie Chart Tingkatan Sabuk */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Komposisi Anggota</CardTitle>
          <CardDescription>Berdasarkan Tingkatan Sabuk</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : beltData.length > 0 ? (
            <>
              <ChartContainer
                config={beltConfig}
                className="mx-auto aspect-square max-h-[300px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={beltData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                    fill="fill"
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
                                {totalBelt.toLocaleString()}
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
              <div className="grid grid-cols-2 gap-3 text-sm max-h-[200px] overflow-y-auto pr-2">
                {beltData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-foreground truncate">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground flex-shrink-0">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart Kelas Umur */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Komposisi Anggota</CardTitle>
          <CardDescription>Berdasarkan Kelas Umur</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : ageData.length > 0 ? (
            <>
              <ChartContainer
                config={ageConfig}
                className="mx-auto aspect-square max-h-[300px] w-full"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={ageData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                    fill="fill"
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
                                {totalAge.toLocaleString()}
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
              <div className="grid grid-cols-2 gap-3 text-sm max-h-[200px] overflow-y-auto pr-2">
                {ageData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-foreground truncate">{item.name}</span>
                    </div>
                    <span className="font-semibold text-foreground flex-shrink-0">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
