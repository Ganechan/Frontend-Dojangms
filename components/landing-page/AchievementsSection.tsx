import { Award, Medal, Star, Trophy } from "lucide-react";

const achievements = [
  {
    text: "Juara Umum Kompetisi Taekwondo Kota Salatiga 2023",
    icon: <Trophy size={20} />,
    year: "2023",
    color: "from-yellow-500 to-amber-400",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    textColor: "text-yellow-700",
  },
  {
    text: "Medali Emas Kejuaraan Tingkat Provinsi 2023",
    icon: <Medal size={20} />,
    year: "2023",
    color: "from-yellow-400 to-orange-300",
    bg: "bg-orange-50",
    border: "border-orange-200",
    textColor: "text-orange-700",
  },
  {
    text: "Atlet Terbaik Kategori -54kg Nasional",
    icon: <Star size={20} />,
    year: "2023",
    color: "from-red-500 to-pink-400",
    bg: "bg-red-50",
    border: "border-red-200",
    textColor: "text-red-700",
  },
  {
    text: "Tim Poomsae Perak Kejuaraan Nasional",
    icon: <Award size={20} />,
    year: "2023",
    color: "from-slate-500 to-gray-400",
    bg: "bg-slate-50",
    border: "border-slate-200",
    textColor: "text-slate-700",
  },
  {
    text: "Juara Kelas Individu Putra & Putri",
    icon: <Trophy size={20} />,
    year: "2022",
    color: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    textColor: "text-emerald-700",
  },
  {
    text: "Penghargaan Dedikasi Dojang Terbaik",
    icon: <Star size={20} />,
    year: "2022",
    color: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
    border: "border-violet-200",
    textColor: "text-violet-700",
  },
];

export default function AchievementsSection() {
  return (
    <section id="achievements" className="py-24 px-4 bg-gray-50 relative overflow-hidden">
      <div className="absolute left-0 top-0 w-72 h-72 bg-yellow-100 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-500 rounded" />
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
            Piala & Penghargaan
          </span>
          <div className="h-px w-8 bg-red-500 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-4">
          Prestasi &amp; <span className="text-red-500">Penghargaan</span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-md mx-auto">
          Kebanggaan kami yang lahir dari kerja keras atlet dan dedikasi pelatih.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {achievements.map((item, index) => (
            <div
              key={index}
              className={`group relative ${item.bg} border ${item.border} rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
            >
              {/* Year tag */}
              <span className={`absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${item.color} text-white shadow-sm`}>
                {item.year}
              </span>

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                {item.icon}
              </div>

              <p className={`font-semibold text-sm leading-relaxed ${item.textColor}`}>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
