import { beltColorMap } from "./hooks/constants";

export function BeltBadge({ belt }: { belt: string }) {
  const cls = beltColorMap[belt] ?? "bg-gray-200 text-gray-800";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}
    >
      {belt}
    </span>
  );
}
