// lib\profile\profile-utils.ts
import type { UserProfile } from "./types";

// Fields used to determine profile completeness.
export const COMPLETENESS_FIELDS: (keyof UserProfile)[] = [
  "foto",
  "alamat",
  "jenis_kelamin",
  "nama_wali",
  "no_wali",
  "phone",
  "tanggal_lahir",
];

export function isEmpty(value: unknown): boolean {
  return value === null || value === undefined || value === "";
}

export function calculateCompleteness(profile: UserProfile): {
  percent: number;
  completed: number;
  total: number;
  missing: (keyof UserProfile)[];
} {
  const total = COMPLETENESS_FIELDS.length;
  const missing = COMPLETENESS_FIELDS.filter((field) =>
    isEmpty(profile[field]),
  );
  const completed = total - missing.length;
  const percent = Math.round((completed / total) * 100);
  return { percent, completed, total, missing };
}

export function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDate(value: string | null): string {
  if (isEmpty(value)) return "-";
  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return value as string;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string | null): string {
  if (isEmpty(value)) return "-";
  const date = new Date((value as string).replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value as string;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatValue(value: string | null): string {
  return isEmpty(value) ? "-" : (value as string);
}

export function formatGender(value: string | null): string {
  if (isEmpty(value)) return "-";
  const v = (value as string).toLowerCase();
  if (v === "l" || v === "laki-laki" || v === "male") return "Laki-laki";
  if (v === "p" || v === "perempuan" || v === "female") return "Perempuan";
  return value as string;
}
