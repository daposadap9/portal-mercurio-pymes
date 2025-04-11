import React, { useContext, useState } from 'react';
import { FaInstagram, FaInfoCircle, FaTimes } from 'react-icons/fa';
import Loading from './loading';
import { ThemeContext } from '@/context/ThemeContext';
import Link from 'next/link';

const Footer = ({ handleNavigation }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const { theme } = useContext(ThemeContext);

  const openModal = (e) => {
    e.preventDefault();
    setPdfLoaded(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const logoSrc =
    theme === 'dark' || theme === 'purple'
      ? '/logo-servisoft-30years-dark.png'
      : '/logo-servisoft-30years-dark.png';

  const logoStyle =
    theme === 'dark' || theme === 'purple'
      ? { transform: 'scale(2.7)' }
      : { transform: 'scale(2.7)'};

  return (
    <>
      {/* Utilizamos la clase "footer-custom" para aplicar los colores personalizados */}
      <footer className="footer-custom">
        <div className="container px-4 mx-auto">
          <div className="py-2 flex flex-col md:flex-row items-center justify-evenly">
            <Link href="/" legacyBehavior>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('/', true);
                }}
              >
                <img
                  src={logoSrc}
                  alt="Servisoft 30 Years"
                  className="h-10 w-auto"
                  style={logoStyle}
                />
              </a>
            </Link>
            <div className="flex flex-wrap justify-center items-center space-x-4">
              <Link href="/paginas/contactanos" legacyBehavior>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/paginas/contactanos', true);
                  }}
                  className="text-sm font-medium"
                >
                  Contactanos
                </a>
              </Link>
              <Link href="/paginas/servicios" legacyBehavior>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/paginas/servicios', true);
                  }}
                  className="text-sm font-medium"
                >
                  Servicios
                </a>
              </Link>
              <Link href="/paginas/cotizaTuServicio" legacyBehavior>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/paginas/cotizaTuServicio', true);
                  }}
                  className="text-sm font-medium"
                >
                  Cotiza tu servicio
                </a>
              </Link>
              <a 
                href="https://www.instagram.com/servisoftsa/#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium"
              >
                <FaInstagram size={16} />
              </a>
              <a 
                href="https://servisoft.co/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium"
              >
                <img src="/servisoft.png" alt="Servisoft" className="h-6 w-auto" />
              </a>
              <a 
                href="#"
                onClick={openModal}
                className="flex items-center text-sm font-medium"
              >
                <FaInfoCircle size={16} className="mr-1" />
                <span>Información Legal</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-black w-11/12 mx-auto"></div>
        <div className="container px-4 mx-auto">
          <p className="py-2 text-xs font-medium text-center">
            © 2025 Servisoft todos los derechos reservados.
          </p>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
          <div className="relative bg-white rounded-lg shadow-2xl p-4 w-full max-w-3xl mx-auto overflow-auto h-[70vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex-1 text-center">
                Información Legal
              </h2>
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
