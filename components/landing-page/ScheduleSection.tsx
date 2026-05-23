import { Clock, User } from "lucide-react";

const schedules = [
  {
    day: "Senin – Jumat",
    time: "15:00 – 16:30",
    category: "Anak-anak",
    trainer: "Trainer Junior",
    color: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    day: "Senin – Jumat",
    time: "16:45 – 18:15",
    category: "Remaja",
    trainer: "Trainer Senior",
    color: "bg-purple-500",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    day: "Senin – Jumat",
    time: "18:30 – 20:00",
    category: "Dewasa",
    trainer: "Master Utama",
    color: "bg-red-500",
    badge: "bg-red-100 text-red-700",
  },
  {
    day: "Sabtu",
    time: "10:00 – 12:00",
    category: "Prestasi",
    trainer: "Master & Pelatih",
    color: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    day: "Minggu",
    time: "10:00 – 12:00",
    category: "Poomsae",
    trainer: "Spesialis",
    color: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
];

export default function ScheduleSection() {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute right-0 bottom-0 w-72 h-72 bg-red-50 rounded-full blur-3xl opacity-60 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-5xl mx-auto relative">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-500 rounded" />
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
            Waktu Latihan
          </span>
          <div className="h-px w-8 bg-red-500 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-4">
          Jadwal <span className="text-red-500">Latihan</span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-md mx-auto">
          Temukan waktu latihan yang paling sesuai dengan jadwal aktivitasmu.
        </p>

        {/* Cards layout */}
        <div className="space-y-4">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 hover:shadow-lg hover:border-red-200 hover:bg-white transition-all duration-300"
            >
              {/* Color bar */}
              <div className={`hidden sm:block w-1 h-12 ${schedule.color} rounded-full flex-shrink-0`} />

              {/* Day */}
              <div className="min-w-[140px]">
                <p className="font-black text-gray-900 text-base">{schedule.day}</p>
                <div className="flex items-center gap-1.5 mt-1 text-gray-500 text-sm">
                  <Clock size={12} />
                  <span>{schedule.time}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block h-10 w-px bg-gray-200" />

              {/* Category */}
              <div className="flex-1">
                <span
                  className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${schedule.badge}`}
                >
                  {schedule.category}
                </span>
              </div>

              {/* Trainer */}
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-red-600" />
                </div>
                <span className="text-sm font-semibold">{schedule.trainer}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
