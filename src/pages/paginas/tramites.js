import React from 'react';
import Link from 'next/link';
import { 
  FaFileInvoiceDollar, 
  FaCommentAlt, 
  FaListAlt, 
  FaInfoCircle 
} from 'react-icons/fa';
import { useDropdown } from '@/context/DropdownContext';

const Tramites = () => {
  const { dropdownActive } = useDropdown();
    
    // Eliminar el estado local y usar directamente el contexto
    const isAnyDropdownActive = dropdownActive.services || dropdownActive.tramites;
  const cards = [
    { 
      title: "PAGA TU FACTURA", 
      icon: <FaFileInvoiceDollar className="text-6xl text-green-500" />, 
      buttonText: "Pagar factura",
      action: () => alert("Pagar factura")
    },
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
      {/* Contenedor centrado y con ancho máximo */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="cursor-pointer bg-white rounded-lg shadow-lg p-6 flex flex-col items-center group transition-transform transform hover:scale-105 hover:bg-teal-600 transition-colors duration-300"
            >
              {/* Contenedor para el ícono con efecto de sombra en hover */}
              <div className="transition-all duration-300 group-hover:drop-shadow-[0_0_3px_rgba(0,0,0,0.9)]">
                {card.icon}
              </div>
              <h3 className="mt-4 text-center text-lg font-bold group-hover:text-white">
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tramites;
