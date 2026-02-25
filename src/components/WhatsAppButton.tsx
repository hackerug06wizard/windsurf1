'use client';

import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export default function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I\'m interested in your baby products. Can you help me?');
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-40 group"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Chat with us on WhatsApp
      </span>
    </button>
  );
}
