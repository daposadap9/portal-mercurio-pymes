// pages/pqrsdf.js
import React from 'react';
import { useRouter } from 'next/router';
import { 
  FaPenFancy, 
  FaAngry, 
  FaCommentDots, 
  FaClipboardCheck, 
  FaGavel, 
  FaSmileBeam 
} from 'react-icons/fa';

const PQRSDFPage = () => {
  const router = useRouter();

  // Definimos las cards con el título (tipo de solicitud), el plazo y el ícono.
  // Se ha ajustado el título para que sea el tipo que se enviará.
  const cards = [
    { 
      title: "Petición", 
      marker: "15 días hábiles", 
      icon: <FaPenFancy className="text-6xl text-blue-500" /> 
    },
    { 
      title: "Queja", 
      marker: "15 días hábiles", 
      icon: <FaAngry className="text-6xl text-purple-500" /> 
    },
    { 
      title: "Reclamo", 
      marker: "15 días hábiles", 
      icon: <FaCommentDots className="text-6xl text-green-500" /> 
    },
    { 
      title: "Solicitud", 
      marker: "15 días hábiles", 
      icon: <FaClipboardCheck className="text-6xl text-teal-500" /> 
    },
    { 
      title: "Denuncia", 
      marker: "10 días hábiles", 
      icon: <FaGavel className="text-6xl text-red-500" /> 
    },
    { 
      title: "Felicitación", 
      marker: "15 días hábiles", 
      icon: <FaSmileBeam className="text-6xl text-amber-500" /> 
    },
  ];

  // Al hacer clic en una card, se navega a la ruta del formulario y se pasa el tipo de solicitud en la query.
  const handleCardClick = (tipoSolicitud) => {
    router.push({
      pathname: '/paginas/tramites/pqrsdf/formularioPQRSDF',
      query: { tipoSolicitud }
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-teal-600 mb-8 text-center">
        Selecciona el tipo de solicitud que vas a radicar.
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card.title)}
            className="cursor-pointer bg-white border rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105"
          >
            {card.icon}
            <h2 className="mt-4 text-xl font-bold text-center">{card.title}</h2>
            <span className="mt-2 inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
              {card.marker}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PQRSDFPage;
