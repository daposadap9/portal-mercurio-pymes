import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import SubNavigation from './SubNavigation';
import { DropdownProvider } from '@/context/DropdownContext';

const Layout = ({ children, handleNavigation, loading }) => {
  const router = useRouter();
  const previousPageProp = router.query.previousPage || children?.type?.previousPage || null;
  const pathSegments = router.asPath.split('/').filter(seg => seg !== '');
  const showSubNav = pathSegments.length > 1 || previousPageProp;

  return (
    <DropdownProvider>
      <div className="relative min-h-screen text-black">
        {/* Fondo degradado fijo */}
        <div className="fixed inset-0 w-screen bg-gradient-to-tl from-teal-500 via-white to-white opacity-95 bg-fixed"></div>

        {/* Capa de imagen superpuesta (opcional) */}
        <div className="absolute inset-0 bg-fixed bg-center bg-cover opacity-20"></div>

        {/* Contenedor interno */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header handleNavigation={handleNavigation} loading={loading} />
          {showSubNav && <SubNavigation previousPage={previousPageProp} />}
          <main className="flex-grow pt-4 md:pb-20 pb-2">
            <div className="mx-auto w-full h-full px-4 md:p-10 pb-2">{children}</div>
          </main>
        <Footer handleNavigation={handleNavigation} />
        </div>

        {/* Estilos globales */}
        <style jsx global>{`
          * {
            margin: 0;
            padding: 0;
          }
          html,
          body {
            font-family: 'Candara';
            background-color: white;
            scroll-behavior: smooth;
          }
          @media (max-width: 768px) {
            html,
            body {
              font-family: 'Candara', sans-serif;
            }
          }
        `}</style>
      </div>
    </DropdownProvider>
  );
};

export default Layout;
