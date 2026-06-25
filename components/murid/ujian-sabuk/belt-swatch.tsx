import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { beltSwatch } from "@/types/murid/ujian-sabuk";

interface BeltSwatchProps {
  nama: string;
  size?: "sm" | "md";
  className?: string;
}

/** A small colored dot representing a belt's color. */
export function BeltSwatch({ nama, size = "md", className }: BeltSwatchProps) {
  const swatch = beltSwatch(nama);
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block shrink-0 rounded-full",
        size === "sm" ? "size-3" : "size-4",
        swatch.bordered && "ring-1 ring-inset ring-border",
        className,
      )}
      style={{ backgroundColor: swatch.color }}
    />
  );
}

interface BeltLabelProps {
  nama: string;
  size?: "sm" | "md";
  className?: string;
}

/** A belt color dot followed by its name. */
export function BeltLabel({ nama, size = "md", className }: BeltLabelProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <BeltSwatch nama={nama} size={size} />
      <span
        className={cn("font-medium", size === "sm" ? "text-sm" : "text-base")}
      >
        {nama || "-"}
      </span>
    </span>
  );
}

interface BeltProgressionProps {
  from: string;
  to: string;
  className?: string;
}

/** Visualizes a belt promotion: "Sabuk Awal -> Sabuk Tujuan". */
export function BeltProgression({ from, to, className }: BeltProgressionProps) {
  // When only one belt is known, render it on its own.
  if (!from && to) return <BeltLabel nama={to} className={className} />;
  if (from && !to) return <BeltLabel nama={from} className={className} />;
  if (!from && !to) return null;

  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", className)}
    >
      <BeltLabel nama={from} />
      <ArrowRight
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <BeltLabel nama={to} />
    </div>
  );
}
