"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  description,
}: StatsCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{value}</span>
              {trend && (
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    trend.direction === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.direction === "up" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(trend.value)}%
                </div>
              )}
            </div>
            {description && (
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
