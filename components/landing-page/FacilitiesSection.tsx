import { Layers, Maximize2, Package, ShowerHead } from "lucide-react";

const facilities = [
  {
    title: "Matras Berkualitas",
    desc: "Matras premium bersertifikasi WTF untuk keselamatan dan kenyamanan latihan maksimal.",
    icon: <Layers size={26} />,
    gradient: "from-red-500 to-orange-400",
  },
  {
    title: "Ruang Luas",
    desc: "Area latihan lapang dan berventilasi baik, ideal untuk semua gerakan dan teknik.",
    icon: <Maximize2 size={26} />,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Peralatan Lengkap",
    desc: "Peralatan target, body protector, dan semua alat latihan tersedia dalam kondisi prima.",
    icon: <Package size={26} />,
    gradient: "from-purple-500 to-violet-400",
  },
];

export default function FacilitiesSection() {
  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="absolute right-0 top-1/2 w-96 h-96 bg-red-50 rounded-full blur-3xl opacity-70 translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative">
        {/* Label */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-red-500 rounded" />
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
            Infrastruktur
          </span>
          <div className="h-px w-8 bg-red-500 rounded" />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-center text-gray-900 mb-4">
          Fasilitas <span className="text-red-500">Dojang</span>
        </h2>
        <p className="text-gray-500 text-center mb-16 max-w-md mx-auto">
          Kami menyediakan fasilitas berstandar tinggi untuk mendukung setiap sesi latihan.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${facility.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${facility.gradient} text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {facility.icon}
              </div>

              {/* Content */}
              <h3 className="font-black text-lg text-gray-900 mb-2">{facility.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{facility.desc}</p>

              {/* Bottom accent */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${facility.gradient} transition-all duration-500 rounded-b-2xl`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
