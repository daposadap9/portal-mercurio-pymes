// components/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen relative bg-white text-black">
      {/* Capa de fondo con la imagen y opacidad */}
      <div 
        className="absolute inset-0 bg-[url('/monocromo.png')] bg-fixed bg-center bg-cover opacity-20"
      ></div>

      {/* Contenido principal (se mostrará por encima de la capa de fondo) */}
      <div className="relative z-10">
        {/* Header fijo en la parte superior */}
        <Header />

        {/* Área principal: se le agrega padding para evitar que el contenido quede oculto */}
        <main className="pt-10 pb-20">
          {/* Contenedor con un ancho máximo y centrado */}
          <div className="max-w-7xl mx-auto px-4 pb-20">
            {children}
          </div>
        </main>

        {/* Footer fijo en la parte inferior */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
