import React, { useState } from 'react';
import { FaInstagram, FaInfoCircle } from 'react-icons/fa';
import Loading from './loading';

const Footer = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setPdfLoaded(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <footer className="bg-white">
        <div className="container px-4 mx-auto">
          {/* Contenido principal con altura reducida */}
          <div className="py-2 flex flex-col md:flex-row items-center justify-evenly">
            {/* Logo: se usa el PNG */}
            <a href="#" className="mb-2 md:mb-0">
              <img src="/logo-servisoft-30years.png" alt="Servisoft 30 Years" className="h-8 w-auto" />
            </a>
            {/* Enlaces combinados */}
            <div className="flex flex-wrap justify-center items-center space-x-4">
              <a href="/contact" className="text-sm text-black hover:text-black font-medium">Contactanos</a>
              <a href="/careers" className="text-sm text-black hover:text-black font-medium">Servicios</a>
              <a href="/careers" className="text-sm text-black hover:text-black font-medium">Cotiza tu servicio</a>
              <a 
                href="https://www.instagram.com/servisoftsa/#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-black hover:text-black font-medium"
              >
                <FaInstagram size={16} />
              </a>
              <a 
                href="https://servisoft.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-black hover:text-black font-medium"
              >
                <img src="/servisoft.png" alt="Servisoft" className="h-6 w-auto" />
              </a>
              <a 
                href="#"
                onClick={openModal}
                className="flex items-center text-sm text-black hover:text-black font-medium"
              >
                <FaInfoCircle size={16} className="mr-1" />
                <span>Información Legal</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-black w-9/12 mx-auto"></div>
        <div className="container px-4 mx-auto">
          <p className="py-2 text-xs text-black font-medium text-center">
            © 2025 Servisoft todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modal para Información Legal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
          <div className="relative bg-white rounded-lg shadow-2xl p-4 w-full max-w-3xl mx-auto overflow-auto h-[70vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex-1 text-center">Información Legal</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-900 font-bold text-2xl">
                &times;
              </button>
            </div>
            <div className="w-full" style={{ height: 'calc(100% - 60px)' }}>
              {!pdfLoaded && <Loading />}
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
