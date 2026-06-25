// lib\jadwal-helper.ts
import type {
  ScheduleDetailData,
  ScheduleFormType,
  LatihanWajibFormData,
  TrainingCampFormData,
  KelasRegulerFormData,
  KelasPenggantiFormData,
  EditScheduleFormData,
} from "@/types/admin/jadwal";

/**
 * Detects the form type based on schedule type and jadwal data
 * Rule:
 * - latihan_wajib -> "latihan_wajib"
 * - training_camp -> "training_camp"
 * - kelas with hari != null -> "kelas_reguler"
 * - kelas with hari == null -> "kelas_pengganti"
 */
export function detectScheduleFormType(
  scheduleData: ScheduleDetailData,
): ScheduleFormType {
  const { informasi, jadwal } = scheduleData;
  const { tipe } = informasi;

  if (tipe === "latihan_wajib") {
    return "latihan_wajib";
  }

  if (tipe === "training_camp") {
    return "training_camp";
  }

  if (tipe === "kelas") {
    if (jadwal.hari === null) {
      return "kelas_pengganti";
    }
    return "kelas_reguler";
  }

  return "latihan_wajib"; // fallback
}

/**
 * Maps API response data to form initial values based on schedule type
 */
export function mapScheduleDataToFormValues(
  scheduleData: ScheduleDetailData,
): EditScheduleFormData {
  const formType = detectScheduleFormType(scheduleData);
  const { informasi, jadwal, periode, lokasi, relasi } = scheduleData;

  switch (formType) {
    case "latihan_wajib": {
      const data: LatihanWajibFormData = {
        nama: informasi.nama,
        hari: jadwal.hari || "",
        jam_mulai: formatTimeToInput(jadwal.jam_mulai),
        jam_selesai: formatTimeToInput(jadwal.jam_selesai),
        lokasi: lokasi.nama,
        status: informasi.status, // ← tambah
      };
      return data;
    }

    case "training_camp": {
      const data: TrainingCampFormData = {
        nama: informasi.nama,
        tanggal_mulai: periode.tanggal_mulai || "",
        tanggal_selesai: periode.tanggal_selesai || "",
        jam_mulai: formatTimeToInput(jadwal.jam_mulai),
        jam_selesai: formatTimeToInput(jadwal.jam_selesai),
        lokasi: lokasi.nama,
        status: informasi.status, // ← tambah
      };
      return data;
    }

    case "kelas_reguler": {
      const data: KelasRegulerFormData = {
        nama: informasi.nama,
        hari: jadwal.hari || "",
        jam_mulai: formatTimeToInput(jadwal.jam_mulai),
        jam_selesai: formatTimeToInput(jadwal.jam_selesai),
        lokasi: lokasi.nama,
        effective_from: periode.effective_from || "",
        kelas_id: relasi.kelas?.id || 0,
        status: informasi.status, // ← tambah
      };
      return data;
    }

    case "kelas_pengganti": {
      const data: KelasPenggantiFormData = {
        nama: informasi.nama,
        tanggal: periode.tanggal_mulai || "",
        jam_mulai: formatTimeToInput(jadwal.jam_mulai),
        jam_selesai: formatTimeToInput(jadwal.jam_selesai),
        lokasi: lokasi.nama,
        kelas_id: relasi.kelas?.id || 0,
        status: informasi.status, // ← tambah
      };
      return data;
    }

    default:
      throw new Error(`Unknown form type: ${formType}`);
  }
}

/**
 * Converts time from HH:MM:SS format to HH:MM format (for input type="time")
 */
export function formatTimeToInput(timeString: string): string {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  return `${hours}:${minutes}`;
}

/**
 * Gets human-readable label for schedule form type
 */
export function getScheduleFormTypeLabel(formType: ScheduleFormType): string {
  const labels: Record<ScheduleFormType, string> = {
    latihan_wajib: "Latihan Wajib",
    training_camp: "Training Camp",
    kelas_reguler: "Kelas",
    kelas_pengganti: "Kelas Pengganti",
  };
  return labels[formType];
}
