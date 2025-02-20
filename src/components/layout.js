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
    <div className="relative min-h-screen bg-white text-black">
      {/* Capa de fondo */}
      <div 
        className="absolute inset-0 bg-[url('/monocromo.webp')] bg-fixed bg-center bg-cover opacity-20"
      ></div>

      {/* Contenedor interno: flex-col para que el main crezca y empuje el footer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header handleNavigation={handleNavigation} loading={loading} />

        {showSubNav && <SubNavigation />}

        {/* Contenido principal que crece */}
        <main className="flex-grow pt-2 md:pb-20 pb-2">
          <div className="mx-auto max-w-full px-4 md:p-10 pb-2">
            {children}
          </div>
        </main>

        {/* Footer: en mobile se posiciona en el flujo y se empuja al fondo */}
        {/*<Footer />*/}
      </div>
    </div>
  );
};

export default Layout;
