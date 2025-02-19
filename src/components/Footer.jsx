import React, { useState } from 'react';
import { FaInstagram, FaInfoCircle } from 'react-icons/fa';

const Footer = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setPdfLoaded(false); // Reiniciamos el estado de carga
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* Footer: en mobile se posiciona en el flujo y en md se fija */}
      <footer className="mt-auto relative md:fixed md:bottom-0 md:left-0 w-full bg-gradient-to-r from-teal-600 via-blue-800 to-teal-600 text-white py-4 shadow-xl z-10 md:z-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
          {/* Sección izquierda */}
          <div className="flex-1 text-center">
            <p className="text-sm md:text-base font-semibold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              ServiSoft S.A. | Gestión Documental, Mercurio BPM, ECM, Custodia documental, Digitalización de documentos - servisoft 2025 todos los derechos reservados
            </p>
          </div>
          
          {/* Separador: vertical en desktop */}
          <div className="hidden md:block h-8 w-px bg-white mx-4"></div>
          {/* Separador: horizontal en mobile */}
          <div className="block md:hidden w-full h-px bg-white my-2"></div>
          
          {/* Sección derecha */}
          <div className="flex-1 text-center">
            <p className="text-sm md:text-base font-semibold mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
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
              {/* Servisoft */}
              <a 
                href="https://servisoft.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-300"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                <img src="/servisoft.webp" alt="Servisoft" className="w-6 h-6" />
              </a>
              {/* Información Legal: abre modal */}
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
      
      {/* Modal para mostrar el PDF */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Fondo semitransparente */}
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
          {/* Contenedor de la modal */}
          <div className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl mx-auto my-4 overflow-auto h-[50vh] md:h-[70vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-center flex-1">Información Legal</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-900 font-bold text-3xl">
                &times;
              </button>
            </div>
            <div className="w-full" style={{ height: 'calc(100% - 120px)' }}>
              {/* Spinner de carga */}
              {!pdfLoaded && (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-teal-500 border-gray-200"></div>
                </div>
              )}
              <iframe
                onLoad={() => setPdfLoaded(true)}
                src="/InformaciónLegal.pdf"
                className={`w-full h-full ${!pdfLoaded ? 'hidden' : ''}`}
                title="Información Legal"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
