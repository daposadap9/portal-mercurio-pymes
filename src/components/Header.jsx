import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FaHome, 
  FaConciergeBell, 
  FaFileAlt, 
  FaEnvelope, 
  FaSignInAlt, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';
import React, { useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Función para determinar si el enlace es la ruta actual
  const isActive = (href) => router.pathname === href;

  // Clase base para los enlaces de desktop
  const baseLinkClass =
    "flex items-center font-bold p-2 transition-colors duration-300 ease-in-out transform hover:scale-105";

  const activeClass = "bg-teal-600 text-white rounded-md";
  const inactiveClass = "text-teal-600 hover:bg-teal-600 hover:text-white hover:rounded-md";

  return (
    <header className="sticky top-0 w-full bg-slate-100 shadow-lg z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Sección izquierda: Logo */}
        <div className="flex items-center">
          <img 
            src="/logo-servisoft-30years.png" 
            alt="Logo Servisoft" 
            className="w-56" 
          />
        </div>

        {/* Menú para pantallas grandes (lg) */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/" legacyBehavior>
            <a className={`${baseLinkClass} ${isActive('/') ? activeClass : inactiveClass}`}>
              <FaHome className="mr-2" /> INICIO
            </a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className={`${baseLinkClass} ${isActive('/about') ? activeClass : inactiveClass}`}>
              <FaConciergeBell className="mr-2" /> SERVICIOS
            </a>
          </Link>
          <Link href="/tramites" legacyBehavior>
            <a className={`${baseLinkClass} ${isActive('/tramites') ? activeClass : inactiveClass}`}>
              <FaFileAlt className="mr-2" /> TRAMITES
            </a>
          </Link>
          <Link href="/contactanos" legacyBehavior>
            <a className={`${baseLinkClass} ${isActive('/contactanos') ? activeClass : inactiveClass}`}>
              <FaEnvelope className="mr-2" /> CONTACTENOS
            </a>
          </Link>
        </div>

        {/* Botón de Iniciar Sesión para pantallas grandes (lg) */}
        <div className="hidden lg:flex items-center">
          <Link href="/login" legacyBehavior>
            <a className={`${baseLinkClass} ${isActive('/login') ? activeClass : "text-white bg-teal-500 hover:bg-teal-600"} rounded-md`}>
              <FaSignInAlt className="mr-2" /> INGRESAR
            </a>
          </Link>
        </div>

        {/* Botón de menú móvil (visible para pantallas menores a lg) */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu} 
            className="text-teal-600 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil: visible solo en pantallas menores a lg */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-slate-100 shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-3">
            <Link href="/" legacyBehavior>
              <a onClick={toggleMobileMenu} className={`${baseLinkClass} ${isActive('/') ? activeClass : inactiveClass}`}>
                <FaHome className="mr-2" /> INICIO
              </a>
            </Link>
            <Link href="/about" legacyBehavior>
              <a onClick={toggleMobileMenu} className={`${baseLinkClass} ${isActive('/about') ? activeClass : inactiveClass}`}>
                <FaConciergeBell className="mr-2" /> SERVICIOS
              </a>
            </Link>
            <Link href="/tramites" legacyBehavior>
              <a onClick={toggleMobileMenu} className={`${baseLinkClass} ${isActive('/tramites') ? activeClass : inactiveClass}`}>
                <FaFileAlt className="mr-2" /> TRAMITES
              </a>
            </Link>
            <Link href="/contactanos" legacyBehavior>
              <a onClick={toggleMobileMenu} className={`${baseLinkClass} ${isActive('/contactanos') ? activeClass : inactiveClass}`}>
                <FaEnvelope className="mr-2" /> CONTACTENOS
              </a>
            </Link>
            <Link href="/login" legacyBehavior>
              <a onClick={toggleMobileMenu} className={`${baseLinkClass} ${isActive('/login') ? activeClass : "text-teal-600 hover:bg-teal-600 hover:text-white hover:rounded-md"}`}>
                <FaSignInAlt className="mr-2" /> INGRESAR
              </a>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
