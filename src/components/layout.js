import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import SubNavigation from './SubNavigation';
import { DropdownProvider } from '@/context/DropdownContext';

const Layout = ({ children, handleNavigation, loading }) => {
  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(seg => seg !== '');
  const showSubNav = pathSegments.length > 1;

  // Función para generar un delay aleatorio negativo
  const randomDelay = () => `-${Math.random() * 15}s`;

  return (
    <DropdownProvider>
      <div className="relative min-h-screen text-black font-exo">
        {/* Fondo degradado fijo */}
        <div 
          className="absolute inset-0 bg-gradient-to-tl from-teal-500 via-white to-white opacity-95 bg-fixed"
        ></div>
        
        {/* Capa de cuadros animados fijos: 50 elementos en desktop, 15 en mobile */}
        <ul className="circles fixed inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, index) => (
            <li key={index} style={{ animationDelay: randomDelay() }}></li>
          ))}
        </ul>

        {/* Capa de imagen superpuesta (opcional) */}
        <div 
          className="absolute inset-0 bg-fixed bg-center bg-cover opacity-20"
        ></div>

        {/* Contenedor interno */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header handleNavigation={handleNavigation} loading={loading} />
          {showSubNav && <SubNavigation />}
          <main className="flex-grow pt-4 md:pb-20 pb-2">
            <div className="mx-auto w-full h-full px-4 md:p-10 pb-2">
              {children}
            </div>
          </main>
          {/* <Footer /> */}
        </div>

        
        {/* Estilos globales */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css?family=Exo:400,700');
          * { margin: 0; padding: 0; }
          html, body { 
            font-family: 'Exo', sans-serif;
            background-color: white; /* Color de fondo para evitar el negro */
            scroll-behavior: smooth;
            min-height: 100vh; /* Asegura que el fondo cubra todo el viewport */
          }
          }
        `}</style>
      </div>
    </DropdownProvider>
  );
};

export default Layout;
