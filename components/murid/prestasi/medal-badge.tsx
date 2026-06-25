import { Award, Medal, Trophy } from "lucide-react";

import { cn } from "@/lib/utils";

interface MedalBadgeProps {
  rank: number | null;
  hasil?: string;
  size?: "sm" | "lg";
  className?: string;
}

const RANK_CONFIG: Record<
  number,
  { label: string; icon: typeof Trophy; classes: string }
> = {
  1: {
    label: "Juara 1",
    icon: Trophy,
    classes: "bg-gold/15 text-gold-foreground ring-gold/30",
  },
  2: {
    label: "Juara 2",
    icon: Medal,
    classes: "bg-silver/15 text-silver-foreground ring-silver/30",
  },
  3: {
    label: "Juara 3",
    icon: Award,
    classes: "bg-bronze/15 text-bronze-foreground ring-bronze/30",
  },
};

export function MedalBadge({
  rank,
  hasil,
  size = "sm",
  className,
}: MedalBadgeProps) {
  const config = rank ? RANK_CONFIG[rank] : undefined;

  if (!config) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-border",
          size === "lg" && "px-3.5 py-1.5 text-sm",
          className,
        )}
      >
        <Award className="size-4" aria-hidden="true" />
        {hasil || "Partisipasi"}
      </span>
    );
  }

  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
        config.classes,
        size === "lg" && "px-3.5 py-1.5 text-sm",
        className,
      )}
    >
      <Icon
        className={cn("size-4", size === "lg" && "size-5")}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
