import { User } from "./types";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ✅ NEW: hitung count untuk toolbar Total | Active | Inactive
export function calculateStatusCounts(data: User[]) {
  const counts = {
    total: data.length,
    active: 0,
    inactive: 0,
  };

  data.forEach((user) => {
    if (user.status === "active") counts.active++;
    if (user.status === "inactive") counts.inactive++;
  });

  return counts;
}
