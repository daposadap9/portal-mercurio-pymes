import React, { useContext } from 'react';
import Link from 'next/link';
import { 
  FaFileInvoiceDollar, 
  FaCommentAlt, 
  FaListAlt, 
  FaInfoCircle 
} from 'react-icons/fa';
import { useDropdown } from '@/context/DropdownContext';
import { ThemeContext } from '@/context/ThemeContext';

const Tramites = () => {
  const { dropdownActive } = useDropdown();
  const { theme } = useContext(ThemeContext);

  // Define el fondo según el tema
  const cardBgClass =
    theme === 'dark'
      ? 'bg-custom-gradient'
      : theme === 'purple'
      ? 'bg-custom-gradient2'
      : 'bg-custom-gradient3';

  const isAnyDropdownActive = dropdownActive.services || dropdownActive.tramites;

  const cards = [
    { 
      title: "PQRSDF", 
      icon: <FaCommentAlt className="text-6xl text-purple-400" />, 
      buttonText: "Enviar PQRSDF",
      href: "/paginas/tramites/pqrsdf"
    },
    { 
      title: "SOLICITUDES MERCURIO CLIENTES", 
      icon: <FaListAlt className="text-6xl text-blue-400" />, 
      buttonText: "Ver solicitudes",
      href: "/paginas/tramites/solicitudesMercurio"
    },
    { 
      title: "CONSULTA ESTADO DE SOLICITUD", 
      icon: <FaInfoCircle className="text-6xl text-amber-600" />, 
      buttonText: "Consultar estado",
      href: "/paginas/tramites/estadoSolicitud"
    }
  ];

  return (
    <div className={`p-4 transition-all duration-500 ease-in-out ${isAnyDropdownActive ? "mt-24" : ""}`}>
      {/* Contenedor centrado con ancho máximo */}
      <div className="max-w-6xl mx-auto">
        {/* Usamos flex-wrap para centrar las cards, con el gap adecuado */}
        <div className="flex flex-wrap justify-center gap-8">
          {cards.map((card, index) => (
            <div 
              key={index}
              className={`
                cursor-pointer w-60 h-60 rounded-lg shadow-lg p-6 flex flex-col items-center group 
                transition-transform transform hover:scale-105 transition-colors duration-300
                relative overflow-hidden border-2 border-white/30
              `}
            >
              {/* Capa de fondo dinámico */}
              <div className={`absolute inset-0 ${cardBgClass} transition-opacity duration-300 group-hover:opacity-0`}></div>
              {/* Capa de fondo sólido teal para hover */}
              <div className="absolute inset-0 bg-teal-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              
              {/* Contenedor interno centrado (tanto horizontal como verticalmente) */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
                <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_3px_rgba(0,0,0,0.9)]">
                  {card.icon}
                </div>
                <h3 className="mt-4 text-lg font-bold group-hover:text-white">
                  {card.title}
                </h3>
                {card.action ? (
                  <button 
                    onClick={card.action}
                    className="mt-6 bg-teal-500 text-white px-4 py-2 rounded-md transition-colors duration-300 group-hover:bg-transparent group-hover:text-white group-hover:border group-hover:border-white"
                  >
                    {card.buttonText}
                  </button>
                ) : (
                  <Link href={card.href} legacyBehavior>
                    <a className="mt-6 bg-teal-500 text-white px-4 py-2 rounded-md transition-colors duration-300 group-hover:bg-transparent group-hover:text-white group-hover:border group-hover:border-white">
                      {card.buttonText}
                    </a>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tramites;
