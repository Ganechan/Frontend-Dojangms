import { User } from "./types";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function calculateRoleCounts(data: User[]) {
  const counts = {
    semua: data.length,
    admin: 0,
    pelatih: 0,
    murid: 0,
  };

  data.forEach((user) => {
    if (!user.roles || user.roles.length === 0) return;
    const rolesLower = user.roles.map((r) => r.toLowerCase().trim());
    if (rolesLower.includes("admin")) counts.admin++;
    if (rolesLower.includes("pelatih")) counts.pelatih++;
    if (rolesLower.includes("murid")) counts.murid++;
  });

  return counts;
}
