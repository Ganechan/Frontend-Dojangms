export interface MuridDashboardData {
    kelas: {
        total: number
        aktif: string
        terbaru: KelasMurid[]
    }
    jadwal_terdekat: JadwalTerdekat[]
    absensi: {
        statistik: {
            total_pertemuan: number
            hadir: string
            izin: string
            sakit: string
            alpha: string
            persentase_kehadiran: number
        }
        terbaru: RiwayatAbsensi[]
    }
    pengumuman: Pengumuman[]
    prestasi: {
        total_prestasi: number
        total_juara: number
        terbaru: PrestasiItem[]
    }
    ujian: {
        statistik: {
            total: number
            lulus: string
            tidak_lulus: string
            terdaftar: string
        }
        terbaru: UjianTerbaru | null
    }
    kejuaraan_akan_datang: KejuaraanAkanDatang[]
    ujian_akan_datang: UjianAkanDatang[]
}

export interface KelasMurid {
    id: number | string
    nama: string
    deskripsi: string
    status: string
    tanggal_bergabung: string
    jadwal_aktif: number
}

export interface JadwalTerdekat {
    id: number | string
    jadwal_nama: string
    tipe: "kelas" | "latihan_wajib"
    hari: string
    effective_from: string | null
    effective_until: string | null
    tanggal_mulai: string | null
    tanggal_selesai: string | null
    jam_mulai: string
    jam_selesai: string
    lokasi: string
    sumber_nama: string
}

export interface RiwayatAbsensi {
    tanggal: string
    status: string
    catatan: string
    jadwal_nama: string
}

export interface Pengumuman {
    id: number | string
    judul: string
    isi: string
    target_type: string
    target_role: string | null
    kelas_id: number | null
    created_at: string
    tanggal_publish: string
    pembuat_nama: string
}

export interface PrestasiItem {
    id: number | string
    nama_kejuaraan: string
    juara: string
    tanggal: string
}

export interface UjianTerbaru {
    id: number | string
    status: string
    tanggal_lulus: string | null
    tanggal_edit: string | null
    lokasi: string
    tanggal_mulai: string
    tanggal_selesai: string
    belt_asal: string
    belt_tujuan: string
}

export interface KejuaraanAkanDatang {
    id: number | string
    kejuaraan_nama: string
    level: string
    location: string
    start_date: string
    end_date: string
    hari_menuju: number
    cabang: string
}

export interface UjianAkanDatang {
    id: number | string
    level_ujian: string
    lokasi: string
    keterangan: string
    tanggal_mulai: string
    tanggal_selesai: string
    hari_menuju: number
    status_peserta: string
    belt_asal: string
    belt_tujuan: string
}
