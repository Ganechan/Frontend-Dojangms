// types\admin\jadwal.ts
export type ScheduleType = 'latihan_wajib' | 'kelas' | 'training_camp';
export type ScheduleStatus = 'aktif' | 'nonaktif';
export type ActiveScheduleTab = 'total' | 'aktif' | 'nonaktif';
export type ScheduleFormType = 'latihan_wajib' | 'training_camp' | 'kelas_reguler' | 'kelas_pengganti';

export interface ScheduleData {
    id: number;
    tipe: ScheduleType;
    nama: string;
    kelas_id: number | null;
    hari: string | null;
    effective_from: string | null;
    effective_until: string | null;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    jam_mulai: string;
    jam_selesai: string;
    lokasi: string;
    keterangan: string;
    status: ScheduleStatus;
    dibuat_oleh: number;
    created_at: string;
    updated_at: string;
    kelas_nama: string | null;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total_data: number;
    total_page: number;
    has_next: boolean;
    has_prev: boolean;
}

export interface ScheduleSummary {
    total_jadwal: number;
    total_latihan_wajib: string;
    total_training_camp: string;
    total_kelas: string;
    total_aktif: string;
    total_nonaktif: string;
}

export interface ScheduleStatusCounts {
    total: number;
    aktif: number;
    nonaktif: number;
}

export interface ScheduleApiResponse {
    message: string;
    summary: ScheduleSummary;
    pagination: PaginationMeta;
    data: ScheduleData[];
}

export interface Kelas {
    id: number;
    nama: string;
    deskripsi: string;
    status: ScheduleStatus;
}

export interface KelasApiResponse {
    message: string;
    summary: {
        total_kelas: number;
        total_kelas_aktif: string;
        total_kelas_nonaktif: string;
    };
    pagination: PaginationMeta;
    data: Kelas[];
}

export const LIMIT_OPTIONS = [10, 25, 50, 75, 100, 200];

// API Response types for detail endpoint
export interface ScheduleDetailResponse {
    message: string;
    data: ScheduleDetailData;
}

export interface ScheduleDetailData {
    id: number;
    informasi: {
        nama: string;
        tipe: ScheduleType;
        status: ScheduleStatus;
        keterangan: string | null;
    };
    jadwal: {
        hari: string | null;
        jam_mulai: string;
        jam_selesai: string;
    };
    periode: {
        effective_from: string | null;
        effective_until: string | null;
        tanggal_mulai: string | null;
        tanggal_selesai: string | null;
    };
    lokasi: {
        nama: string;
    };
    relasi: {
        kelas: {
            id: number;
            nama: string;
        } | null;
        dibuat_oleh: {
            id: number;
            nama: string;
        };
    };
    metadata: {
        created_at: string;
        updated_at: string;
    };
}

// Form types for different schedule types
export interface LatihanWajibFormData {
    nama: string;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi: string;
    status: ScheduleStatus;
}

export interface TrainingCampFormData {
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi: string;
    status: ScheduleStatus;
}

export interface KelasRegulerFormData {
    nama: string;
    hari: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi: string;
    effective_from: string;
    kelas_id: number;
    status: ScheduleStatus;
}

export interface KelasPenggantiFormData {
    nama: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi: string;
    kelas_id: number;
    status: ScheduleStatus;
}

export type EditScheduleFormData =
    | LatihanWajibFormData
    | TrainingCampFormData
    | KelasRegulerFormData
    | KelasPenggantiFormData;
