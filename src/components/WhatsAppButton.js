import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = ({ 
  phoneNumber, 
  message = "¡Hola! Quiero más información.", 
  className = "" 
}) => {
  // Construimos el enlace en formato internacional
  const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed right-3
        md:bottom-48 bottom-44
        z-[10] 
        flex items-center justify-center 
        w-16 h-16 
        bg-green-500 hover:bg-green-600 
        text-white rounded-full 
        transform transition-all duration-300 hover:scale-110 
        ${className}
      `}
    >
      <FaWhatsapp size={45} />
    </a>
  );
};

export default WhatsAppButton;
