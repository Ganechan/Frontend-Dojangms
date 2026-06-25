// types\admin\anggota.ts

// Representasi anggota yang sudah dinormalisasi untuk dipakai di frontend
// Field names mengikuti response API backend
export interface Anggota {
    id: number;
    name: string;
    email: string;
    phone: string;
    tanggal_lahir: string;
    status: 'active' | 'inactive';
    role: 'murid' | 'pelatih' | 'admin';
    created_at: string;
    updated_at?: string;
    // Murid-specific
    current_belt?: string;
    belt_achieved_at?: string;
    // Pelatih-specific
    foto?: string | null;
    jenis_kelamin?: string | null;
    alamat?: string | null;
    tanggal_bergabung?: string;
    pelatih?: {
        spesialisasi: string;
        bio: string | null;
    };
    sabuk_saat_ini?: {
        id: number;
        name: string;
        achieved_at: string;
    };
}

export interface Murid extends Anggota {
    role: 'murid';
    current_belt: string;
    belt_achieved_at: string;
}

export interface Pelatih extends Anggota {
    role: 'pelatih';
    pelatih: {
        spesialisasi: string;
        bio: string | null;
    };
    sabuk_saat_ini: {
        id: number;
        name: string;
        achieved_at: string;
    };
}

export interface Admin extends Anggota {
    role: 'admin';
}

export interface AnggotaStats {
    total_murid: number;
    active_murid: number;
    inactive_murid: number;
    total_pelatih: number;
    active_pelatih: number;
    inactive_pelatih: number;
    total_admin: number;
    active_admin: number;
    inactive_admin: number;
    total_members: number;
    active_members: number;
    inactive_members: number;
}

export interface BeltDistribution {
    belt_name: string;
    count: number;
}

export interface AnggotaApiResponse<T> {
    message: string;
    summary?: Record<string, unknown>;
    data: T[];
    pagination?: {
        page: number;
        limit: number;
        total_data: number;
        total_page: number;
        has_prev: boolean;
        has_next: boolean;
    };
}

export interface StatsCounts {
    role: 'murid' | 'pelatih' | 'admin';
    total: number;
    active: number;
    inactive: number;
}
