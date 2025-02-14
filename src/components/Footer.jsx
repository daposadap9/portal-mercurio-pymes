import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gradient-to-r from-teal-600 via-blue-800 to-teal-600 text-white py-4 shadow-xl  z-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center">
        {/* Sección izquierda */}
        <div className="flex-1 text-center">
          <p className="text-sm md:text-base font-semibold">
            ServiSoft S.A. | Gestión Documental, Mercurio BPM, ECM, Custodia documental, Digitalización de documentos - servisoft 2025 todos los derechos reservados
          </p>
        </div>
        
        {/* Separador: vertical en desktop */}
        <div className="hidden md:block h-8 w-px bg-white mx-4"></div>
        {/* Separador: horizontal en mobile */}
        <div className="block md:hidden w-full h-px bg-white my-2"></div>
        
        {/* Sección derecha */}
        <div className="flex-1 text-center">
          <p className="text-sm md:text-base font-semibold">
            Contáctanos
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
