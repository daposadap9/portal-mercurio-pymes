import React from 'react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const SocialWhatsAppPanel = ({ 
  phoneNumber, 
  message = "¡Hola! Quiero más información.", 
  className = "" 
}) => {
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const containerSize = "w-12 h-12";
  const iconSize = 32;

  return (
    <div className={`fixed right-3 bottom-10 z-[10] flex flex-col items-center space-y-3 ${className}`}>
      {/* Botón de WhatsApp */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          flex items-center justify-center 
          ${containerSize} 
          bg-green-500 hover:bg-green-600 
          text-white rounded-full 
          transform transition-all duration-300 hover:scale-110
        `}
      >
        <FaWhatsapp size={iconSize} />
      </a>

      {/* Grupo de redes sociales vertical */}
      <div className="flex flex-col items-center space-y-3">
        {/* Instagram */}
        <a 
          href="https://www.instagram.com/servisoftsa/#" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`
            flex items-center justify-center ${containerSize} 
            text-blue-600 hover:text-blue-400 transition-colors duration-300 
            rounded-full bg-white shadow border border-gray-200
          `}
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
        >
          <FaInstagram size={iconSize} />
        </a>
        {/* Servisoft */}
        <a 
          href="https://servisoft.co/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`
            flex items-center justify-center ${containerSize} 
            hover:opacity-80 transition-opacity duration-300 
            rounded-full bg-white shadow border border-gray-200
          `}
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
        >
          <img src="/servisoft.png" alt="Servisoft" className="w-6 h-6 object-contain" />
        </a>
      </div>
    </div>
  );
};

export default SocialWhatsAppPanel;
