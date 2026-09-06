import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export const WhatsAppButton: React.FC = () => (
  <a
    href={`https://wa.me/${siteConfig.whatsappNumber}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:shadow-emerald-500/40 hover:scale-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
  >
    <MessageCircle className="h-6 w-6 fill-current" />
  </a>
);
