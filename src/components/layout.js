// components/Layout.js
import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import SubNavigation from './SubNavigation';

const Layout = ({ children, handleNavigation, loading }) => {
  const router = useRouter();
  // Detectamos si la ruta actual es "anidada" (más de un segmento)
  const pathSegments = router.asPath.split('/').filter(seg => seg !== '');
  const showSubNav = pathSegments.length > 1;

  return (
    <div className="min-h-screen relative bg-white text-black">
      {/* Capa de fondo */}
      <div 
        className="absolute inset-0 bg-[url('/monocromo.png')] bg-fixed bg-center bg-cover opacity-20"
      ></div>

      {/* Contenido principal */}
      <div className="relative z-10">
        <Header handleNavigation={handleNavigation} loading={loading} />

        {/* Mostrar subnavegación si la ruta es anidada */}
        {showSubNav && <SubNavigation />}

        <main className="pt-10 pb-20">
          <div className="max-w-7xl mx-auto px-4 pb-20">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
