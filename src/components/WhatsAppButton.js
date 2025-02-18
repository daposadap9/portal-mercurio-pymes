import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = ({ 
  phoneNumber, 
  message = "¡Hola! Quiero más información.", 
  className = "" 
}) => {
  // Construimos el enlace con el número (formato internacional sin símbolos)
  const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-40 right-6 z-[10] flex items-center justify-center w-20 h-20 bg-green-500 hover:bg-green-600 text-white rounded-full transform transition-all duration-300 hover:scale-110 ${className}`}
    >
      <FaWhatsapp size={50} />
    </a>
  );
};

export default WhatsAppButton;
