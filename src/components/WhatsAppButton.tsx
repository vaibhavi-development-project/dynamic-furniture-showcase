import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getContact } from "@/lib/data";

export function WhatsAppButton() {
  const [num, setNum] = useState("");
  useEffect(() => {
    const sync = () => setNum(getContact().whatsapp);
    sync();
    window.addEventListener("maisonor:data", sync);
    return () => window.removeEventListener("maisonor:data", sync);
  }, []);
  if (!num) return null;
  return (
    <a
      href={`https://wa.me/${num.replace(/[^0-9]/g, "")}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-primary/40 blur-xl group-hover:bg-primary/60 transition" />
      <span className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-gold hover:scale-110 transition-transform duration-500">
        <MessageCircle size={22} />
      </span>
    </a>
  );
}
