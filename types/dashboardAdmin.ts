// types/dashboard.ts

// ─── Chart Area ───────────────────────────────────────────────
export interface ChartDataItem {
  period: string;
  muridAktif: number;
  totalMurid: number;
}

export interface ChartAllData {
  "7days": ChartDataItem[];
  "1month": ChartDataItem[];
  "3months": ChartDataItem[];
}

// ─── Pie Chart ────────────────────────────────────────────────
export interface Belt {
  id: number;
  name: string;
  dan_level: number | null;
  order_level: number;
}

export interface BeltPieItem {
  belt: string;
  totalMurid: number;
  percentage: number;
}

export interface AgePieItem {
  kategoriUmur: string;
  rentang: string;
  totalMurid: number;
  percentage: number;
}

export interface ChartItem {
  name: string;
  value: number;
}

// ─── Section Cards ────────────────────────────────────────────
export interface UserJson {
  totalMuridAktif: number;
  muridBaruBulanIni: number;
}

export interface StatsData {
  trend: "up" | "down" | "stable";
  percentChange: number;
  labelBulan: string;
  labelTahun: string;
}

export interface StatsJson {
  data: StatsData | null;
}

export interface ChampionshipRincian {
  selesai: number | string;
}

export interface Championship5yItem {
  year: number;
  rincian: ChampionshipRincian;
}

export interface Championship5yJson {
  data: Championship5yItem[];
}

export interface Championship3mItem {
  name: string;
  start_date: string;
  daysRemaining: number;
}

export interface Championship3mJson {
  total: number;
  data: Championship3mItem[];
}

export interface DashboardData {
  userJson: UserJson | null;
  beltJson: unknown;
  statsJson: StatsJson | null;
  championship5yJson: Championship5yJson | null;
  championship3mJson: Championship3mJson | null;
}
