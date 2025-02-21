import React from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import SubNavigation from './SubNavigation';

const Layout = ({ children, handleNavigation, loading }) => {
  const router = useRouter();
  const pathSegments = router.asPath.split('/').filter(seg => seg !== '');
  const showSubNav = pathSegments.length > 1;

  // Función para generar un delay aleatorio negativo
  const randomDelay = () => `-${Math.random() * 15}s`;

  return (
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
        <main className="flex-grow pt-2 md:pb-20 pb-2">
          <div className="mx-auto max-w-full px-4 md:p-10 pb-2">
            {children}
          </div>
        </main>
        {/* <Footer /> */}
      </div>

      {/* Estilos globales */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css?family=Exo:400,700');
        * { margin: 0; padding: 0; }
        body { font-family: 'Exo', sans-serif; }
        
        .circles {
          width: 100%;
          height: 100%;
          overflow: hidden;
          top: 0;
          left: 0;
        }
        .circles li {
          position: absolute;
          display: block;
          list-style: none;
          background: rgba(255, 255, 255, 1);
          animation: animate 15s linear infinite;
          bottom: -150px;
          border-radius: 8px;
        }
        /* Distribución para desktop (50 elementos) */
        .circles li:nth-child(1) { left: 2%;  width: 70px; height: 70px; }
        .circles li:nth-child(2) { left: 8%;  width: 80px; height: 80px; }
        .circles li:nth-child(3) { left: 14%; width: 65px; height: 65px; }
        .circles li:nth-child(4) { left: 20%; width: 90px; height: 90px; }
        .circles li:nth-child(5) { left: 26%; width: 75px; height: 75px; }
        .circles li:nth-child(6) { left: 32%; width: 85px; height: 85px; }
        .circles li:nth-child(7) { left: 38%; width: 70px; height: 70px; }
        .circles li:nth-child(8) { left: 44%; width: 80px; height: 80px; }
        .circles li:nth-child(9) { left: 50%; width: 70px; height: 70px; }
        .circles li:nth-child(10) { left: 56%; width: 80px; height: 80px; }
        .circles li:nth-child(11) { left: 62%; width: 70px; height: 70px; }
        .circles li:nth-child(12) { left: 68%; width: 65px; height: 65px; }
        .circles li:nth-child(13) { left: 74%; width: 80px; height: 80px; }
        .circles li:nth-child(14) { left: 80%; width: 70px; height: 70px; }
        .circles li:nth-child(15) { left: 86%; width: 85px; height: 85px; }
        .circles li:nth-child(16) { left: 92%; width: 70px; height: 70px; }
        .circles li:nth-child(17) { left: 5%; width: 75px; height: 75px; }
        .circles li:nth-child(18) { left: 12%; width: 80px; height: 80px; }
        .circles li:nth-child(19) { left: 19%; width: 70px; height: 70px; }
        .circles li:nth-child(20) { left: 26%; width: 85px; height: 85px; }
        .circles li:nth-child(21) { left: 33%; width: 75px; height: 75px; }
        .circles li:nth-child(22) { left: 40%; width: 70px; height: 70px; }
        .circles li:nth-child(23) { left: 47%; width: 80px; height: 80px; }
        .circles li:nth-child(24) { left: 54%; width: 75px; height: 75px; }
        .circles li:nth-child(25) { left: 61%; width: 85px; height: 85px; }
        .circles li:nth-child(26) { left: 68%; width: 70px; height: 70px; }
        .circles li:nth-child(27) { left: 75%; width: 65px; height: 65px; }
        .circles li:nth-child(28) { left: 82%; width: 80px; height: 80px; }
        .circles li:nth-child(29) { left: 89%; width: 75px; height: 75px; }
        .circles li:nth-child(30) { left: 96%; width: 85px; height: 85px; }
        .circles li:nth-child(31) { left: 3%; width: 70px; height: 70px; }
        .circles li:nth-child(32) { left: 8%; width: 80px; height: 80px; }
        .circles li:nth-child(33) { left: 13%; width: 75px; height: 75px; }
        .circles li:nth-child(34) { left: 18%; width: 85px; height: 85px; }
        .circles li:nth-child(35) { left: 23%; width: 70px; height: 70px; }
        .circles li:nth-child(36) { left: 28%; width: 80px; height: 80px; }
        .circles li:nth-child(37) { left: 33%; width: 75px; height: 75px; }
        .circles li:nth-child(38) { left: 38%; width: 85px; height: 85px; }
        .circles li:nth-child(39) { left: 43%; width: 70px; height: 70px; }
        .circles li:nth-child(40) { left: 48%; width: 80px; height: 80px; }
        .circles li:nth-child(41) { left: 53%; width: 75px; height: 75px; }
        .circles li:nth-child(42) { left: 58%; width: 85px; height: 85px; }
        .circles li:nth-child(43) { left: 63%; width: 70px; height: 70px; }
        .circles li:nth-child(44) { left: 68%; width: 80px; height: 80px; }
        .circles li:nth-child(45) { left: 73%; width: 75px; height: 75px; }
        .circles li:nth-child(46) { left: 78%; width: 85px; height: 85px; }
        .circles li:nth-child(47) { left: 83%; width: 70px; height: 70px; }
        .circles li:nth-child(48) { left: 88%; width: 80px; height: 80px; }
        .circles li:nth-child(49) { left: 93%; width: 75px; height: 75px; }
        .circles li:nth-child(50) { left: 98%; width: 85px; height: 85px; }
        
        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-1200px) rotate(720deg);
            opacity: 0;
          }
        }

        /* En mobile, se muestran solo los primeros 15 elementos */
        @media (max-width: 768px) {
          .circles li {
            display: none;
          }
          .circles li:nth-child(-n+0) {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
