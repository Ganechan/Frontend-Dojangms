import { Clock, Users, Zap, Star } from "lucide-react";

const programs = [
  {
    title: "Kelas Anak",
    age: "5 – 12 Tahun",
    schedule: "Senin – Jumat · 15:00–16:30",
    benefits: ["Disiplin", "Kepercayaan Diri", "Kebugaran"],
    icon: <Users size={28} />,
    color: "from-blue-500 to-cyan-400",
    bg: "from-blue-50 to-cyan-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    title: "Kelas Remaja",
    age: "13 – 17 Tahun",
    schedule: "Senin – Jumat · 16:45–18:15",
    benefits: ["Teknik Lanjutan", "Kompetisi", "Leadership"],
    icon: <Zap size={28} />,
    color: "from-purple-500 to-violet-400",
    bg: "from-purple-50 to-violet-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    title: "Kelas Dewasa",
    age: "18+ Tahun",
    schedule: "Senin – Jumat · 18:30–20:00",
    benefits: ["Fitness", "Self-Defense", "Mental"],
    icon: <Star size={28} />,
    color: "from-red-500 to-orange-400",
    bg: "from-red-50 to-orange-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-700",
  },
  {
    title: "Kelas Prestasi",
    age: "Seleksi Atlet",
    schedule: "Sabtu – Minggu · 10:00–12:00",
    benefits: ["Persiapan Kompetisi", "Program Intensif", "Mentoring"],
    icon: <Clock size={28} />,
    color: "from-amber-500 to-yellow-400",
    bg: "from-amber-50 to-yellow-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
];

export default function ProgramsSection() {
  return (
    <section id="programs" className="py-24 px-4 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-40 translate-x-1/2 translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-500 rounded" />
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
            Kelas Latihan
          </span>
          <div className="h-px w-8 bg-red-500 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-4">
          Program <span className="text-red-500">Latihan</span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-md mx-auto">
          Pilih program yang sesuai dengan usia dan tujuan latihanmu bersama instruktur berpengalaman.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${program.bg} border ${program.border} rounded-2xl p-6 hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 cursor-default`}
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${program.color} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {program.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-gray-900 mb-1">{program.title}</h3>

              {/* Age badge */}
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${program.badge}`}>
                {program.age}
              </span>

              {/* Schedule */}
              <p className="text-xs text-gray-500 mb-5 flex items-center gap-1.5">
                <Clock size={12} className="flex-shrink-0" />
                {program.schedule}
              </p>

              {/* Benefits */}
              <div className="space-y-2">
                {program.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${program.color}`} />
                    <span className="text-sm text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
