import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/628123456789?text=Halo%20Dojang%20Joko%20Tingkir%20Salatiga"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40 animate-pulse"
    >
      <MessageCircle size={24} />
    </a>
  );
}
