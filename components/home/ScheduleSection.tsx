export default function ScheduleSection() {
  const schedules = [
    {
      day: "Senin - Jumat",
      time: "15:00 - 16:30",
      category: "Anak-anak",
      trainer: "Trainer Junior",
    },
    {
      day: "Senin - Jumat",
      time: "16:45 - 18:15",
      category: "Remaja",
      trainer: "Trainer Senior",
    },
    {
      day: "Senin - Jumat",
      time: "18:30 - 20:00",
      category: "Dewasa",
      trainer: "Master Utama",
    },
    {
      day: "Sabtu",
      time: "10:00 - 12:00",
      category: "Prestasi",
      trainer: "Master & Pelatih",
    },
    {
      day: "Minggu",
      time: "10:00 - 12:00",
      category: "Poomsae",
      trainer: "Spesialis",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Jadwal Latihan</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-6 py-3 text-left">Hari</th>
                <th className="px-6 py-3 text-left">Waktu</th>
                <th className="px-6 py-3 text-left">Kategori</th>
                <th className="px-6 py-3 text-left">Pelatih</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">{schedule.day}</td>
                  <td className="px-6 py-4">{schedule.time}</td>
                  <td className="px-6 py-4">{schedule.category}</td>
                  <td className="px-6 py-4 text-primary font-medium">
                    {schedule.trainer}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
