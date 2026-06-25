import { Clock, User, MapPin } from "lucide-react";

const schedules = [
  {
    day: "Senin",
    time: "15:00 – 16:30",
    location: "Sjdklajdlkajsdlka",
    color: "bg-blue-500",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    day: "Selasa",
    time: "16:45 – 18:15",
    location: "akdjalskdjkasjdas",
    color: "bg-purple-500",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    day: "Rabu",
    time: "18:30 – 20:00",
    location: "aksjdlakjsflkajsf",
    color: "bg-red-500",
    badge: "bg-red-100 text-red-700",
  },
  {
    day: "Kamis",
    time: "10:00 – 12:00",
    location: "asdlkajsdlksajdlka",
    color: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    day: "Minggu",
    time: "10:00 – 12:00",
    location: "ajalksjdlkajsdlk",
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

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 ml-auto">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-red-600" />
                </div>
                <span className="text-sm font-semibold">{schedule.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
