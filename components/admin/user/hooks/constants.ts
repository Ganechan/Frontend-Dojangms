export const beltColorMap: Record<string, string> = {
  Putih: "bg-white text-gray-800 border border-gray-300",
  Kuning: "bg-yellow-400 text-yellow-900",
  "Kuning Strip Hijau": "bg-yellow-400 text-yellow-900",
  Hijau: "bg-green-500 text-white",
  "Hijau Strip Biru": "bg-green-500 text-white",
  Biru: "bg-blue-600 text-white",
  "Biru Strip Merah": "bg-blue-600 text-white",
  Merah: "bg-red-600 text-white",
  "Merah Stip Hitam": "bg-red-600 text-white",
  "DAN I": "bg-gray-900 text-white",
  "DAN II": "bg-gray-900 text-white",
  "DAN III": "bg-gray-900 text-white",
  "DAN IV": "bg-gray-900 text-white",
};

export const columnLabelMap: Record<string, string> = {
  name: "Nama",
  email: "Email",
  phone: "No. Telepon",
  tanggal_lahir: "Tanggal Lahir",
  roles: "Role",
  current_belt: "Sabuk",
  belt_achieved_at: "Sabuk Dicapai",
  status: "Status",
  created_at: "Terdaftar",
};

export const defaultHiddenColumns = {
  email: false,
  phone: false,
  tanggal_lahir: false,
  belt_achieved_at: false,
  created_at: false,
};

// ✅ NEW: Page size options
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 75, 100, 200] as const;
export const DEFAULT_PAGE_SIZE = 10;
