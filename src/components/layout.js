import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import SubNavigation from './SubNavigation';

const Layout = ({ children, handleNavigation, loading }) => {
  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(seg => seg !== '');
  const showSubNav = pathSegments.length > 1;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Función para generar un delay aleatorio negativo
  const randomDelay = () => `-${Math.random() * 15}s`;

  return (
    <div className="relative min-h-screen text-black font-exo">
      {/* Fondo degradado fijo */}
      <div 
        className="absolute inset-0 bg-gradient-to-tl from-teal-600 via-teal-100 to-white opacity-95 bg-fixed"
      ></div>

      {/* Contenedor interno */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header handleNavigation={handleNavigation} loading={loading} />
        {showSubNav && <SubNavigation />}
        <main className="flex-grow pt-2 md:pb-20 pb-2">
          <div className="mx-auto max-w-full px-4 md:p-10 pb-2">
            {children}
          </div>
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
