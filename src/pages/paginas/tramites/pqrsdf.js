// pages/pqrsdf.js
import React from 'react';
import { 
  FaPenFancy, 
  FaAngry, 
  FaCommentDots, 
  FaClipboardCheck, 
  FaGavel, 
  FaSmileBeam 
} from 'react-icons/fa';

const PQRSDFPage = () => {
  const cards = [
    { 
      title: "Ingresa una petición", 
      marker: "15 días hábiles", 
      icon: <FaPenFancy className="text-6xl text-blue-500" /> 
    },
    { 
      title: "Ingresa una queja", 
      marker: "15 días hábiles", 
      icon: <FaAngry className="text-6xl text-purple-500" /> 
    },
    { 
      title: "Ingresa un reclamo", 
      marker: "15 días hábiles", 
      icon: <FaCommentDots className="text-6xl text-green-500" /> 
    },
    { 
      title: "Ingresa una solicitud", 
      marker: "15 días hábiles", 
      icon: <FaClipboardCheck className="text-6xl text-teal-500" /> 
    },
    { 
      title: "Ingresa una denuncia", 
      marker: "10 días hábiles", 
      icon: <FaGavel className="text-6xl text-red-500" /> 
    },
    { 
      title: "Ingresa una felicitación", 
      marker: "15 días hábiles", 
      icon: <FaSmileBeam className="text-6xl text-amber-500" /> 
    },
  ];

  return (
    <div className="min-h-screen bg-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-teal-600 mb-8 text-center">
        Selecciona el tipo de solicitud que vas a radicar.
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white border rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105"
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
