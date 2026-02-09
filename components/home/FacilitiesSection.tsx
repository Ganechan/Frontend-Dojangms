import { Trophy } from "lucide-react";

export default function FacilitiesSection() {
  const facilities = [
    {
      title: "Matras Berkualitas",
      desc: "Matras premium untuk keselamatan",
    },
    {
      title: "Ruang Luas",
      desc: "Area latihan yang nyaman dan luas",
    },
    {
      title: "Peralatan Lengkap",
      desc: "Semua alat latihan tersedia",
    },
    {
      title: "Loker & Fasilitas",
      desc: "Tempat penyimpanan dan kamar mandi",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Fasilitas</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{facility.title}</h3>
              <p className="text-gray-600 text-sm">{facility.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
