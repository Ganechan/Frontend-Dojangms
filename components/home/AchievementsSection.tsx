import { Award } from "lucide-react";

export default function AchievementsSection() {
  const achievements = [
    "Juara Umum Kompetisi Taekwondo Kota Salatiga 2023",
    "Medali Emas Kejuaraan Tingkat Provinsi 2023",
    "Atlet Terbaik Kategori -54kg Nasional",
    "Tim Poomsae Perak Kejuaraan Nasional",
    "Juara Kelas Individu Putra & Putri",
    "Penghargaan Dedikasi Dojang Terbaik",
  ];

  return (
    <section id="achievements" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Prestasi & Penghargaan
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-primary/5 border-l-4 border-primary p-6 rounded hover:shadow-lg transition"
            >
              <div className="flex items-start gap-3">
                <Award className="text-primary mt-1 flex-shrink-0" size={24} />
                <p className="text-gray-800">{achievement}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
