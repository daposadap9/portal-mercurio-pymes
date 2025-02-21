import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.3, // 0.3 segundos de retraso entre cada icono
    },
  },
};

const iconVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 30,
      ease: "easeInOut",
    },
  },
};

// Variante exclusiva para WhatsApp usando spring con dos keyframes
const whatsappIconVariant = {
  initial: { y: 0 },
  animate: {
    y: [-25, 0],
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 10,
      repeat: Infinity,
      repeatDelay: 30,
    },
  },
};

const SocialWhatsAppPanel = ({ 
  phoneNumber, 
  message = "¡Hola! Quiero más información.", 
  className = "" 
}) => {
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const containerSize = "w-12 h-12";
  const iconSize = 32;

  return (
    <motion.div 
      className={`fixed right-3 bottom-10 z-[10] flex flex-col items-center space-y-3 ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {/* Botón de WhatsApp */}
      <motion.a
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
        variants={whatsappIconVariant}
      >
        <FaWhatsapp size={iconSize} />
      </motion.a>

      {/* Grupo de redes sociales vertical */}
      <div className="flex flex-col items-center space-y-3">
        {/* Instagram */}
        <motion.a 
          href="https://www.instagram.com/servisoftsa/#" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`
            flex items-center justify-center ${containerSize} 
            text-blue-600 hover:text-blue-400 transition-colors duration-300 
            rounded-full bg-white shadow border border-gray-200
          `}
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
          variants={iconVariants}
        >
          <FaInstagram size={iconSize} />
        </motion.a>
        {/* Servisoft */}
        <motion.a 
          href="https://servisoft.co/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`
            flex items-center justify-center ${containerSize} 
            hover:opacity-80 transition-opacity duration-300 
            rounded-full bg-white shadow border border-gray-200
          `}
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
          variants={iconVariants}
        >
          <img src="/servisoft.webp" alt="Servisoft" className="w-6 h-6 object-contain" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default SocialWhatsAppPanel;
