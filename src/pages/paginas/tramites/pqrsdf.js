// pages/pqrsdf.js
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FaPenFancy, 
  FaAngry, 
  FaCommentDots, 
  FaClipboardCheck, 
  FaGavel, 
  FaSmileBeam 
} from 'react-icons/fa';
import { ThemeContext } from '@/context/ThemeContext'; // Ajusta la ruta según tu estructura

const PQRSDFPage = () => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  // Define el fondo dinámico según el tema
  const cardBgClass =
    theme === 'dark'
      ? 'bg-custom-gradient'
      : theme === 'purple'
      ? 'bg-custom-gradient2'
      : 'bg-custom-gradient3';

  // Cada tarjeta tiene un título, tipo, marker y un icono
  const cards = [
    { 
      title: "Ingresa una Petición",
      tipo: "Petición",
      marker: "15 días hábiles", 
      icon: <FaPenFancy className="text-6xl text-blue-400" /> 
    },
    { 
      title: "Ingresa una Queja",
      tipo: "Queja",
      marker: "15 días hábiles", 
      icon: <FaAngry className="text-6xl text-purple-400" /> 
    },
    { 
      title: "Ingresa un Reclamo",
      tipo: "Reclamo",
      marker: "15 días hábiles", 
      icon: <FaCommentDots className="text-6xl text-green-500" /> 
    },
    { 
      title: "Ingresa una Solicitud",
      tipo: "Solicitud",
      marker: "15 días hábiles", 
      icon: <FaClipboardCheck className="text-6xl text-teal-500" /> 
    },
    { 
      title: "Ingresa una Denuncia",
      tipo: "Denuncia",
      marker: "10 días hábiles", 
      icon: <FaGavel className="text-6xl text-red-500" /> 
    },
    { 
      title: "Ingresa una Felicitación",
      tipo: "Felicitación",
      marker: "15 días hábiles", 
      icon: <FaSmileBeam className="text-6xl text-amber-500" /> 
    },
  ];

  // Al hacer clic se envía el "tipo" a la ruta del formulario
  const handleCardClick = (tipoSolicitud) => {
    router.push({
      pathname: '/paginas/tramites/pqrsdf/formularioPQRSDF',
      query: { tipoSolicitud }
    });
  };

  return (
    <div className="min-h-full p-4 flex flex-col items-center">
      {/* Mensaje superior */}
      <div className="mb-9">
        <p className="text-lg text-teal-600 font-extrabold p-6 rounded-md">
          Aquí podrás registrar tus peticiones, quejas, reclamos o recursos, 
          los cuales gestionaremos en días hábiles y de lunes a viernes de 7 a. m. a 5:00 p. m.
        </p>
      </div>
      <h1 className="text-3xl font-bold text-teal-600 mb-8 text-center">
        Selecciona el tipo de solicitud que vas a radicar.
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card.tipo)}
            className={`
              cursor-pointer 
              relative overflow-hidden 
              border rounded-xl shadow-lg p-6 flex flex-col items-center group 
              transition-transform transform hover:scale-105 
              transition-colors duration-300 border-2 border-white/30
            `}
          >
            {/* Capa de fondo dinámico (según el tema) */}
            <div className={`absolute inset-0 ${cardBgClass} transition-opacity duration-300 group-hover:opacity-0`}></div>
            {/* Capa de fondo sólido teal que aparece en hover */}
            <div className="absolute inset-0 bg-teal-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            {/* Contenido en primer plano, centrado */}
            <div className="relative z-10 w-full flex flex-col items-center text-center">
              <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_3px_rgba(0,0,0,0.9)]">
                {card.icon}
              </div>
              <h2 className="mt-4 text-xl font-bold group-hover:text-white">
                {card.title}
              </h2>
              <span className="mt-2 inline-block bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold border-2 border-transparent group-hover:bg-transparent group-hover:text-white group-hover:border-white transition-colors duration-300">
                {card.marker}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-9 mt-12">
        <p className="text-lg text-teal-600 font-extrabold p-6 rounded-md">
          Si estás conectado(a) desde una red corporativa o mediante conexión VPN, deshabilita el proxy para que este formulario funcione correctamente.
        </p>
      </div>
    </div>
  );
};

export default PQRSDFPage;
