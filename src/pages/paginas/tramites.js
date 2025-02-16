import React from 'react';
import Link from 'next/link';
import { 
  FaFileInvoiceDollar, 
  FaCommentAlt, 
  FaListAlt, 
  FaInfoCircle 
} from 'react-icons/fa';

const Tramites = () => {
  const cards = [
    { 
      title: "PAGA TU FACTURA", 
      icon: <FaFileInvoiceDollar className="text-6xl text-teal-600" />, 
      buttonText: "Pagar factura",
      action: () => alert("Pagar factura")
    },
    { 
      title: "PQRSDF", 
      icon: <FaCommentAlt className="text-6xl text-purple-600" />, 
      buttonText: "Enviar PQRSDF",
      href: "/paginas/tramites/pqrsdf"
    },
    { 
      title: "SOLICITUDES MERCURIO CLIENTES", 
      icon: <FaListAlt className="text-6xl text-blue-600" />, 
      buttonText: "Ver solicitudes",
      action: () => alert("Ver solicitudes")
    },
    { 
      title: "CONSULTA ESTADO DE SOLICITUD", 
      icon: <FaInfoCircle className="text-6xl text-amber-600" />, 
      buttonText: "Consultar estado",
      action: () => alert("Consultar estado")
    }
  ];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-105"
          >
            {card.icon}
            <h3 className="mt-4 text-center text-lg font-bold">{card.title}</h3>
            {card.action ? (
              <button 
                onClick={card.action}
                className="mt-6 bg-teal-500 text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-teal-600"
              >
                {card.buttonText}
              </button>
            ) : (
              <Link href={card.href} legacyBehavior>
                <a className="mt-6 bg-teal-500 text-white px-4 py-2 rounded-md transition-colors duration-300 hover:bg-teal-600">
                  {card.buttonText}
                </a>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tramites;
