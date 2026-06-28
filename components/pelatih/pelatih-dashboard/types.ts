export interface DashboardData {
    kelas: {
        total: number
        aktif: string | number
        nonaktif: string | number
    }
    murid: {
        total_aktif: number
    }
    absensi: {
        hari_ini: {
            total: number
            hadir: number
            izin: number
            sakit: number
            alpha: number
            persentase_hadir: number
        }
        minggu_ini: {
            total: number
            hadir: string | number
        }
        bulan_ini: {
            total: number
            hadir: string | number
        }
    }
    jadwal_terdekat: JadwalTerdekat[]
    aktivitas_terbaru: Aktivitas[]
    kejuaraan_akan_datang: Kejuaraan[]
    ujian_akan_datang: Ujian[]
}

export interface JadwalTerdekat {
    id: number | string
    jadwal_nama: string
    tipe: string
    hari: string
    effective_from: string | null
    effective_until: string | null
    tanggal_mulai: string | null
    tanggal_selesai: string | null
    jam_mulai: string
    jam_selesai: string
    lokasi: string
    kelas_nama: string
}

export interface Aktivitas {
    tipe: "absensi" | "murid_bergabung" | "ujian" | "kejuaraan"
    deskripsi: string
    waktu: string
}

export interface Kejuaraan {
    id: number | string
    name: string
    level: string
    location: string
    start_date: string
    end_date: string
    hari_menuju: number
}

export interface Ujian {
    id: number | string
    level_ujian: string
    lokasi: string
    keterangan: string
    status: string
    tanggal_mulai: string
    tanggal_selesai: string
    hari_menuju: number
}
