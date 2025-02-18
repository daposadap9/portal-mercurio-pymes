import React, { useState } from 'react';
import { FaInstagram, FaInfoCircle } from 'react-icons/fa';

const Footer = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-teal-600 via-blue-800 to-teal-600 text-white py-4 shadow-xl z-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
          {/* Sección izquierda */}
          <div className="flex-1 text-center">
            <p
              className="text-sm md:text-base font-semibold"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              ServiSoft S.A. | Gestión Documental, Mercurio BPM, ECM, Custodia documental, Digitalización de documentos - servisoft 2025 todos los derechos reservados
            </p>
          </div>
          
          {/* Separador: vertical en desktop */}
          <div className="hidden md:block h-8 w-px bg-white mx-4"></div>
          {/* Separador: horizontal en mobile */}
          <div className="block md:hidden w-full h-px bg-white my-2"></div>
          
          {/* Sección derecha */}
          <div className="flex-1 text-center">
            <p
              className="text-sm md:text-base font-semibold mb-2"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
            >
              ¡Explora nuestros enlaces!
            </p>
            <div className="flex justify-center items-center space-x-4">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/servisoftsa/#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-300"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                <FaInstagram size={24} />
              </a>
              {/* Servisoft: redirecciona a servisoft.co y muestra la imagen /servisoft.png */}
              <a 
                href="https://servisoft.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-300"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                <img src="/servisoft.png" alt="Servisoft" className="w-6 h-6" />
              </a>
              {/* Información Legal: abre modal con el PDF */}
              <a 
                href="#"
                onClick={openModal}
                className="flex items-center hover:text-gray-300"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                <FaInfoCircle size={24} className="mr-1" />
                <span className="text-sm md:text-base font-semibold">Información Legal</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Modal para mostrar el PDF de Información Legal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div 
            className="bg-white rounded-lg shadow-2xl p-6 relative w-full max-w-4xl h-[90%] overflow-hidden"
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 font-bold text-3xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Información Legal</h2>
            <div className="w-full h-full">
              <iframe 
                src="/InformaciónLegal.pdf" 
                title="Información Legal" 
                className="w-full h-full"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
